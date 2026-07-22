package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AdminOverviewDto {
    private long totalUsers;
    private long totalLinks;
    private long activeLinks;
    private List<SecurityLogDto> recentAlerts;
}
