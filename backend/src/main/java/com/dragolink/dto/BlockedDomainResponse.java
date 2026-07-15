package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BlockedDomainResponse {
    private Long id;
    private String domain;
    private String reason;
    private LocalDateTime createdAt;
}
