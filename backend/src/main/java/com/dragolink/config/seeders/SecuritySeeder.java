/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.config.seeders;

import com.dragolink.entity.PageContent;
import com.dragolink.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class SecuritySeeder implements Seeder {

    private final PageContentRepository repository;

    @Override
    public void seed() throws Exception {
        String slug = "security";
        repository.findBySlug(slug).ifPresent(repository::delete);
            try (var is = new ClassPathResource("seed/pages/security.json").getInputStream()) {
                String content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                PageContent page = new PageContent();
                page.setSlug(slug);
                page.setTitle("SecuritySeeder Page");
                page.setHtmlContent(content);
                repository.save(page);
            }
    }
}
