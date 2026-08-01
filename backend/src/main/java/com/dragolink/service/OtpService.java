package com.dragolink.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate redisTemplate;
    private final SecureRandom secureRandom = new SecureRandom();
    
    private static final String OTP_PREFIX = "otp:";
    private static final int OTP_EXPIRY_MINUTES = 5;

    public String generateAndStoreOtp(String email) {
        // Generate a 6 digit random number
        int number = secureRandom.nextInt(999999);
        String otp = String.format("%06d", number);
        
        // Store in Redis
        redisTemplate.opsForValue().set(
                OTP_PREFIX + email, 
                otp, 
                Duration.ofMinutes(OTP_EXPIRY_MINUTES)
        );
        
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String key = OTP_PREFIX + email;
        String storedOtp = redisTemplate.opsForValue().get(key);
        
        if (storedOtp != null && storedOtp.equals(otp)) {
            // Delete OTP after successful verification
            redisTemplate.delete(key);
            return true;
        }
        return false;
    }
}
