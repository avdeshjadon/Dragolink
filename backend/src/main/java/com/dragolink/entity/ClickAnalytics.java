/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_analytics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_link_id", nullable = false)
    private ShortLink shortLink;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(length = 100)
    private String browser;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(length = 500)
    private String referrer;

    @Column(name = "clicked_at", nullable = false)
    private LocalDateTime clickedAt;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String region;

    @Column(length = 100)
    private String city;

    @Column(length = 20)
    private String zip;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(length = 100)
    private String timezone;

    @Column(length = 255)
    private String isp;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(length = 50)
    private String language;

    @Column(name = "is_bot")
    private Boolean isBot;

    @Column(name = "browser_version", length = 50)
    private String browserVersion;

    @Column(name = "os_version", length = 50)
    private String osVersion;

    @Column(name = "qr_scan")
    private Boolean qrScan;

    @Column(name = "referrer_channel", length = 50)
    private String referrerChannel;

    @Column(name = "utm_source", length = 100)
    private String utmSource;

    @Column(name = "utm_medium", length = 100)
    private String utmMedium;

    @Column(name = "utm_campaign", length = 100)
    private String utmCampaign;

    @Column(name = "utm_term", length = 255)
    private String utmTerm;

    @Column(name = "utm_content", length = 255)
    private String utmContent;
}
