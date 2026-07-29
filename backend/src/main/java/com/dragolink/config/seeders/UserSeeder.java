/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.config.seeders;

import com.dragolink.entity.User;
import com.dragolink.entity.Role;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserSeeder implements Seeder {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void seed() {
        if (!userRepository.existsByEmail("admin@gmail.com")) {
            userRepository.save(User.builder()
                .name("Super Admin")
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("admin"))
                .role(Role.ADMIN)
                .build());
        }
    }
}
