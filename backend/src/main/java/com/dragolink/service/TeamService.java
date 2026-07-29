/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.service;

import com.dragolink.dto.TeamMemberDto;
import com.dragolink.entity.TeamMember;
import com.dragolink.entity.User;
import com.dragolink.repository.TeamMemberRepository;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public List<TeamMemberDto> getTeamMembers(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return teamMemberRepository.findByOwnerOrderByCreatedAtDesc(user).stream()
                .map(member -> {
                    TeamMemberDto dto = TeamMemberDto.builder()
                            .id(member.getId())
                            .email(member.getEmail())
                            .role(member.getRole())
                            .status(member.getStatus())
                            .createdAt(member.getCreatedAt())
                            .build();
                            
                    if (member.getMember() != null) {
                        dto.setName(member.getMember().getName());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void removeTeamMember(Long id, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        TeamMember member = teamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team member not found"));

        if (!member.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        teamMemberRepository.delete(member);
    }

    public void updateTeamMemberRole(Long id, String role, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        TeamMember member = teamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team member not found"));

        if (!member.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        member.setRole(role.toUpperCase());
        teamMemberRepository.save(member);
    }
}
