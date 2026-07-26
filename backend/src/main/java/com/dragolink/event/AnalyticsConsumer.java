package com.dragolink.event;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.dragolink.entity.ClickAnalytics;
import com.dragolink.entity.ShortLink;
import com.dragolink.repository.ClickAnalyticsRepository;
import com.dragolink.repository.ShortLinkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
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
    private final UserAgentAnalyzer uaa = UserAgentAnalyzer.newBuilder().hideMatcherLoadStats().withCache(10000).build();

    @KafkaListener(topics = "link-click-events", groupId = "dragolink-group")
    public void consume(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, new TypeReference<>() {});
            Long linkId = ((Number) event.get("linkId")).longValue();
            String userAgentStr = (String) event.get("userAgent");

            ShortLink link = shortLinkRepository.findById(linkId).orElse(null);
            if (link == null) return;

            UserAgent userAgent = uaa.parse(userAgentStr);

            ClickAnalytics analytics = ClickAnalytics.builder()
                    .shortLink(link)
                    .ipAddress(link.isTrackIp() ? (String) event.get("ipAddress") : "Anonymous")
                    .browser(link.isTrackBrowser() ? userAgent.getValue(UserAgent.AGENT_NAME) : "Anonymous")
                    .operatingSystem(link.isTrackOs() ? userAgent.getValue(UserAgent.OPERATING_SYSTEM_NAME) : "Anonymous")
                    .deviceType(link.isTrackDevice() ? userAgent.getValue(UserAgent.DEVICE_CLASS) : "Anonymous")
                    .referrer(link.isTrackReferrer() ? (String) event.get("referrer") : "Anonymous")
                    .clickedAt(LocalDateTime.parse((String) event.get("clickedAt")))
                    .build();

            clickAnalyticsRepository.save(analytics);
            shortLinkRepository.incrementClickCount(linkId);

        } catch (Exception e) {
            log.error("Error processing click event", e);
        }
    }
}
