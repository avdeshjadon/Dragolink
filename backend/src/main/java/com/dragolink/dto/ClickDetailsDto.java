package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClickDetailsDto {
    private Long id;
    private String ipAddress;
    private String browser;
    private String operatingSystem;
    private String deviceType;
    private String referrer;
    private LocalDateTime clickedAt;
    private String country;
    private String region;
    private String city;
    private String zip;
    private Double latitude;
    private Double longitude;
    private String timezone;
    private String isp;

    private String userAgent;
    private String language;
    private Boolean isBot;
    private String browserVersion;
    private String osVersion;
    private Boolean qrScan;
    private String referrerChannel;
    private String utmSource;
    private String utmMedium;
    private String utmCampaign;
    private String utmTerm;
    private String utmContent;
}
