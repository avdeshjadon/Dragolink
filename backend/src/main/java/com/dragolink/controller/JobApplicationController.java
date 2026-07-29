/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.controller;

import com.dragolink.entity.JobApplication;
import com.dragolink.entity.User;
import com.dragolink.repository.JobApplicationRepository;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<JobApplication> submitApplication(
            @RequestBody JobApplication application,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        application.setUser(user);
        application.setStatus("APPLIED");
        
        JobApplication saved = jobApplicationRepository.save(application);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/me")
    public ResponseEntity<List<JobApplication>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<JobApplication> apps = jobApplicationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(apps);
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        // Simple fetch all. In a real app, pagination and dynamic filtering (Specification) would be used.
        // For simplicity, returning all and letting frontend handle filtering
        List<JobApplication> apps = jobApplicationRepository.findAll();
        return ResponseEntity.ok(apps);
    }
}
