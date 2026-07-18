package com.dragolink.controller;

import com.dragolink.entity.BlogPost;
import com.dragolink.entity.PageContent;
import com.dragolink.repository.BlogPostRepository;
import com.dragolink.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.dragolink.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/cms")
@RequiredArgsConstructor
public class CmsController {

    private final BlogPostRepository blogPostRepository;
    private final PageContentRepository pageContentRepository;

    // --- BLOG POSTS ---

    @GetMapping("/posts")
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        return ResponseEntity.ok(blogPostRepository.findAll());
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<BlogPost> getPostById(@PathVariable Long id) {
        return blogPostRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
    }

    // --- PAGE CONTENTS ---

    @GetMapping("/pages")
    public ResponseEntity<List<PageContent>> getAllPages() {
        return ResponseEntity.ok(pageContentRepository.findAll());
    }

    @GetMapping("/pages/{slug}")
    public ResponseEntity<PageContent> getPageBySlug(@PathVariable String slug) {
        return pageContentRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Page content not found with slug: " + slug));
    }

    @PutMapping("/pages/{slug}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageContent> updatePageContent(@PathVariable String slug, @RequestBody PageContent pageContentDetails) {
        Optional<PageContent> optionalPage = pageContentRepository.findBySlug(slug);
        if (optionalPage.isPresent()) {
            PageContent page = optionalPage.get();
            page.setTitle(pageContentDetails.getTitle());
            page.setHtmlContent(pageContentDetails.getHtmlContent());
            return ResponseEntity.ok(pageContentRepository.save(page));
        } else {
            throw new ResourceNotFoundException("Page content not found with slug: " + slug);
        }
    }


}
