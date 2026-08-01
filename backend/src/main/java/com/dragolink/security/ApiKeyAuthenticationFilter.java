package com.dragolink.security;

import com.dragolink.entity.User;
import com.dragolink.service.ApiKeyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String apiKey = extractApiKey(request);

        if (apiKey != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                User user = apiKeyService.validateApiKey(apiKey);
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (Exception e) {
                // Invalid API Key - proceed to let other filters or security config reject the request
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractApiKey(HttpServletRequest request) {
        String header = request.getHeader("X-API-Key");
        if (header != null && !header.isBlank()) {
            return header;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer dl_")) {
            return authHeader.substring(7); // Remove "Bearer "
        }

        return null;
    }
}
