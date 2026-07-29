/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.controller;

import com.dragolink.dto.ShortLinkRequest;
import com.dragolink.dto.ShortLinkResponse;
import com.dragolink.service.RateLimiterService;
import com.dragolink.service.UrlShorteningService;
import com.dragolink.entity.User;
import com.dragolink.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class ShortLinkController {

    private final UrlShorteningService urlShorteningService;
    private final RateLimiterService rateLimiterService;
    private final UserRepository userRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    @PostMapping
    public ResponseEntity<ShortLinkResponse> createShortLink(
            @Valid @RequestBody ShortLinkRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        rateLimiterService.checkRateLimit("rate:user:" + user.getId() + ":create-link", 100, 86400); // Max 100 per day
        
        ShortLinkResponse response = urlShorteningService.createShortLink(request, userDetails);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ShortLinkResponse>> getUserLinks(@AuthenticationPrincipal UserDetails userDetails) {
        List<ShortLinkResponse> links = urlShorteningService.getUserLinks(userDetails);
        return ResponseEntity.ok(links);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShortLinkResponse> getLinkDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(urlShorteningService.getLinkDetails(id, userDetails));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShortLinkResponse> updateLink(
            @PathVariable Long id,
            @Valid @RequestBody ShortLinkRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(urlShorteningService.updateLink(id, request, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLink(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        urlShorteningService.deleteLink(id, userDetails);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ShortLinkResponse> toggleLinkStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(urlShorteningService.toggleLinkStatus(id, userDetails));
    }
}
