package com.dragolink.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "short_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShortLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @OneToMany(mappedBy = "shortLink", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RoutingRule> routingRules = new ArrayList<>();

    @Column(name = "long_url", nullable = false, length = 2048)
    private String longUrl;

    @Column(name = "short_code", nullable = false, unique = true, length = 20)
    private String shortCode;

    @Column(name = "custom_alias", unique = true, length = 50)
    private String customAlias;

    @Column(length = 255)
    private String title;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "click_count", nullable = false)
    @Builder.Default
    private long clickCount = 0;

    @Column(name = "track_ip", nullable = false)
    @Builder.Default
    private boolean trackIp = true;

    @Column(name = "track_browser", nullable = false)
    @Builder.Default
    private boolean trackBrowser = true;

    @Column(name = "track_os", nullable = false)
    @Builder.Default
    private boolean trackOs = true;

    @Column(name = "track_device", nullable = false)
    @Builder.Default
    private boolean trackDevice = true;

    @Column(name = "track_referrer", nullable = false)
    @Builder.Default
    private boolean trackReferrer = true;

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

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
