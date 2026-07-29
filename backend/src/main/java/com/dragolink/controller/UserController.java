/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.controller;

import com.dragolink.dto.ChangePasswordRequestDto;
import com.dragolink.dto.UserProfileRequestDto;
import com.dragolink.entity.SecurityLog;
import com.dragolink.entity.User;
import com.dragolink.repository.SecurityLogRepository;
import com.dragolink.repository.UserRepository;
import com.dragolink.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SecurityLogRepository securityLogRepository;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody UserProfileRequestDto request, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.updateProfile(request, userDetails));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequestDto request, @AuthenticationPrincipal UserDetails userDetails) {
        userService.changePassword(request, userDetails);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/security-logs")
    public ResponseEntity<List<SecurityLog>> getSecurityLogs(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(securityLogRepository.findTop10ByUserOrderByCreatedAtDesc(user));
    }
}
