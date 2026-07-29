/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.dto;

import com.dragolink.entity.RoutingRuleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class RoutingRuleRequest {
    @NotNull(message = "Routing rule type is required")
    private RoutingRuleType type;

    @NotBlank(message = "Routing condition is required")
    private String conditionValue;

    @NotBlank(message = "Destination URL is required")
    @URL(message = "Invalid URL format for routing destination")
    private String destinationUrl;
}
