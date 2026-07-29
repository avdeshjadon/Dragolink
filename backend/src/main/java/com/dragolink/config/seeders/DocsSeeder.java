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
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class DocsSeeder implements Seeder {
    private final PageContentRepository repository;

    @Override
    public void seed() {
        String slug = "docs";
        repository.findBySlug(slug).ifPresent(repository::delete);
        
        try (var is = new ClassPathResource("seed/pages/docs.json").getInputStream()) {
            String json = StreamUtils.copyToString(is, StandardCharsets.UTF_8);
            PageContent content = PageContent.builder()
                .slug(slug)
                .title("Documentation")
                .htmlContent(json) // Using htmlContent field to store JSON
                .build();
            repository.save(content);
            log.info("Seeded docs page content");
        } catch (Exception e) {
            log.error("Failed to seed docs page content", e);
        }
    }
}
