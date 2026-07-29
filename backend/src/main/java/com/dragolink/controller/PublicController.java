/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.controller;

import com.dragolink.entity.BlogPost;
import com.dragolink.entity.NavigationLink;
import com.dragolink.entity.PageContent;
import com.dragolink.repository.BlogPostRepository;
import com.dragolink.repository.NavigationLinkRepository;
import com.dragolink.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.dragolink.exception.ResourceNotFoundException;
import org.springframework.cache.annotation.Cacheable;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*") // In production, restrict this to frontend domains
@RequiredArgsConstructor
public class PublicController {

    private final NavigationLinkRepository navigationLinkRepository;
    private final PageContentRepository pageContentRepository;
    private final BlogPostRepository blogPostRepository;

    @GetMapping("/navigation")
    public List<NavigationLink> getNavigationLinks(@RequestParam(required = false) String position) {
        if (position != null && !position.isEmpty()) {
            return navigationLinkRepository.findAllByPositionOrderByCategoryAscSortOrderAsc(position);
        }
        return navigationLinkRepository.findAllByOrderByCategoryAscSortOrderAsc();
    }

    @GetMapping("/pages/{slug}")
    @Cacheable(value = "pages", key = "#slug")
    public PageContent getPageContent(@PathVariable String slug) {
        return pageContentRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page content not found with slug: " + slug));
    }

    @GetMapping("/posts")
    @Cacheable("posts")
    public List<BlogPost> getPosts() {
        return blogPostRepository.findAll();
    }

    @GetMapping("/posts/{id}")
    @Cacheable(value = "post", key = "#id")
    public BlogPost getPostById(@PathVariable Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
    }
}
