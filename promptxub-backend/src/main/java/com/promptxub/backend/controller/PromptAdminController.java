package com.promptxub.backend.controller;

import com.promptxub.backend.dto.PromptUpdateRequest;
import com.promptxub.backend.entity.Prompt;
import com.promptxub.backend.service.PromptService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class PromptAdminController {

    private final PromptService promptService;

    public PromptAdminController(PromptService promptService) {
        this.promptService = promptService;
    }

    /**
     * Admin endpoint to update prompt details including viewCount and copyCount.
     */
    @PutMapping("/admin/prompts/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<Prompt> updatePrompt(
            @PathVariable Long id,
            @RequestBody PromptUpdateRequest request) {
        Prompt updated = promptService.updatePromptMetrics(id, request);
        return ResponseEntity.ok(updated);
    }
}
