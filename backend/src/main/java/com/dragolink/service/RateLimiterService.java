package com.dragolink.service;

import com.dragolink.exception.RateLimitExceededException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final StringRedisTemplate redisTemplate;

    public void checkRateLimit(String key, int maxRequests, int timeWindowSeconds) {
        String countStr = redisTemplate.opsForValue().get(key);
        int currentCount = countStr != null ? Integer.parseInt(countStr) : 0;

        if (currentCount >= maxRequests) {
            throw new RateLimitExceededException("Rate limit exceeded for key: " + key);
        }

        if (currentCount == 0) {
            redisTemplate.opsForValue().set(key, "1", Duration.ofSeconds(timeWindowSeconds));
        } else {
            redisTemplate.opsForValue().increment(key);
        }
    }
}
