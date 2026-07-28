package com.dragolink.controller;

import com.dragolink.dto.AnalyticsDashboardDto;
import com.dragolink.dto.ClickDetailsDto;
import com.dragolink.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDashboardDto> getDashboard(@AuthenticationPrincipal UserDetails userDetails, @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getDashboard(userDetails, days));
    }

    @GetMapping("/links/{linkId}")
    public ResponseEntity<List<ClickDetailsDto>> getLinkAnalytics(@PathVariable Long linkId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getLinkAnalytics(linkId, userDetails));
    }

    @DeleteMapping("/links/{linkId}/logs/{logId}")
    public ResponseEntity<Void> deleteClickLog(@PathVariable Long linkId, @PathVariable Long logId, @AuthenticationPrincipal UserDetails userDetails) {
        analyticsService.deleteClickLog(linkId, logId, userDetails);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/links/{linkId}/logs")
    public ResponseEntity<Void> deleteAllClickLogs(@PathVariable Long linkId, @AuthenticationPrincipal UserDetails userDetails) {
        analyticsService.deleteAllClickLogs(linkId, userDetails);
        return ResponseEntity.ok().build();
    }
}
