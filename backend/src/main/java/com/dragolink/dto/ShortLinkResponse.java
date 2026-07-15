package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ShortLinkResponse {
    private Long id;
    private String longUrl;
    private String shortCode;
    private String customAlias;
    private String title;
    private boolean active;
    private LocalDateTime expiryDate;
    private long clickCount;
    private LocalDateTime createdAt;
    
    public String getShortUrl(String baseUrl) {
        return baseUrl + (customAlias != null ? customAlias : shortCode);
    }
}
