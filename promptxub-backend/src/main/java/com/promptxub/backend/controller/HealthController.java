package com.promptxub.backend.controller;

import com.promptxub.backend.config.DataSourceConfig;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/health", "/health"})
public class HealthController {

    private final DataSourceConfig dataSourceConfig;

    public HealthController(DataSourceConfig dataSourceConfig) {
        this.dataSourceConfig = dataSourceConfig;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "PromptXub API",
                "version", "1.0.0",
                "database", dataSourceConfig.getDatabaseType(),
                "isFallback", dataSourceConfig.isUsingFallback(),
                "timestamp", Instant.now().toString()
        ));
    }
}
