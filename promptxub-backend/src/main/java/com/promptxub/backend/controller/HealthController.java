package com.promptxub.backend.controller;

import com.promptxub.backend.config.DataSourceConfig;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping({"/", "/api/v1/health", "/health"})
public class HealthController {

    private final DataSourceConfig dataSourceConfig;
    private final JdbcTemplate jdbcTemplate;

    public HealthController(DataSourceConfig dataSourceConfig, JdbcTemplate jdbcTemplate) {
        this.dataSourceConfig = dataSourceConfig;
        this.jdbcTemplate = jdbcTemplate;
    }

    @RequestMapping(method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<Map<String, Object>> checkHealth() {
        boolean dbAlive = false;
        String dbError = null;

        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            dbAlive = (result != null && result == 1);
        } catch (Exception e) {
            dbError = e.getMessage();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", dbAlive ? "UP" : "DEGRADED");
        response.put("message", dbAlive ? "PromptXub Backend & PostgreSQL Database Active" : "Database Wakeup Required");
        response.put("service", "PromptXub API");
        response.put("version", "1.0.1-HOTFIX");
        response.put("buildTime", "2026-09-08T20:56:00Z");
        response.put("database", dataSourceConfig.getDatabaseType());
        response.put("databasePing", dbAlive ? "SUCCESS" : "FAILED");
        if (dbError != null) {
            response.put("databaseError", dbError);
        }
        response.put("isFallback", dataSourceConfig.isUsingFallback());
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }
}
