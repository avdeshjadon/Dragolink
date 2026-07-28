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
