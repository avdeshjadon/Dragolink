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
import com.dragolink.entity.Notification;
import com.dragolink.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final WorkspaceService workspaceService;
    private final NotificationRepository notificationRepository;

    public void requestRoleUpgrade(String requestedRole, String reason, UserDetails userDetails) {
        User loggedInUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        User owner = workspaceService.getEffectiveWorkspaceOwner(userDetails);
        
        if (owner.getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("You are already the owner of this workspace");
        }
        
        String safeReason = (reason != null && !reason.trim().isEmpty()) ? reason.trim() : "No reason provided.";
        String requested = (requestedRole != null && !requestedRole.trim().isEmpty()) ? requestedRole.trim().toUpperCase() : "MEMBER";
        
        Notification notification = Notification.builder()
                .user(owner)
                .type("info")
                .title("Role Upgrade Request")
                .message(loggedInUser.getName() + " requested a promotion to " + requested + " in your workspace. Reason: " + safeReason)
                .build();
                
        notificationRepository.save(notification);
    }

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

    public TeamMemberDto inviteTeamMember(String email, String role, UserDetails userDetails) {
        User owner = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (owner.getEmail().equals(email)) {
            throw new RuntimeException("Cannot invite yourself");
        }

        if (teamMemberRepository.findByOwnerAndEmail(owner, email).isPresent()) {
            throw new RuntimeException("User is already invited or part of the team");
        }

        User memberUser = userRepository.findByEmail(email).orElse(null);

        TeamMember teamMember = TeamMember.builder()
                .owner(owner)
                .member(memberUser)
                .email(email)
                .role(role.toUpperCase())
                .status("INVITED")
                .build();

        teamMember = teamMemberRepository.save(teamMember);

        TeamMemberDto dto = TeamMemberDto.builder()
                .id(teamMember.getId())
                .email(teamMember.getEmail())
                .role(teamMember.getRole())
                .status(teamMember.getStatus())
                .createdAt(teamMember.getCreatedAt())
                .build();
        if (teamMember.getMember() != null) {
            dto.setName(teamMember.getMember().getName());
        }
        return dto;
    }

    public List<TeamMemberDto> getInvitations(UserDetails userDetails) {
        return teamMemberRepository.findByEmailAndStatus(userDetails.getUsername(), "INVITED").stream()
                .map(member -> TeamMemberDto.builder()
                        .id(member.getId())
                        .email(member.getEmail())
                        .role(member.getRole())
                        .status(member.getStatus())
                        .name(member.getOwner().getName()) // Using name to pass the owner's name
                        .createdAt(member.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public void acceptInvitation(Long id, UserDetails userDetails) {
        TeamMember member = teamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!member.getEmail().equals(userDetails.getUsername()) || !"INVITED".equals(member.getStatus())) {
            throw new RuntimeException("Invalid invitation");
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        member.setMember(user);
        member.setStatus("ACTIVE");
        teamMemberRepository.save(member);
    }

    public void declineInvitation(Long id, UserDetails userDetails) {
        TeamMember member = teamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!member.getEmail().equals(userDetails.getUsername()) || !"INVITED".equals(member.getStatus())) {
            throw new RuntimeException("Invalid invitation");
        }

        teamMemberRepository.delete(member);
    }

    public List<TeamMemberDto> getWorkspaces(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TeamMemberDto> workspaces = new java.util.ArrayList<>();
        
        // Own workspace
        workspaces.add(TeamMemberDto.builder()
                .id(user.getId())
                .name(user.getName() + " (Personal)")
                .role("OWNER")
                .status("ACTIVE")
                .build());
                
        // Workspaces the user belongs to
        teamMemberRepository.findByMember(user).stream()
                .filter(m -> "ACTIVE".equals(m.getStatus()))
                .forEach(m -> workspaces.add(TeamMemberDto.builder()
                        .id(m.getOwner().getId())
                        .name(m.getOwner().getName() + "'s Team")
                        .role(m.getRole())
                        .status("ACTIVE")
                        .build()));
                        
        return workspaces;
    }
}
