package com.dragolink.config.seeders;

import com.dragolink.entity.PageContent;
import com.dragolink.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class QrSeeder implements Seeder {

    private final PageContentRepository repository;

    @Override
    public void seed() throws Exception {
        String slug = "qr-codes";
        repository.findBySlug("qr").ifPresent(repository::delete); // cleanup old
        repository.findBySlug(slug).ifPresent(repository::delete);
            try (var is = new ClassPathResource("seed/pages/qr.json").getInputStream()) {
                String content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                PageContent page = new PageContent();
                page.setSlug(slug);
                page.setTitle("QrSeeder Page");
                page.setHtmlContent(content);
                repository.save(page);
            }
    }
}
