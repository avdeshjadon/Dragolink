package com.dragolink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlockedDomainRequest {
    @NotBlank(message = "Domain is required")
    private String domain;
    private String reason;
}
