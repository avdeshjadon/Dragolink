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
}
