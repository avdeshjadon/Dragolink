package com.linkpulse.service;

import com.linkpulse.dto.ShortLinkRequest;
import com.linkpulse.dto.ShortLinkResponse;
import com.linkpulse.entity.ShortLink;
import com.linkpulse.entity.User;
import com.linkpulse.exception.BadRequestException;
import com.linkpulse.exception.ResourceNotFoundException;
import com.linkpulse.repository.BlockedDomainRepository;
import com.linkpulse.repository.ShortLinkRepository;
import com.linkpulse.repository.UserRepository;
import com.linkpulse.util.Base62Util;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlShorteningServiceImpl implements UrlShorteningService {

    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;
    private final BlockedDomainRepository blockedDomainRepository;

    @Override
    @Transactional
    public ShortLinkResponse createShortLink(ShortLinkRequest request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getCustomAlias() != null && !request.getCustomAlias().isEmpty()) {
            if (shortLinkRepository.existsByCustomAlias(request.getCustomAlias()) || shortLinkRepository.existsByShortCode(request.getCustomAlias())) {
                throw new BadRequestException("Custom alias already in use");
            }
        }
        
        String domain = getDomainFromUrl(request.getLongUrl());
        if (blockedDomainRepository.existsByDomain(domain)) {
            throw new BadRequestException("This domain is blocked");
        }
        if (request.getLongUrl().toLowerCase().startsWith("javascript:") || domain.equals("localhost") || domain.startsWith("192.168.") || domain.startsWith("10.") || domain.startsWith("127.")) {
            throw new BadRequestException("Invalid or restricted URL");
        }

        ShortLink shortLink = ShortLink.builder()
                .user(user)
                .longUrl(request.getLongUrl())
                .customAlias(request.getCustomAlias() != null && !request.getCustomAlias().isEmpty() ? request.getCustomAlias() : null)
                .title(request.getTitle())
                .expiryDate(request.getExpiryDate())
                .active(true)
                .clickCount(0)
                .shortCode("") // Temporary
                .build();

        shortLink = shortLinkRepository.save(shortLink);
        
        // Generate short code based on ID
        String shortCode = Base62Util.encode(shortLink.getId());
        shortLink.setShortCode(shortCode);
        shortLink = shortLinkRepository.save(shortLink);

        return mapToResponse(shortLink);
    }

    @Override
    public List<ShortLinkResponse> getUserLinks(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shortLinkRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ShortLinkResponse getLinkDetails(Long id, UserDetails userDetails) {
        ShortLink link = getOwnedLink(id, userDetails);
        return mapToResponse(link);
    }

    @Override
    @Transactional
    public ShortLinkResponse updateLink(Long id, ShortLinkRequest request, UserDetails userDetails) {
        ShortLink link = getOwnedLink(id, userDetails);

        link.setTitle(request.getTitle());
        link.setExpiryDate(request.getExpiryDate());

        return mapToResponse(shortLinkRepository.save(link));
    }

    @Override
    @Transactional
    public void deleteLink(Long id, UserDetails userDetails) {
        ShortLink link = getOwnedLink(id, userDetails);
        shortLinkRepository.delete(link);
    }

    @Override
    @Transactional
    public ShortLinkResponse toggleLinkStatus(Long id, UserDetails userDetails) {
        ShortLink link = getOwnedLink(id, userDetails);
        link.setActive(!link.isActive());
        return mapToResponse(shortLinkRepository.save(link));
    }

    private ShortLink getOwnedLink(Long id, UserDetails userDetails) {
        ShortLink link = shortLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));
        if (!link.getUser().getEmail().equals(userDetails.getUsername())) {
            throw new AccessDeniedException("You do not own this link");
        }
        return link;
    }

    private ShortLinkResponse mapToResponse(ShortLink link) {
        return ShortLinkResponse.builder()
                .id(link.getId())
                .longUrl(link.getLongUrl())
                .shortCode(link.getShortCode())
                .customAlias(link.getCustomAlias())
                .title(link.getTitle())
                .active(link.isActive())
                .expiryDate(link.getExpiryDate())
                .clickCount(link.getClickCount())
                .createdAt(link.getCreatedAt())
                .build();
    }

    private String getDomainFromUrl(String url) {
        try {
            java.net.URI uri = new java.net.URI(url);
            String domain = uri.getHost();
            return domain != null ? domain.startsWith("www.") ? domain.substring(4) : domain : "";
        } catch (Exception e) {
            return "";
        }
    }
}
