/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberDto {
    private Long id;
    private String email;
    private String role;
    private String status;
    private String name; // from User if active
    private String profileImage;
    private LocalDateTime createdAt;
    private String upgradeRequestedRole;
    private String upgradeReason;
}
