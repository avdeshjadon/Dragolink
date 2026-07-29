/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Standard Info
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false)
    private String linkedinUrl;

    @Column(nullable = false)
    private String resumeUrl;

    @Column(length = 2000)
    private String coverLetter;

    // Education
    @Column(nullable = false)
    private Double highSchoolPercentage; // 10th

    @Column(nullable = false)
    private Double seniorSecondaryPercentage; // 12th

    @Column(nullable = false)
    private Double degreeCgpa;

    // Tech & Skills
    @Column(nullable = false)
    private String laptopOs;

    @Column(nullable = false)
    private String laptopRam;

    @Column(nullable = false)
    private String laptopProcessor;

    @Column(nullable = false)
    private String programmingLanguages;

    @Column(nullable = false)
    private String spokenLanguages;

    // Professional
    @Column(nullable = false)
    private String jobRole;

    @Column(nullable = false)
    private Double yearsOfExperience;

    @Column(nullable = false)
    private String noticePeriod;

    @Column(nullable = false)
    private String expectedCtc;

    // Application Status
    @Column(nullable = false)
    @Builder.Default
    private String status = "APPLIED"; // APPLIED, REVIEWING, REJECTED, HIRED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
