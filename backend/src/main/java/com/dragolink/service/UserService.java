/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.service;

import com.dragolink.dto.ChangePasswordRequestDto;
import com.dragolink.dto.UserProfileRequestDto;
import com.dragolink.entity.User;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    public User getUserProfile(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    @Transactional
    public User updateProfile(UserProfileRequestDto request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        user.setName(request.getName());
        user.setCompany(request.getCompany());
        user.setTimezone(request.getTimezone());
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequestDto request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        
        // If OTP is provided, verify it first (bypassing current password check)
        if (request.getOtp() != null && !request.getOtp().isEmpty()) {
            if (!otpService.verifyOtp(user.getEmail(), request.getOtp())) {
                throw new RuntimeException("Invalid or expired OTP");
            }
        } else if (user.isHasPassword()) {
            // Standard password check if no OTP is provided and user has a password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        if (!user.isHasPassword()) {
            user.setHasPassword(true);
        }
        userRepository.save(user);
    }
}
