package com.promptxub.backend.controller;

import com.promptxub.backend.repository.PromptRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class PromptTrackController {

    private final PromptRepository promptRepository;

    public PromptTrackController(PromptRepository promptRepository) {
        this.promptRepository = promptRepository;
    }

    /**
     * Endpoint for non-blocking sendBeacon and background analytics tracking.
     */
    @PostMapping("/prompts/track")
    public ResponseEntity<Map<String, Object>> trackEvent(@RequestBody TrackRequest payload) {
        if (payload != null && payload.getPromptId() != null) {
            if ("copy".equalsIgnoreCase(payload.getType())) {
                promptRepository.incrementCopyCount(payload.getPromptId());
            } else {
                promptRepository.incrementViewCount(payload.getPromptId());
            }
        }
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    /**
     * Legacy single endpoints for backward compatibility.
     */
    @PostMapping("/public/prompts/{id}/copy")
    public ResponseEntity<Map<String, Object>> incrementCopy(@PathVariable Long id) {
        promptRepository.incrementCopyCount(id);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @PostMapping("/public/prompts/{id}/view")
    public ResponseEntity<Map<String, Object>> incrementView(@PathVariable Long id) {
        promptRepository.incrementViewCount(id);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    public static class TrackRequest {
        private Long promptId;
        private String type;
        private Long timestamp;

        public Long getPromptId() {
            return promptId;
        }

        public void setPromptId(Long promptId) {
            this.promptId = promptId;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Long timestamp) {
            this.timestamp = timestamp;
        }
    }
}
