package com.dragolink.service;

import com.dragolink.dto.ShortLinkRequest;
import com.dragolink.dto.ShortLinkResponse;
import com.dragolink.entity.ShortLink;
import com.dragolink.entity.User;
import com.dragolink.exception.BadRequestException;
import com.dragolink.exception.ResourceNotFoundException;
import com.dragolink.repository.BlockedDomainRepository;
import com.dragolink.repository.ClickAnalyticsRepository;
import com.dragolink.repository.ShortLinkRepository;
import com.dragolink.repository.UserRepository;
import com.dragolink.util.Base62Util;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlShorteningServiceImpl implements UrlShorteningService {

    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;
    private final BlockedDomainRepository blockedDomainRepository;
    private final ClickAnalyticsRepository clickAnalyticsRepository;
    private final StringRedisTemplate redisTemplate;

    private static final String CACHE_PREFIX = "shortlink:";

    @Override
    @Transactional
    public ShortLinkResponse createShortLink(ShortLinkRequest request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
                .active(true)
                .clickCount(0)
                .shortCode("") // Temporary
                .build();

        shortLink = shortLinkRepository.save(shortLink);
        
        // Generate short code based on ID
        String shortCode = Base62Util.encode(shortLink.getId());
        shortLink.setShortCode(shortCode);
        shortLink = shortLinkRepository.save(shortLink);

        return mapToResponse(shortLink);
    }

    @Override
    public List<ShortLinkResponse> getUserLinks(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
        if (!link.getUser().getEmail().equals(userDetails.getUsername())) {
            throw new AccessDeniedException("You do not own this link");
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
                .trackIp(link.isTrackIp())
                .trackBrowser(link.isTrackBrowser())
                .trackOs(link.isTrackOs())
                .trackDevice(link.isTrackDevice())
                .trackReferrer(link.isTrackReferrer())
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
