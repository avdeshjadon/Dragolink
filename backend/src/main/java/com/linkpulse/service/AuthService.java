package com.linkpulse.service;

import com.linkpulse.dto.AuthResponse;
import com.linkpulse.dto.LoginRequest;
import com.linkpulse.dto.RegisterRequest;
import com.linkpulse.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto getMe(UserDetails userDetails);
}
