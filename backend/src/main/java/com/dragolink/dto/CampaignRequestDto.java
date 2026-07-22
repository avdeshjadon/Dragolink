package com.dragolink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CampaignRequestDto {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
}
