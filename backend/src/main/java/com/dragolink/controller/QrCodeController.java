package com.dragolink.controller;

import com.dragolink.dto.ShortLinkResponse;
import com.dragolink.service.QrCodeService;
import com.dragolink.service.UrlShorteningService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class QrCodeController {

    private final QrCodeService qrCodeService;
    private final UrlShorteningService urlShorteningService;
    
    @Value("${app.base-url}")
    private String baseUrl;

    @GetMapping("/{id}/qr")
    public ResponseEntity<Map<String, String>> getQrCode(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        ShortLinkResponse link = urlShorteningService.getLinkDetails(id, userDetails);
        String shortUrl = link.getShortUrl(baseUrl);
        String base64Image = qrCodeService.generateQrCodeBase64(shortUrl, 300, 300);
        
        Map<String, String> response = new HashMap<>();
        response.put("qrCode", "data:image/png;base64," + base64Image);
        return ResponseEntity.ok(response);
    }
}
