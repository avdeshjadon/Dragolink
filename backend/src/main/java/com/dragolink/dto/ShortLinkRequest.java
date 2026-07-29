/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ShortLinkRequest {
    @NotBlank(message = "Long URL is required")
    @URL(message = "Invalid URL format")
    private String longUrl;

    @Pattern(regexp = "^[a-zA-Z0-9-_]*$", message = "Custom alias can only contain letters, numbers, hyphens, and underscores")
    private String customAlias;

    private String title;

    private LocalDateTime expiryDate;

    private Boolean trackIp = true;
    private Boolean trackBrowser = true;
    private Boolean trackOs = true;
    private Boolean trackDevice = true;
    private Boolean trackReferrer = true;

    private String utmSource;
    private String utmMedium;
    private String utmCampaign;
    private String utmTerm;
    private String utmContent;

    private List<RoutingRuleRequest> routingRules;
}
