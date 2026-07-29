/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.service;

import com.dragolink.dto.AnalyticsDashboardDto;
import com.dragolink.dto.ClickDetailsDto;
import com.dragolink.dto.ShortLinkResponse;
import com.dragolink.entity.ShortLink;
import com.dragolink.entity.User;
import com.dragolink.exception.ResourceNotFoundException;
import com.dragolink.repository.ClickAnalyticsRepository;
import com.dragolink.repository.ShortLinkRepository;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.LinkedHashMap;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ClickAnalyticsRepository clickAnalyticsRepository;
    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;

    public AnalyticsDashboardDto getDashboard(UserDetails userDetails, int days) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Long userId = user.getId();

        List<ShortLink> allLinks = shortLinkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        long totalLinks = allLinks.size();
        long totalClicks = allLinks.stream().mapToLong(ShortLink::getClickCount).sum();
        long activeLinks = allLinks.stream().filter(ShortLink::isActive).count();
        long expiredLinks = allLinks.stream().filter(l -> l.getExpiryDate() != null && l.getExpiryDate().isBefore(LocalDateTime.now())).count();
        
        List<ShortLinkResponse> topLinks = allLinks.stream()
                .sorted((a, b) -> Long.compare(b.getClickCount(), a.getClickCount()))
                .limit(5)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        Map<String, Long> campaignClicks = allLinks.stream()
                .filter(l -> l.getCampaign() != null)
                .collect(Collectors.groupingBy(l -> l.getCampaign().getName(), Collectors.summingLong(ShortLink::getClickCount)));
        
        List<Map<String, Object>> topCampaigns = campaignClicks.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> Map.of("name", (Object) e.getKey(), "clicks", (Object) e.getValue()))
                .collect(Collectors.toList());

        long uniqueVisitors = clickAnalyticsRepository.countUniqueVisitorsByUserId(userId);

        return AnalyticsDashboardDto.builder()
                .totalLinks(totalLinks)
                .totalClicks(totalClicks)
                .uniqueVisitors(uniqueVisitors)
                .activeLinks(activeLinks)
                .expiredLinks(expiredLinks)
                .topLinks(topLinks)
                .topCampaigns(topCampaigns)
                .clicksByDate(clickAnalyticsRepository.countClicksByDate(userId, LocalDateTime.now().minusDays(days)))
                .clicksByDevice(clickAnalyticsRepository.countClicksByDevice(userId))
                .clicksByBrowser(clickAnalyticsRepository.countClicksByBrowser(userId))
                .clicksByReferrer(clickAnalyticsRepository.countClicksByReferrer(userId))
                .clicksByCountry(clickAnalyticsRepository.countClicksByCountry(userId))
                // recentClicks can be filled by querying across all user's links, skipping for simplicity in dashboard, or fetch top 10
                .build();
    }

    public List<ClickDetailsDto> getLinkAnalytics(Long linkId, UserDetails userDetails) {
        // Validation of ownership should be done here
        return clickAnalyticsRepository.findByShortLinkIdOrderByClickedAtDesc(linkId)
                .stream()
                .map(ca -> ClickDetailsDto.builder()
                        .id(ca.getId())
                        .ipAddress(ca.getIpAddress())
                        .browser(ca.getBrowser())
                        .operatingSystem(ca.getOperatingSystem())
                        .deviceType(ca.getDeviceType())
                        .referrer(ca.getReferrer())
                        .clickedAt(ca.getClickedAt())
                        .country(ca.getCountry())
                        .region(ca.getRegion())
                        .city(ca.getCity())
                        .zip(ca.getZip())
                        .latitude(ca.getLatitude())
                        .longitude(ca.getLongitude())
                        .timezone(ca.getTimezone())
                        .isp(ca.getIsp())
                        .userAgent(ca.getUserAgent())
                        .language(ca.getLanguage())
                        .isBot(ca.getIsBot())
                        .browserVersion(ca.getBrowserVersion())
                        .osVersion(ca.getOsVersion())
                        .qrScan(ca.getQrScan())
                        .referrerChannel(ca.getReferrerChannel())
                        .utmSource(ca.getUtmSource())
                        .utmMedium(ca.getUtmMedium())
                        .utmCampaign(ca.getUtmCampaign())
                        .utmTerm(ca.getUtmTerm())
                        .utmContent(ca.getUtmContent())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteClickLog(Long linkId, Long logId, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ShortLink link = shortLinkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));
        
        if (!link.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to link");
        }
        
        com.dragolink.entity.ClickAnalytics log = clickAnalyticsRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Log not found"));
                
        if (!log.getShortLink().getId().equals(linkId)) {
            throw new RuntimeException("Log does not belong to this link");
        }
        
        clickAnalyticsRepository.delete(log);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteAllClickLogs(Long linkId, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ShortLink link = shortLinkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));
                
        if (!link.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to link");
        }
        
        clickAnalyticsRepository.deleteByShortLinkId(linkId);
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
}
