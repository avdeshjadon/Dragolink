package com.dragolink.dto;

import lombok.Data;

@Data
public class UserProfileRequestDto {
    private String name;
    private String company;
    private String timezone;
}
