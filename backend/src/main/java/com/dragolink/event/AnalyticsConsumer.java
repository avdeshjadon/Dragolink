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

@Component
@RequiredArgsConstructor
@Slf4j
public class AnalyticsConsumer {

    private final ClickAnalyticsRepository clickAnalyticsRepository;
    private final ShortLinkRepository shortLinkRepository;
    private final ObjectMapper objectMapper;

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

            ClickAnalytics analytics = ClickAnalytics.builder()
                    .shortLink(link)
                    .ipAddress(ip)
                    .browser(link.isTrackBrowser() ? getBrowser(userAgentStr) : "Anonymous")
                    .operatingSystem(link.isTrackOs() ? getOs(userAgentStr) : "Anonymous")
                    .deviceType(link.isTrackDevice() ? getDevice(userAgentStr) : "Anonymous")
                    .referrer(link.isTrackReferrer() ? (String) event.get("referrer") : "Anonymous")
                    .clickedAt(LocalDateTime.parse((String) event.get("clickedAt")))
                    .country(country)
                    .region(region)
                    .city(city)
                    .zip(zip)
                    .latitude(latitude)
                    .longitude(longitude)
                    .timezone(timezone)
                    .isp(isp)
                    .build();

            clickAnalyticsRepository.save(analytics);
            shortLinkRepository.incrementClickCount(linkId);

        } catch (Exception e) {
            log.error("Error processing click event", e);
        }
    }

    private String getBrowser(String ua) {
        if (ua == null) return "Unknown";
        if (ua.contains("Edg/")) return "Edge";
        if (ua.contains("Chrome/")) return "Chrome";
        if (ua.contains("Firefox/")) return "Firefox";
        if (ua.contains("Safari/") && !ua.contains("Chrome/")) return "Safari";
        return "Other";
    }

    private String getOs(String ua) {
        if (ua == null) return "Unknown";
        if (ua.contains("Windows")) return "Windows";
        if (ua.contains("Mac OS X")) return "Mac OS";
        if (ua.contains("Android")) return "Android";
        if (ua.contains("Linux")) return "Linux";
        if (ua.contains("iPhone") || ua.contains("iPad")) return "iOS";
        return "Other";
    }

    private String getDevice(String ua) {
        if (ua == null) return "Unknown";
        if (ua.contains("Mobile") || ua.contains("Android") || ua.contains("iPhone")) return "Mobile";
        if (ua.contains("iPad") || ua.contains("Tablet")) return "Tablet";
        return "Desktop";
    }
}
