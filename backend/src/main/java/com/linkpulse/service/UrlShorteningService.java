package com.linkpulse.service;

import com.linkpulse.dto.ShortLinkRequest;
import com.linkpulse.dto.ShortLinkResponse;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UrlShorteningService {
    ShortLinkResponse createShortLink(ShortLinkRequest request, UserDetails userDetails);
    List<ShortLinkResponse> getUserLinks(UserDetails userDetails);
    ShortLinkResponse getLinkDetails(Long id, UserDetails userDetails);
    ShortLinkResponse updateLink(Long id, ShortLinkRequest request, UserDetails userDetails);
    void deleteLink(Long id, UserDetails userDetails);
    ShortLinkResponse toggleLinkStatus(Long id, UserDetails userDetails);
}
