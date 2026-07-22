package com.dragolink.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomDomainResponse {
    private Long id;
    private String domainName;
    private boolean isDefault;
    private String status;
    private LocalDateTime createdAt;
}
