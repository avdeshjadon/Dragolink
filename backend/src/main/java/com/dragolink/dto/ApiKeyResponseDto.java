package com.dragolink.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiKeyResponseDto {
    private ApiKeyDto keyDetails;
    private String rawKey;
}
