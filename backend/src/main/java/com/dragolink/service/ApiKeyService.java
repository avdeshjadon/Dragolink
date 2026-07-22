package com.dragolink.service;

import com.dragolink.dto.ApiKeyDto;
import com.dragolink.dto.ApiKeyRequestDto;
import com.dragolink.dto.ApiKeyResponseDto;
import com.dragolink.entity.ApiKey;
import com.dragolink.entity.User;
import com.dragolink.repository.ApiKeyRepository;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    public List<ApiKeyDto> getApiKeys(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return apiKeyRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiKeyResponseDto createApiKey(ApiKeyRequestDto request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        
        String rawKey = "dl_" + UUID.randomUUID().toString().replace("-", "");
        String keyHash = hashKey(rawKey);
        String prefix = rawKey.substring(0, 8); // dl_xxxx

        ApiKey apiKey = ApiKey.builder()
                .user(user)
                .name(request.getName())
                .keyHash(keyHash)
                .prefix(prefix)
                .build();
                
        apiKey = apiKeyRepository.save(apiKey);

        return ApiKeyResponseDto.builder()
                .keyDetails(mapToDto(apiKey))
                .rawKey(rawKey)
                .build();
    }

    @Transactional
    public void deleteApiKey(Long id, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        ApiKey apiKey = apiKeyRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("API Key not found"));
        apiKeyRepository.delete(apiKey);
    }

    private ApiKeyDto mapToDto(ApiKey key) {
        return ApiKeyDto.builder()
                .id(key.getId())
                .name(key.getName())
                .prefix(key.getPrefix())
                .lastUsedAt(key.getLastUsedAt())
                .createdAt(key.getCreatedAt())
                .build();
    }

    private String hashKey(String key) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(key.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash API key", e);
        }
    }
}
