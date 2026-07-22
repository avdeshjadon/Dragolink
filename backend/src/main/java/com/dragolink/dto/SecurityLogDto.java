package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SecurityLogDto {
    private String eventType;
    private String ipAddress;
    private String device;
    private String location;
    private String userEmail;
    private LocalDateTime createdAt;
}
