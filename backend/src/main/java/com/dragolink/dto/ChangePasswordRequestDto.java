/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ChangePasswordRequestDto {
    private String currentPassword;
    @NotBlank(message = "New password is required")
    private String newPassword;
    
    // Optional: if OTP is provided, it can bypass current password check (e.g. forgot password flow)
    private String otp;
}
