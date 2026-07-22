package com.dragolink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApiKeyRequestDto {
    @NotBlank(message = "Name is required")
    private String name;
}
