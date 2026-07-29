/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.controller;

import com.dragolink.dto.AdminOverviewDto;
import com.dragolink.dto.BlockedDomainRequest;
import com.dragolink.dto.BlockedDomainResponse;
import com.dragolink.dto.UserResponse;
import com.dragolink.dto.CustomDomainResponse;
import com.dragolink.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/overview")
    public ResponseEntity<AdminOverviewDto> getOverview() {
        return ResponseEntity.ok(adminService.getOverview());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @GetMapping("/domains")
    public ResponseEntity<List<CustomDomainResponse>> getDomains() {
        return ResponseEntity.ok(adminService.getDomains());
    }

    @PostMapping("/blocked-domains")
    public ResponseEntity<BlockedDomainResponse> addBlockedDomain(@Valid @RequestBody BlockedDomainRequest request) {
        return new ResponseEntity<>(adminService.addBlockedDomain(request), HttpStatus.CREATED);
    }

    @GetMapping("/blocked-domains")
    public ResponseEntity<List<BlockedDomainResponse>> getAllBlockedDomains() {
        return ResponseEntity.ok(adminService.getAllBlockedDomains());
    }

    @DeleteMapping("/blocked-domains/{id}")
    public ResponseEntity<Void> deleteBlockedDomain(@PathVariable Long id) {
        adminService.deleteBlockedDomain(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        adminService.updateUserRole(id, request.get("role"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/domains/{id}")
    public ResponseEntity<Void> deleteCustomDomain(@PathVariable Long id) {
        adminService.deleteCustomDomain(id);
        return ResponseEntity.noContent().build();
    }
}
