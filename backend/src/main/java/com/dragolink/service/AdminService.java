package com.dragolink.service;

import com.dragolink.dto.BlockedDomainRequest;
import com.dragolink.dto.BlockedDomainResponse;
import com.dragolink.entity.BlockedDomain;
import com.dragolink.exception.BadRequestException;
import com.dragolink.exception.ResourceNotFoundException;
import com.dragolink.repository.BlockedDomainRepository;
import lombok.RequiredArgsConstructor;
import com.dragolink.repository.UserRepository;
import com.dragolink.entity.User;
import org.springframework.stereotype.Service;

import com.dragolink.dto.UserResponse;
import com.dragolink.dto.CustomDomainResponse;
import com.dragolink.entity.CustomDomain;
import com.dragolink.repository.CustomDomainRepository;
import com.dragolink.dto.AdminOverviewDto;
import com.dragolink.dto.SecurityLogDto;
import com.dragolink.entity.SecurityLog;
import com.dragolink.repository.SecurityLogRepository;
import com.dragolink.repository.ShortLinkRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final BlockedDomainRepository blockedDomainRepository;
    private final UserRepository userRepository;
    private final ShortLinkRepository shortLinkRepository;
    private final SecurityLogRepository securityLogRepository;
    private final CustomDomainRepository customDomainRepository;

    public AdminOverviewDto getOverview() {
        long totalUsers = userRepository.count();
        long totalLinks = shortLinkRepository.count();
        
        List<SecurityLogDto> recentAlerts = securityLogRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(this::mapSecurityLog)
                .collect(Collectors.toList());

        return AdminOverviewDto.builder()
                .totalUsers(totalUsers)
                .totalLinks(totalLinks)
                .activeLinks(totalLinks) // Simplified for demo
                .recentAlerts(recentAlerts)
                .build();
    }

    private SecurityLogDto mapSecurityLog(SecurityLog log) {
        return SecurityLogDto.builder()
                .eventType(log.getEventType())
                .ipAddress(log.getIpAddress())
                .device(log.getDevice())
                .location(log.getLocation())
                .userEmail(log.getUser().getEmail())
                .createdAt(log.getCreatedAt())
                .build();
    }

    public BlockedDomainResponse addBlockedDomain(BlockedDomainRequest request) {
        if (blockedDomainRepository.existsByDomain(request.getDomain())) {
            throw new BadRequestException("Domain is already blocked");
        }
        
        BlockedDomain domain = BlockedDomain.builder()
                .domain(request.getDomain())
                .reason(request.getReason())
                .build();
                
        return mapToResponse(blockedDomainRepository.save(domain));
    }

    public List<BlockedDomainResponse> getAllBlockedDomains() {
        return blockedDomainRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteBlockedDomain(Long id) {
        if (!blockedDomainRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blocked domain not found");
        }
        blockedDomainRepository.deleteById(id);
    }

    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    public void updateUserRole(Long id, String roleName) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        try {
            com.dragolink.entity.Role role = com.dragolink.entity.Role.valueOf(roleName.toUpperCase());
            user.setRole(role);
            userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role");
        }
    }

    private BlockedDomainResponse mapToResponse(BlockedDomain domain) {
        return BlockedDomainResponse.builder()
                .id(domain.getId())
                .domain(domain.getDomain())
                .reason(domain.getReason())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(user -> {
            long shortLinksCount = shortLinkRepository.countByUserId(user.getId());
            return UserResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole().name())
                    .shortLinksCount(shortLinksCount)
                    .isActive(user.isActive())
                    .build();
        }).collect(Collectors.toList());
    }

    public List<CustomDomainResponse> getDomains() {
        return customDomainRepository.findAll().stream().map(domain -> {
            return CustomDomainResponse.builder()
                    .id(domain.getId())
                    .domainName(domain.getDomainName())
                    .isDefault(false) // Assuming no isDefault field
                    .status(domain.getStatus())
                    .createdAt(domain.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    public void deleteCustomDomain(Long id) {
        if (!customDomainRepository.existsById(id)) {
            throw new ResourceNotFoundException("Domain not found");
        }
        customDomainRepository.deleteById(id);
    }
}
