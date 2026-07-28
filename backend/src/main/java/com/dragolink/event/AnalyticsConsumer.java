package com.dragolink.event;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.dragolink.entity.ClickAnalytics;
import com.dragolink.entity.ShortLink;
import com.dragolink.repository.ClickAnalyticsRepository;
import com.dragolink.repository.ShortLinkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

import com.dragolink.service.UserAgentParserService;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnalyticsConsumer {

    private final ClickAnalyticsRepository clickAnalyticsRepository;
    private final ShortLinkRepository shortLinkRepository;
    private final ObjectMapper objectMapper;
    private final UserAgentParserService userAgentParserService;

    @KafkaListener(topics = "link-click-events", groupId = "dragolink-group")
    @org.springframework.transaction.annotation.Transactional
    public void consume(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, new TypeReference<>() {});
            Long linkId = ((Number) event.get("linkId")).longValue();
            String userAgentStr = (String) event.get("userAgent");

            ShortLink link = shortLinkRepository.findById(linkId).orElse(null);
            if (link == null) return;

            String ip = link.isTrackIp() ? (String) event.get("ipAddress") : "Anonymous";
            String country = "Unknown";
            String region = "Unknown";
            String city = "Unknown";
            String zip = "Unknown";
            Double latitude = null;
            Double longitude = null;
            String timezone = "Unknown";
            String isp = "Unknown";

            if (!"Anonymous".equals(ip) && !"127.0.0.1".equals(ip) && !"localhost".equals(ip)) {
                try {
                    org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                    Map<String, Object> location = restTemplate.getForObject("http://ip-api.com/json/" + ip, Map.class);
                    if (location != null && "success".equals(location.get("status"))) {
                        country = (String) location.get("country");
                        region = (String) location.get("regionName");
                        city = (String) location.get("city");
                        zip = (String) location.get("zip");
                        if (location.get("lat") instanceof Number) {
                            latitude = ((Number) location.get("lat")).doubleValue();
                        }
                        if (location.get("lon") instanceof Number) {
                            longitude = ((Number) location.get("lon")).doubleValue();
                        }
                        timezone = (String) location.get("timezone");
                        isp = (String) location.get("isp");
                    }
                } catch (Exception e) {
                    log.warn("Failed to fetch location for IP: {}", ip);
                }
            }

            String referrerStr = (String) event.get("referrer");

            ClickAnalytics analytics = ClickAnalytics.builder()
                    .shortLink(link)
                    .ipAddress(ip)
                    .browser(link.isTrackBrowser() ? userAgentParserService.getBrowserName(userAgentStr) : "Anonymous")
                    .operatingSystem(link.isTrackOs() ? userAgentParserService.getOs(userAgentStr) : "Anonymous")
                    .deviceType(link.isTrackDevice() ? userAgentParserService.getDeviceClass(userAgentStr) : "Anonymous")
                    .referrer(link.isTrackReferrer() ? referrerStr : "Anonymous")
                    .clickedAt(LocalDateTime.parse((String) event.get("clickedAt")))
                    .country(country)
                    .region(region)
                    .city(city)
                    .zip(zip)
                    .latitude(latitude)
                    .longitude(longitude)
                    .timezone(timezone)
                    .isp(isp)
                    .userAgent(userAgentStr)
                    .language((String) event.get("language"))
                    .isBot(userAgentParserService.getDeviceClass(userAgentStr).equals("bot") || isBot(userAgentStr))
                    .browserVersion(userAgentParserService.getBrowserVersion(userAgentStr))
                    .osVersion(userAgentParserService.getOsVersion(userAgentStr))
                    .qrScan(Boolean.TRUE.equals(event.get("qrScan")))
                    .referrerChannel(getReferrerChannel(referrerStr))
                    .utmSource((String) event.get("utmSource"))
                    .utmMedium((String) event.get("utmMedium"))
                    .utmCampaign((String) event.get("utmCampaign"))
                    .utmTerm((String) event.get("utmTerm"))
                    .utmContent((String) event.get("utmContent"))
                    .build();
                    
            clickAnalyticsRepository.save(analytics);
            shortLinkRepository.incrementClickCount(linkId);

        } catch (Exception e) {
            log.error("Error processing click event", e);
        }
    }


    private boolean isBot(String ua) {
        if (ua == null) return false;
        String lowerUa = ua.toLowerCase();
        return lowerUa.contains("bot") || lowerUa.contains("crawler") || lowerUa.contains("spider") 
            || lowerUa.contains("slackbot") || lowerUa.contains("whatsapp") || lowerUa.contains("twitterbot")
            || lowerUa.contains("facebookexternalhit") || lowerUa.contains("discordbot") 
            || lowerUa.contains("telegrambot");
    }

    private String getReferrerChannel(String referrer) {
        if (referrer == null || referrer.isEmpty()) return "Direct";
        String lower = referrer.toLowerCase();
        if (lower.contains("google.") || lower.contains("bing.") || lower.contains("yahoo.") || lower.contains("duckduckgo.")) return "Search";
        if (lower.contains("facebook.") || lower.contains("twitter.") || lower.contains("t.co") || lower.contains("linkedin.") 
            || lower.contains("instagram.") || lower.contains("reddit.")) return "Social";
        if (lower.contains("mail.") || lower.contains("outlook.") || lower.contains("gmail.")) return "Email";
        return "Referral";
    }
}
