package com.dragolink.controller;

import com.dragolink.entity.NavigationLink;
import com.dragolink.entity.PageContent;
import com.dragolink.repository.NavigationLinkRepository;
import com.dragolink.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.dragolink.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*") // In production, restrict this to frontend domains
@RequiredArgsConstructor
public class PublicController {

    private final NavigationLinkRepository navigationLinkRepository;
    private final PageContentRepository pageContentRepository;

    @GetMapping("/navigation")
    public ResponseEntity<List<NavigationLink>> getNavigationLinks() {
        return ResponseEntity.ok(navigationLinkRepository.findAllByOrderByCategoryAscSortOrderAsc());
    }

    @GetMapping("/pages/{slug}")
    public ResponseEntity<PageContent> getPageContent(@PathVariable String slug) {
        return pageContentRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Page content not found with slug: " + slug));
    }
}
