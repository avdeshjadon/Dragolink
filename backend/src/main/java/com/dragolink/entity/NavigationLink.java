package com.dragolink.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "navigation_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NavigationLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String url;

    // Categories: PRODUCT, RESOURCES, COMPANY
    @Column(nullable = false)
    private String category;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "is_external", nullable = false)
    private Boolean isExternal = false;

    @Column(name = "badge_text")
    private String badgeText;
}
