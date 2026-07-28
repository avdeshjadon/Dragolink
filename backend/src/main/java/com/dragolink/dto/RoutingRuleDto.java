package com.dragolink.dto;

import com.dragolink.entity.RoutingRuleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutingRuleDto {
    private Long id;
    private RoutingRuleType type;
    private String conditionValue;
    private String destinationUrl;
}
