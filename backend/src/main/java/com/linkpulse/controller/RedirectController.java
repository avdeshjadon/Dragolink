package com.linkpulse.controller;

import com.linkpulse.service.RateLimiterService;
import com.linkpulse.service.RedirectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final RedirectService redirectService;
    private final RateLimiterService rateLimiterService;

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode, HttpServletRequest request, HttpServletResponse response) throws IOException {
        String ip = getClientIp(request);
        rateLimiterService.checkRateLimit("rate:ip:" + ip + ":redirect", 1000, 60);

        String longUrl = redirectService.getLongUrlAndRecordClick(shortCode, request);
        
        response.sendRedirect(longUrl);
        return ResponseEntity.status(HttpStatus.FOUND).build();
    }

    private String getClientIp(HttpServletRequest request) {
        String remoteAddr = request.getHeader("X-FORWARDED-FOR");
        if (remoteAddr == null || "".equals(remoteAddr)) {
            remoteAddr = request.getRemoteAddr();
        }
        return remoteAddr;
    }
}
