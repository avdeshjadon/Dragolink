/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "routing_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutingRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_link_id", nullable = false)
    private ShortLink shortLink;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoutingRuleType type;

    @Column(name = "condition_value", nullable = false, length = 100)
    private String conditionValue;

    @Column(name = "destination_url", nullable = false, length = 2048)
    private String destinationUrl;
}
