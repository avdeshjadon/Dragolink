/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.dragolink.entity.ShortLink;
import com.dragolink.exception.BadRequestException;
import com.dragolink.exception.ResourceNotFoundException;
import com.dragolink.repository.ShortLinkRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.util.UriComponentsBuilder;
import com.dragolink.dto.RoutingRuleDto;
import com.dragolink.dto.ShortLinkCacheDto;
import com.dragolink.entity.RoutingRuleType;

@Service
@RequiredArgsConstructor
public class RedirectServiceImpl implements RedirectService {

    private final ShortLinkRepository shortLinkRepository;
    private final StringRedisTemplate redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final UserAgentParserService userAgentParserService;

    private static final String CACHE_PREFIX = "shortlink:";
    private static final String TOPIC = "link-click-events";

    @Override
    @SneakyThrows
    public String getLongUrlAndRecordClick(String shortCode, HttpServletRequest request) {
        String cacheKey = CACHE_PREFIX + shortCode;
        String cachedValue = redisTemplate.opsForValue().get(cacheKey);
        
        ShortLinkCacheDto cacheDto;

        if (cachedValue == null) {
            ShortLink link = shortLinkRepository.findByCustomAlias(shortCode)
                    .orElseGet(() -> shortLinkRepository.findByShortCode(shortCode)
                            .orElseThrow(() -> new ResourceNotFoundException("Link not found")));

            if (!link.isActive()) {
                throw new BadRequestException("Link is disabled");
            }
            if (link.getExpiryDate() != null && link.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new BadRequestException("Link has expired");
            }

            List<RoutingRuleDto> rules = link.getRoutingRules().stream().map(r -> 
                RoutingRuleDto.builder()
                    .id(r.getId())
                    .type(r.getType())
                    .conditionValue(r.getConditionValue())
                    .destinationUrl(r.getDestinationUrl())
                    .build()
            ).collect(Collectors.toList());

            cacheDto = ShortLinkCacheDto.builder()
                    .linkId(link.getId())
                    .defaultUrl(link.getLongUrl())
                    .utmSource(link.getUtmSource())
                    .utmMedium(link.getUtmMedium())
                    .utmCampaign(link.getUtmCampaign())
                    .utmTerm(link.getUtmTerm())
                    .utmContent(link.getUtmContent())
                    .rules(rules)
                    .build();

            long ttl = link.getExpiryDate() != null ? 
                    Duration.between(LocalDateTime.now(), link.getExpiryDate()).getSeconds() : 
                    86400; // 24 hours
            if (ttl > 0) {
                redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(cacheDto), Duration.ofSeconds(ttl));
            }
        } else {
            // Backward compatibility for old cache format
            if (cachedValue.contains("::")) {
                String[] parts = cachedValue.split("::");
                cacheDto = ShortLinkCacheDto.builder()
                    .defaultUrl(parts[0])
                    .linkId(Long.parseLong(parts[1]))
                    .build();
            } else {
                cacheDto = objectMapper.readValue(cachedValue, ShortLinkCacheDto.class);
            }
        }

        // 1. Evaluate Routing Rules
        String targetUrl = cacheDto.getDefaultUrl();
        if (cacheDto.getRules() != null && !cacheDto.getRules().isEmpty()) {
            String userAgent = request.getHeader("User-Agent");
            
            String userOs = userAgentParserService.getOs(userAgent);
            String userDevice = userAgentParserService.getDeviceClass(userAgent);
            
            for (RoutingRuleDto rule : cacheDto.getRules()) {
                if (rule.getType() == RoutingRuleType.OS && rule.getConditionValue().equalsIgnoreCase(userOs)) {
                    targetUrl = rule.getDestinationUrl();
                    break;
                } else if (rule.getType() == RoutingRuleType.DEVICE && rule.getConditionValue().equalsIgnoreCase(userDevice)) {
                    targetUrl = rule.getDestinationUrl();
                    break;
                }
            }
        }

        // 2. Append UTM Parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(targetUrl);
        boolean addedUtm = false;
        
        if (cacheDto.getUtmSource() != null && !cacheDto.getUtmSource().isEmpty()) { builder.queryParam("utm_source", cacheDto.getUtmSource()); addedUtm = true; }
        if (cacheDto.getUtmMedium() != null && !cacheDto.getUtmMedium().isEmpty()) { builder.queryParam("utm_medium", cacheDto.getUtmMedium()); addedUtm = true; }
        if (cacheDto.getUtmCampaign() != null && !cacheDto.getUtmCampaign().isEmpty()) { builder.queryParam("utm_campaign", cacheDto.getUtmCampaign()); addedUtm = true; }
        if (cacheDto.getUtmTerm() != null && !cacheDto.getUtmTerm().isEmpty()) { builder.queryParam("utm_term", cacheDto.getUtmTerm()); addedUtm = true; }
        if (cacheDto.getUtmContent() != null && !cacheDto.getUtmContent().isEmpty()) { builder.queryParam("utm_content", cacheDto.getUtmContent()); addedUtm = true; }
        
        String finalUrl = addedUtm ? builder.build().toUriString() : targetUrl;

        publishClickEvent(shortCode, cacheDto.getLinkId(), request);

        return finalUrl;
    }

    @SneakyThrows
    private void publishClickEvent(String shortCode, Long linkId, HttpServletRequest request) {
        Map<String, Object> event = new HashMap<>();
        event.put("shortCode", shortCode);
        event.put("linkId", linkId);
        event.put("ipAddress", getClientIp(request));
        event.put("userAgent", request.getHeader("User-Agent"));
        event.put("referrer", request.getHeader("Referer"));
        event.put("language", request.getHeader("Accept-Language"));
        event.put("qrScan", "1".equals(request.getParameter("qr")) || "true".equalsIgnoreCase(request.getParameter("qr")));
        event.put("utmSource", request.getParameter("utm_source"));
        event.put("utmMedium", request.getParameter("utm_medium"));
        event.put("utmCampaign", request.getParameter("utm_campaign"));
        event.put("utmTerm", request.getParameter("utm_term"));
        event.put("utmContent", request.getParameter("utm_content"));
        event.put("clickedAt", LocalDateTime.now().toString());
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                kafkaTemplate.send(TOPIC, String.valueOf(linkId), objectMapper.writeValueAsString(event));
            } catch (Exception e) {
                // Ignore errors so redirect doesn't fail
            }
        });
    }

    private String getClientIp(HttpServletRequest request) {
        String remoteAddr = request.getHeader("X-Forwarded-For");
        if (remoteAddr != null && !remoteAddr.isEmpty()) {
            // X-Forwarded-For can contain multiple IPs, the first one is the client
            return remoteAddr.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
