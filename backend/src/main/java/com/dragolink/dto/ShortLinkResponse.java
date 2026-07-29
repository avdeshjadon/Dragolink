/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

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
    
    private boolean trackIp;
    private boolean trackBrowser;
    private boolean trackOs;
    private boolean trackDevice;
    private boolean trackReferrer;
    
    public String getShortUrl(String baseUrl) {
        return baseUrl + (customAlias != null ? customAlias : shortCode);
    }
}
