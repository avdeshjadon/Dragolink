package com.dragolink.service;

import com.dragolink.entity.TeamMember;
import com.dragolink.entity.User;
import com.dragolink.repository.TeamMemberRepository;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final UserRepository userRepository;
    private final TeamMemberRepository teamMemberRepository;

    public User getEffectiveWorkspaceOwner(UserDetails userDetails) {
        User loggedInUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return loggedInUser;
        }
        
        HttpServletRequest request = attributes.getRequest();
        String workspaceIdStr = request.getHeader("X-Workspace-Id");

        if (workspaceIdStr == null || workspaceIdStr.trim().isEmpty()) {
            return loggedInUser;
        }

        try {
            Long workspaceId = Long.parseLong(workspaceIdStr);
            if (workspaceId.equals(loggedInUser.getId())) {
                return loggedInUser;
            }

            User owner = userRepository.findById(workspaceId)
                    .orElseThrow(() -> new AccessDeniedException("Workspace not found"));

            TeamMember member = teamMemberRepository.findByOwnerAndEmail(owner, loggedInUser.getEmail())
                    .orElseThrow(() -> new AccessDeniedException("You don't have access to this workspace"));

            if (!"ACTIVE".equals(member.getStatus())) {
                throw new AccessDeniedException("Your invitation to this workspace is not active");
            }

            String method = request.getMethod();
            String uri = request.getRequestURI();
            boolean isWriteRequest = method.equals("POST") || method.equals("PUT") || method.equals("PATCH") || method.equals("DELETE");
            boolean isUpgradeRequest = uri != null && uri.endsWith("/request-upgrade");
            
            if (isWriteRequest && !isUpgradeRequest && "VIEWER".equalsIgnoreCase(member.getRole())) {
                throw new AccessDeniedException("VIEWER_ACCESS_DENIED: Viewers cannot perform this action");
            }

            return owner;
        } catch (NumberFormatException e) {
            return loggedInUser;
        }
    }
}
