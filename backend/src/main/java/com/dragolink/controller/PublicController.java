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
import com.dragolink.repository.ClickAnalyticsRepository;
import com.dragolink.dto.PlatformStatsDto;
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
    private final ClickAnalyticsRepository clickAnalyticsRepository;

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

    @GetMapping("/platform-stats")
    @Cacheable("platform-stats")
    public PlatformStatsDto getPlatformStats() {
        long totalClicks = clickAnalyticsRepository.count();
        long totalCountries = clickAnalyticsRepository.countDistinctCountries();
        return PlatformStatsDto.builder()
                .totalClicks(totalClicks > 0 ? totalClicks : 2000000000L) // Default to 2B+ if empty for demo
                .countriesServed(totalCountries > 0 ? totalCountries : 50L) // Default if empty
                .uptime(99.99)
                .supportStatus("24/7")
                .build();
    }

    @GetMapping("/qr-stats")
    @Cacheable("qr-stats")
    public com.dragolink.dto.QrStatsDto getQrStats() {
        long qrScans = clickAnalyticsRepository.countQrScans();
        return com.dragolink.dto.QrStatsDto.builder()
                .qrScansTracked(qrScans > 0 ? qrScans : 120000000L) // Default to 120M+ if empty for demo
                .higherScanRates("45%")
                .editableAnytime("100%")
                .brokenLinks("Zero")
                .build();
    }
}
