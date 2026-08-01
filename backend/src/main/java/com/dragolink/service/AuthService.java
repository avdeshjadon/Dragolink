/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.service;

import com.dragolink.dto.AuthResponse;
import com.dragolink.dto.LoginRequest;
import com.dragolink.dto.RegisterRequest;
import com.dragolink.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetails;

import com.dragolink.dto.GoogleAuthRequest;
import com.dragolink.dto.SendOtpRequest;
import com.dragolink.dto.VerifyOtpRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse googleLogin(GoogleAuthRequest request);
    void sendOtp(SendOtpRequest request);
    boolean verifyOtp(VerifyOtpRequest request);
    UserDto getMe(UserDetails userDetails);
}
