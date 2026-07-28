package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsDashboardDto {
    private long totalLinks;
    private long totalClicks;
    private long uniqueVisitors;
    private long activeLinks;
    private long expiredLinks;
    private List<ShortLinkResponse> topLinks;
    private List<Map<String, Object>> clicksByDate;
    private List<Map<String, Object>> clicksByDevice;
    private List<Map<String, Object>> clicksByBrowser;
    private List<Map<String, Object>> clicksByReferrer;
    private List<Map<String, Object>> clicksByCountry;
    private List<ClickDetailsDto> recentClicks;
}
