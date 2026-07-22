package com.dragolink.service;

import com.dragolink.dto.CampaignDto;
import com.dragolink.dto.CampaignRequestDto;
import com.dragolink.entity.Campaign;
import com.dragolink.entity.ShortLink;
import com.dragolink.entity.User;
import com.dragolink.repository.CampaignRepository;
import com.dragolink.repository.ShortLinkRepository;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final ShortLinkRepository shortLinkRepository;
    private final UserRepository userRepository;

    public List<CampaignDto> getCampaigns(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<Campaign> campaigns = campaignRepository.findByUserOrderByCreatedAtDesc(user);
        
        return campaigns.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public CampaignDto createCampaign(CampaignRequestDto request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        
        Campaign campaign = Campaign.builder()
                .name(request.getName())
                .description(request.getDescription())
                .user(user)
                .build();
                
        campaign = campaignRepository.save(campaign);
        return mapToDto(campaign);
    }

    private CampaignDto mapToDto(Campaign campaign) {
        List<ShortLink> links = shortLinkRepository.findByUserIdOrderByCreatedAtDesc(campaign.getUser().getId())
            .stream()
            .filter(link -> link.getCampaign() != null && link.getCampaign().getId().equals(campaign.getId()))
            .collect(Collectors.toList());
            
        long totalClicks = links.stream().mapToLong(ShortLink::getClickCount).sum();

        return CampaignDto.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .description(campaign.getDescription())
                .totalLinks(links.size())
                .totalClicks(totalClicks)
                .createdAt(campaign.getCreatedAt())
                .build();
    }
}
