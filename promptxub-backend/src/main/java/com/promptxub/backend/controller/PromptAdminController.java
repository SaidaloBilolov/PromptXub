package com.promptxub.backend.controller;

import com.promptxub.backend.dto.PromptUpdateRequest;
import com.promptxub.backend.entity.Prompt;
import com.promptxub.backend.service.PromptService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.promptxub.backend.entity.DailyAnalytics;
import com.promptxub.backend.repository.DailyAnalyticsRepository;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PromptAdminController {

    private final PromptService promptService;
    private final DailyAnalyticsRepository dailyAnalyticsRepository;

    public PromptAdminController(PromptService promptService, DailyAnalyticsRepository dailyAnalyticsRepository) {
        this.promptService = promptService;
        this.dailyAnalyticsRepository = dailyAnalyticsRepository;
    }

    /**
     * Admin endpoint to get time-series analytics points between startDate and endDate.
     */
    @GetMapping("/admin/analytics/time-series")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<List<DailyAnalytics>> getTimeSeriesAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();
        LocalDate start = (startDate != null) ? startDate : end.minusDays(29);

        List<DailyAnalytics> list = dailyAnalyticsRepository.findByDateBetweenOrderByDateAsc(start, end);

        // If repository is empty or sparse, fill in missing dates with mock preview points
        if (list.isEmpty()) {
            list = new ArrayList<>();
            LocalDate cur = start;
            long seed = 100;
            while (!cur.isAfter(end)) {
                long views = 450 + (long) (Math.sin(cur.getDayOfMonth()) * 200 + (cur.getDayOfWeek().getValue() * 30));
                long copies = (long) (views * 0.25 + (cur.getDayOfMonth() % 5) * 15);
                long visitors = (long) (views * 0.7);
                list.add(new DailyAnalytics(cur, views, copies, visitors));
                cur = cur.plusDays(1);
            }
        }

        return ResponseEntity.ok(list);
    }

    /**
     * Admin endpoint to get all prompts with real and display metrics.
     */
    @GetMapping("/admin/prompts")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<List<Prompt>> getAllPrompts() {
        List<Prompt> prompts = promptService.getAllPromptsForAdmin();
        return ResponseEntity.ok(prompts);
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
