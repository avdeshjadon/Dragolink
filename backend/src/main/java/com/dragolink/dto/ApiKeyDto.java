package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ApiKeyDto {
    private Long id;
    private String name;
    private String prefix;
    private LocalDateTime lastUsedAt;
    private LocalDateTime createdAt;
}
