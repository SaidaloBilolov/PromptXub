package com.promptxub.backend.controller;

import com.promptxub.backend.dto.EnhancePromptRequest;
import com.promptxub.backend.dto.EnhancePromptResponse;
import com.promptxub.backend.dto.SmartSearchRequest;
import com.promptxub.backend.dto.SmartSearchResponse;
import com.promptxub.backend.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * Endpoint for Gemini-powered smart search.
     * Takes natural language search query and extracts optimized keywords, AI model, and category intent.
     */
    @PostMapping("/smart-search")
    public ResponseEntity<SmartSearchResponse> smartSearch(@Valid @RequestBody SmartSearchRequest request) {
        SmartSearchResponse response = geminiService.smartSearch(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for Gemini-powered AI prompt enhancer.
     * Expands simple user keywords into a rich, high-quality prompt for Midjourney / Flux / Runway.
     */
    @PostMapping("/enhance-prompt")
    public ResponseEntity<EnhancePromptResponse> enhancePrompt(@Valid @RequestBody EnhancePromptRequest request) {
        EnhancePromptResponse response = geminiService.enhancePrompt(request);
        return ResponseEntity.ok(response);
    }
}
