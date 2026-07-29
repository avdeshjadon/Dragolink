/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.controller;

import com.dragolink.dto.ApiKeyDto;
import com.dragolink.dto.ApiKeyRequestDto;
import com.dragolink.dto.ApiKeyResponseDto;
import com.dragolink.service.ApiKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @GetMapping
    public ResponseEntity<List<ApiKeyDto>> getApiKeys(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(apiKeyService.getApiKeys(userDetails));
    }

    @PostMapping
    public ResponseEntity<ApiKeyResponseDto> createApiKey(@Valid @RequestBody ApiKeyRequestDto request, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(apiKeyService.createApiKey(request, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApiKey(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        apiKeyService.deleteApiKey(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}
