package com.promptxub.backend.controller;

import com.promptxub.backend.entity.DailyAnalytics;
import com.promptxub.backend.repository.DailyAnalyticsRepository;
import com.promptxub.backend.repository.PromptRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/v1")
@Transactional
public class PromptTrackController {

    private final PromptRepository promptRepository;
    private final DailyAnalyticsRepository dailyAnalyticsRepository;

    public PromptTrackController(PromptRepository promptRepository,
                                 DailyAnalyticsRepository dailyAnalyticsRepository) {
        this.promptRepository = promptRepository;
        this.dailyAnalyticsRepository = dailyAnalyticsRepository;
    }

    /**
     * Endpoint for non-blocking sendBeacon and background analytics tracking.
     */
    @PostMapping("/prompts/track")
    public ResponseEntity<Map<String, Object>> trackEvent(@RequestBody TrackRequest payload) {
        if (payload != null && payload.getPromptId() != null) {
            if ("copy".equalsIgnoreCase(payload.getType())) {
                recordCopy(payload.getPromptId());
            } else {
                recordView(payload.getPromptId());
            }
        }
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    /**
     * Legacy single endpoints for backward compatibility.
     */
    @PostMapping("/public/prompts/{id}/copy")
    public ResponseEntity<Map<String, Object>> incrementCopy(@PathVariable Long id) {
        recordCopy(id);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @PostMapping("/public/prompts/{id}/view")
    public ResponseEntity<Map<String, Object>> incrementView(@PathVariable Long id) {
        recordView(id);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    private void recordCopy(Long promptId) {
        promptRepository.incrementCopyCount(promptId);
        recordDaily(false);
    }

    private void recordView(Long promptId) {
        promptRepository.incrementViewCount(promptId);
        recordDaily(true);
    }

    private void recordDaily(boolean isView) {
        try {
            LocalDate today = LocalDate.now();
            DailyAnalytics da = dailyAnalyticsRepository.findById(today)
                    .orElseGet(() -> new DailyAnalytics(today, 0L, 0L, 0L));
            if (isView) {
                da.setViewsCount((da.getViewsCount() != null ? da.getViewsCount() : 0L) + 1);
            } else {
                da.setCopiesCount((da.getCopiesCount() != null ? da.getCopiesCount() : 0L) + 1);
            }
            dailyAnalyticsRepository.save(da);
        } catch (Exception ignored) {
        }
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
