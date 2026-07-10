package com.linkpulse.controller;

import com.linkpulse.dto.BlockedDomainRequest;
import com.linkpulse.dto.BlockedDomainResponse;
import com.linkpulse.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/blocked-domains")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlockedDomainResponse> addBlockedDomain(@Valid @RequestBody BlockedDomainRequest request) {
        return ResponseEntity.ok(adminService.addBlockedDomain(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlockedDomainResponse>> getAllBlockedDomains() {
        return ResponseEntity.ok(adminService.getAllBlockedDomains());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBlockedDomain(@PathVariable Long id) {
        adminService.deleteBlockedDomain(id);
        return ResponseEntity.noContent().build();
    }
}
