package com.promptxub.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Service responsible for keeping the Neon PostgreSQL serverless compute instance warm.
 * Neon Free Tier automatically auto-suspends (hibernates) after 5 minutes (300 seconds) of inactivity.
 * By executing a lightweight 'SELECT 1' query every 2 minutes (120 seconds), this service ensures
 * the database never goes to sleep while the application is running, preventing 3-7s cold start delays
 * for website visitors and shared prompt link clicks.
 */
@Service
public class DatabaseKeepAliveService {

    private static final Logger log = LoggerFactory.getLogger(DatabaseKeepAliveService.class);

    private final JdbcTemplate jdbcTemplate;
    private Instant lastSuccessfulPing = Instant.now();
    private boolean isDatabaseHealthy = true;

    public DatabaseKeepAliveService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Executes every 120 seconds (2 minutes), safely within Neon's 300-second idle timeout window.
     */
    @Scheduled(fixedRate = 120000, initialDelay = 15000)
    public void keepNeonDatabaseAlive() {
        try {
            long startTime = System.currentTimeMillis();
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            long duration = System.currentTimeMillis() - startTime;

            if (result != null && result == 1) {
                lastSuccessfulPing = Instant.now();
                isDatabaseHealthy = true;
                log.debug("💚 [Neon KeepAlive] Heartbeat ping successful (took {} ms)", duration);
            }
        } catch (Exception e) {
            isDatabaseHealthy = false;
            log.warn("⚠️ [Neon KeepAlive] Heartbeat ping encountered an error: {}", e.getMessage());
        }
    }

    public boolean pingDatabase() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            boolean ok = (result != null && result == 1);
            if (ok) {
                lastSuccessfulPing = Instant.now();
                isDatabaseHealthy = true;
            }
            return ok;
        } catch (Exception e) {
            isDatabaseHealthy = false;
            return false;
        }
    }

    public Instant getLastSuccessfulPing() {
        return lastSuccessfulPing;
    }

    public boolean isDatabaseHealthy() {
        return isDatabaseHealthy;
    }
}
