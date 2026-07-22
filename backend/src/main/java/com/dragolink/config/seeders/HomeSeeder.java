package com.dragolink.config.seeders;

import com.dragolink.entity.PageContent;
import com.dragolink.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class HomeSeeder implements Seeder {

    private final PageContentRepository repository;

    @Override
    public void seed() throws Exception {
        String slug = "home";
        repository.findBySlug(slug).ifPresent(repository::delete);
            try (var is = new ClassPathResource("seed/pages/home.json").getInputStream()) {
                String content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                PageContent page = new PageContent();
                page.setSlug(slug);
                page.setTitle("HomeSeeder Page");
                page.setHtmlContent(content);
                repository.save(page);
            }
    }
}
