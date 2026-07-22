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
}
