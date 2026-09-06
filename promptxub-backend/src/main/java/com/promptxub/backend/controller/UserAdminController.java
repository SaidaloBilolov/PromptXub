package com.promptxub.backend.controller;

import com.promptxub.backend.dto.UserStatsResponse;
import com.promptxub.backend.dto.UserSummaryDto;
import com.promptxub.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
public class UserAdminController {

    private final UserService userService;

    public UserAdminController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get aggregate user growth, auth provider breakdown, and recent user profiles.
     */
    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        UserStatsResponse stats = userService.getUserStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Toggle user status (Active / Blocked).
     */
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<UserSummaryDto> toggleUserStatus(@PathVariable Long id) {
        UserSummaryDto user = userService.toggleUserStatus(id);
        return ResponseEntity.ok(user);
    }
}
