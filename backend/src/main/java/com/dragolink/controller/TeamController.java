/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.controller;

import com.dragolink.dto.TeamMemberDto;
import com.dragolink.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<List<TeamMemberDto>> getTeamMembers(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.getTeamMembers(userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeTeamMember(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        teamService.removeTeamMember(id, userDetails);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<Void> updateTeamMemberRole(@PathVariable Long id, @RequestBody java.util.Map<String, String> request, @AuthenticationPrincipal UserDetails userDetails) {
        teamService.updateTeamMemberRole(id, request.get("role"), userDetails);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/invite")
    public ResponseEntity<TeamMemberDto> inviteTeamMember(@RequestBody java.util.Map<String, String> request, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.inviteTeamMember(request.get("email"), request.get("role"), userDetails));
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<TeamMemberDto>> getInvitations(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.getInvitations(userDetails));
    }

    @PostMapping("/invitations/{id}/accept")
    public ResponseEntity<Void> acceptInvitation(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        teamService.acceptInvitation(id, userDetails);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/invitations/{id}/decline")
    public ResponseEntity<Void> declineInvitation(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        teamService.declineInvitation(id, userDetails);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/workspaces")
    public ResponseEntity<List<TeamMemberDto>> getWorkspaces(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.getWorkspaces(userDetails));
    }

    @PostMapping("/request-upgrade")
    public ResponseEntity<Void> requestRoleUpgrade(@RequestBody java.util.Map<String, String> request, @AuthenticationPrincipal UserDetails userDetails) {
        teamService.requestRoleUpgrade(request.get("requestedRole"), request.get("reason"), userDetails);
        return ResponseEntity.ok().build();
    }
}
