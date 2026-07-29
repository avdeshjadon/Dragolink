/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.config;

import com.dragolink.config.seeders.Seeder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    // Spring will inject all implementations of Seeder
    private final List<Seeder> seeders;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting Database Seeding...");
        for (Seeder seeder : seeders) {
            try {
                seeder.seed();
            } catch (Exception e) {
                System.err.println("Error running seeder: " + seeder.getClass().getSimpleName());
                e.printStackTrace();
            }
        }
        System.out.println("Database Seeding Completed.");
    }
}
