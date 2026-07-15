package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClickDetailsDto {
    private String ipAddress;
    private String browser;
    private String operatingSystem;
    private String deviceType;
    private String referrer;
    private LocalDateTime clickedAt;
}
