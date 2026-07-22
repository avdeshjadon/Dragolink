package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CampaignDto {
    private Long id;
    private String name;
    private String description;
    private long totalLinks;
    private long totalClicks;
    private LocalDateTime createdAt;
}
