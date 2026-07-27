package com.dragolink.controller;

import com.dragolink.dto.CampaignDto;
import com.dragolink.dto.CampaignRequestDto;
import com.dragolink.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<CampaignDto>> getCampaigns(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(campaignService.getCampaigns(userDetails));
    }

    @PostMapping
    public ResponseEntity<CampaignDto> createCampaign(@Valid @RequestBody CampaignRequestDto request, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(campaignService.createCampaign(request, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        campaignService.deleteCampaign(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}
