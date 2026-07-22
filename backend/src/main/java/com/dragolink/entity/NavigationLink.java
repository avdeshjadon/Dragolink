package com.dragolink.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "navigation_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NavigationLink implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String url;

    // Position (e.g. PUBLIC_FOOTER, PUBLIC_HEADER, DASHBOARD_SIDEBAR, SETTINGS_SIDEBAR, ADMIN_TABS)
    @Column(name = "position", nullable = false)
    @Builder.Default
    private String position = "PUBLIC_FOOTER";

    // Categories: Product, Resources, Company, etc.
    @Column(nullable = false)
    private String category;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "is_external", nullable = false)
    private Boolean isExternal = false;

    @Column(name = "badge_text")
    private String badgeText;
}
