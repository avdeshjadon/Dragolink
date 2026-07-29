/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.service;

import com.dragolink.dto.ShortLinkRequest;
import com.dragolink.dto.ShortLinkResponse;
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
