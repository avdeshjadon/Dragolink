package com.dragolink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Data
public class ShortLinkRequest {
    @NotBlank(message = "Long URL is required")
    @URL(message = "Invalid URL format")
    private String longUrl;

    @Pattern(regexp = "^[a-zA-Z0-9-_]*$", message = "Custom alias can only contain letters, numbers, hyphens, and underscores")
    private String customAlias;

    private String title;

    private LocalDateTime expiryDate;
}
