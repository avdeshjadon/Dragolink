/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlockedDomainRequest {
    @NotBlank(message = "Domain is required")
    private String domain;
    private String reason;
}
