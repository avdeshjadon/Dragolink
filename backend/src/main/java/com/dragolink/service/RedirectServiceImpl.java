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
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RedirectServiceImpl implements RedirectService {

    private final ShortLinkRepository shortLinkRepository;
    private final StringRedisTemplate redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_PREFIX = "shortlink:";
    private static final String TOPIC = "link-click-events";

    @Override
    public String getLongUrlAndRecordClick(String shortCode, HttpServletRequest request) {
        String cacheKey = CACHE_PREFIX + shortCode;
        String longUrl = redisTemplate.opsForValue().get(cacheKey);
        Long linkId = null;

        if (longUrl == null) {
            ShortLink link = shortLinkRepository.findByCustomAlias(shortCode)
                    .orElseGet(() -> shortLinkRepository.findByShortCode(shortCode)
                            .orElseThrow(() -> new ResourceNotFoundException("Link not found")));

            if (!link.isActive()) {
                throw new BadRequestException("Link is disabled");
            }
            if (link.getExpiryDate() != null && link.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new BadRequestException("Link has expired");
            }

            longUrl = link.getLongUrl();
            linkId = link.getId();

            // Cache it
            long ttl = link.getExpiryDate() != null ? 
                    Duration.between(LocalDateTime.now(), link.getExpiryDate()).getSeconds() : 
                    86400; // 24 hours
            if (ttl > 0) {
                redisTemplate.opsForValue().set(cacheKey, longUrl + "::" + linkId, Duration.ofSeconds(ttl));
            }
        } else {
            // Parse cached value which is "longUrl::linkId"
            String[] parts = longUrl.split("::");
            longUrl = parts[0];
            linkId = Long.parseLong(parts[1]);
        }

        publishClickEvent(shortCode, linkId, request);

        return longUrl;
    }

    @SneakyThrows
    private void publishClickEvent(String shortCode, Long linkId, HttpServletRequest request) {
        Map<String, Object> event = new HashMap<>();
        event.put("shortCode", shortCode);
        event.put("linkId", linkId);
        event.put("ipAddress", getClientIp(request));
        event.put("userAgent", request.getHeader("User-Agent"));
        event.put("referrer", request.getHeader("Referer"));
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
