package com.dragolink.service;

import com.dragolink.dto.BlockedDomainRequest;
import com.dragolink.dto.BlockedDomainResponse;
import com.dragolink.entity.BlockedDomain;
import com.dragolink.exception.BadRequestException;
import com.dragolink.exception.ResourceNotFoundException;
import com.dragolink.repository.BlockedDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final BlockedDomainRepository blockedDomainRepository;

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

    private BlockedDomainResponse mapToResponse(BlockedDomain domain) {
        return BlockedDomainResponse.builder()
                .id(domain.getId())
                .domain(domain.getDomain())
                .reason(domain.getReason())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}
