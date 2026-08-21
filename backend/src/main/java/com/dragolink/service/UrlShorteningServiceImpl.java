/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.service;

import com.dragolink.dto.ShortLinkRequest;
import com.dragolink.dto.ShortLinkResponse;
import com.dragolink.entity.RoutingRule;
import com.dragolink.entity.RoutingRuleType;
import com.dragolink.entity.ShortLink;
import com.dragolink.entity.User;
import com.dragolink.exception.BadRequestException;
import com.dragolink.exception.ResourceNotFoundException;
import com.dragolink.repository.BlockedDomainRepository;
import com.dragolink.repository.ClickAnalyticsRepository;
import com.dragolink.repository.ShortLinkRepository;
import com.dragolink.repository.UserRepository;
import com.dragolink.repository.CampaignRepository;
import com.dragolink.entity.Campaign;
import com.dragolink.util.Base62Util;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlShorteningServiceImpl implements UrlShorteningService {

    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;
    private final BlockedDomainRepository blockedDomainRepository;
    private final ClickAnalyticsRepository clickAnalyticsRepository;
    private final CampaignRepository campaignRepository;
    private final StringRedisTemplate redisTemplate;
    private final WorkspaceService workspaceService;
    private final NotificationService notificationService;

    private static final String CACHE_PREFIX = "shortlink:";

    @Override
    @Transactional
    public ShortLinkResponse createShortLink(ShortLinkRequest request, UserDetails userDetails) {
        User user = workspaceService.getEffectiveWorkspaceOwner(userDetails);

        if (request.getCustomAlias() != null && !request.getCustomAlias().isEmpty()) {
            if (shortLinkRepository.existsByCustomAlias(request.getCustomAlias()) || shortLinkRepository.existsByShortCode(request.getCustomAlias())) {
                throw new BadRequestException("Custom alias already in use");
            }
        }
        
        String domain = getDomainFromUrl(request.getLongUrl());
        if (blockedDomainRepository.existsByDomain(domain)) {
            throw new BadRequestException("This domain is blocked");
        }
        if (request.getLongUrl().toLowerCase().startsWith("javascript:") || domain.equals("localhost") || domain.startsWith("192.168.") || domain.startsWith("10.") || domain.startsWith("127.")) {
            throw new BadRequestException("Invalid or restricted URL");
        }

        Campaign campaignObj = null;
        if (request.getUtmCampaign() != null && !request.getUtmCampaign().trim().isEmpty()) {
            campaignObj = campaignRepository.findByNameAndUser(request.getUtmCampaign().trim(), user)
                    .orElseGet(() -> {
                        Campaign newCampaign = Campaign.builder()
                                .name(request.getUtmCampaign().trim())
                                .user(user)
                                .build();
                        return campaignRepository.save(newCampaign);
                    });
        }

        ShortLink shortLink = ShortLink.builder()
                .user(user)
                .longUrl(request.getLongUrl())
                .customAlias(request.getCustomAlias() != null && !request.getCustomAlias().isEmpty() ? request.getCustomAlias() : null)
                .title(request.getTitle())
                .expiryDate(request.getExpiryDate())
                .trackIp(request.getTrackIp() != null ? request.getTrackIp() : true)
                .trackBrowser(request.getTrackBrowser() != null ? request.getTrackBrowser() : true)
                .trackOs(request.getTrackOs() != null ? request.getTrackOs() : true)
                .trackDevice(request.getTrackDevice() != null ? request.getTrackDevice() : true)
                .trackReferrer(request.getTrackReferrer() != null ? request.getTrackReferrer() : true)
                .utmSource(request.getUtmSource())
                .utmMedium(request.getUtmMedium())
                .utmCampaign(request.getUtmCampaign())
                .campaign(campaignObj)
                .utmTerm(request.getUtmTerm())
                .utmContent(request.getUtmContent())
                .active(true)
                .clickCount(0)
                .shortCode("") // Temporary
                .build();

        final ShortLink finalShortLink = shortLink;
        if (request.getRoutingRules() != null && !request.getRoutingRules().isEmpty()) {
            List<RoutingRule> rules = request.getRoutingRules().stream().map(r -> RoutingRule.builder()
                    .shortLink(finalShortLink)
                    .type(r.getType())
                    .conditionValue(r.getConditionValue())
                    .destinationUrl(r.getDestinationUrl())
                    .build()).collect(Collectors.toList());
            shortLink.setRoutingRules(rules);
        }

        shortLink = shortLinkRepository.save(shortLink);
        
        // Generate short code based on ID
        String shortCode = Base62Util.encode(shortLink.getId());
        shortLink.setShortCode(shortCode);
        shortLink = shortLinkRepository.save(shortLink);

        notificationService.createNotification(user, "link_created", "Short Link Created", "Successfully created short link for '" + request.getLongUrl() + "'.");

        return mapToResponse(shortLink);
    }

    @Override
    public List<ShortLinkResponse> getUserLinks(UserDetails userDetails) {
        User user = workspaceService.getEffectiveWorkspaceOwner(userDetails);
        return shortLinkRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ShortLinkResponse getLinkDetails(Long id, UserDetails userDetails) {
        ShortLink link = getOwnedLink(id, userDetails);
        return mapToResponse(link);
    }

    @Override
    @Transactional
    public ShortLinkResponse updateLink(Long id, ShortLinkRequest request, UserDetails userDetails) {
        ShortLink link = getOwnedLink(id, userDetails);

        if (request.getCustomAlias() != null && !request.getCustomAlias().isEmpty() && !request.getCustomAlias().equals(link.getCustomAlias())) {
            if (shortLinkRepository.existsByCustomAlias(request.getCustomAlias()) || shortLinkRepository.existsByShortCode(request.getCustomAlias())) {
                throw new BadRequestException("Custom alias already in use");
            }
            link.setCustomAlias(request.getCustomAlias());
        } else if (request.getCustomAlias() == null || request.getCustomAlias().trim().isEmpty()) {
            link.setCustomAlias(null);
        }

        if (request.getLongUrl() != null && !request.getLongUrl().isEmpty()) {
            link.setLongUrl(request.getLongUrl());
        }

        link.setTitle(request.getTitle());
        link.setExpiryDate(request.getExpiryDate());
        
        if (request.getTrackIp() != null) link.setTrackIp(request.getTrackIp());
        if (request.getTrackBrowser() != null) link.setTrackBrowser(request.getTrackBrowser());
        if (request.getTrackOs() != null) link.setTrackOs(request.getTrackOs());
        if (request.getTrackDevice() != null) link.setTrackDevice(request.getTrackDevice());
        if (request.getTrackReferrer() != null) link.setTrackReferrer(request.getTrackReferrer());

        link.setUtmSource(request.getUtmSource());
        link.setUtmMedium(request.getUtmMedium());
        
        if (request.getUtmCampaign() != null && !request.getUtmCampaign().trim().isEmpty()) {
            Campaign campaignObj = campaignRepository.findByNameAndUser(request.getUtmCampaign().trim(), link.getUser())
                    .orElseGet(() -> {
                        Campaign newCampaign = Campaign.builder()
                                .name(request.getUtmCampaign().trim())
                                .user(link.getUser())
                                .build();
                        return campaignRepository.save(newCampaign);
                    });
            link.setCampaign(campaignObj);
        } else {
            link.setCampaign(null);
        }
        link.setUtmCampaign(request.getUtmCampaign());
        link.setUtmTerm(request.getUtmTerm());
        link.setUtmContent(request.getUtmContent());

        if (request.getRoutingRules() != null) {
            link.getRoutingRules().clear();
            List<RoutingRule> rules = request.getRoutingRules().stream().map(r -> RoutingRule.builder()
                    .shortLink(link)
                    .type(r.getType())
                    .conditionValue(r.getConditionValue())
                    .destinationUrl(r.getDestinationUrl())
                    .build()).collect(Collectors.toList());
            link.getRoutingRules().addAll(rules);
        }

        evictCache(link);
        return mapToResponse(shortLinkRepository.save(link));
    }

    @Override
    @Transactional
    public void deleteLink(Long id, UserDetails userDetails) {
        ShortLink link = getOwnedLink(id, userDetails);
        evictCache(link);
        clickAnalyticsRepository.deleteByShortLinkId(link.getId());
        shortLinkRepository.delete(link);
    }

    @Override
    @Transactional
    public ShortLinkResponse toggleLinkStatus(Long id, UserDetails userDetails) {
        ShortLink link = getOwnedLink(id, userDetails);
        link.setActive(!link.isActive());
        evictCache(link);
        return mapToResponse(shortLinkRepository.save(link));
    }

    private void evictCache(ShortLink link) {
        if (link.getShortCode() != null) {
            redisTemplate.delete(CACHE_PREFIX + link.getShortCode());
        }
        if (link.getCustomAlias() != null) {
            redisTemplate.delete(CACHE_PREFIX + link.getCustomAlias());
        }
    }

    private ShortLink getOwnedLink(Long id, UserDetails userDetails) {
        ShortLink link = shortLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));
        User effectiveOwner = workspaceService.getEffectiveWorkspaceOwner(userDetails);
        if (!link.getUser().getId().equals(effectiveOwner.getId())) {
            throw new AccessDeniedException("You do not own this link or have workspace access");
        }
        return link;
    }

    private ShortLinkResponse mapToResponse(ShortLink link) {
        return ShortLinkResponse.builder()
                .id(link.getId())
                .longUrl(link.getLongUrl())
                .shortCode(link.getShortCode())
                .customAlias(link.getCustomAlias())
                .title(link.getTitle())
                .active(link.isActive())
                .expiryDate(link.getExpiryDate())
                .clickCount(link.getClickCount())
                .createdAt(link.getCreatedAt())
                .campaignName(link.getCampaign() != null ? link.getCampaign().getName() : null)
                .trackIp(link.isTrackIp())
                .trackBrowser(link.isTrackBrowser())
                .trackOs(link.isTrackOs())
                .trackDevice(link.isTrackDevice())
                .trackReferrer(link.isTrackReferrer())
                .suspended(link.isSuspended())
                .utmSource(link.getUtmSource())
                .utmMedium(link.getUtmMedium())
                .utmCampaign(link.getUtmCampaign())
                .utmTerm(link.getUtmTerm())
                .utmContent(link.getUtmContent())
                .build();
    }

    private String getDomainFromUrl(String url) {
        try {
            java.net.URI uri = new java.net.URI(url);
            String domain = uri.getHost();
            return domain != null ? domain.startsWith("www.") ? domain.substring(4) : domain : "";
        } catch (Exception e) {
            return "";
        }
    }
}
