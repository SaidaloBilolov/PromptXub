package com.promptxub.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    private boolean usingFallback = false;
    private String databaseType = "POSTGRESQL";

    @Bean
    @Primary
    public DataSource dataSource(Environment env) {
        String resolvedUrl = resolveUrl(env);
        String resolvedUsername = resolveUsername(env);
        String resolvedPassword = resolvePassword(env);

        // 1. If standard PostgreSQL URI was provided (e.g., postgresql://user:pass@host/db)
        if (resolvedUrl.startsWith("postgres://") || resolvedUrl.startsWith("postgresql://")) {
            try {
                URI uri = new URI(resolvedUrl);
                if (uri.getUserInfo() != null && uri.getUserInfo().contains(":")) {
                    String[] userParts = uri.getUserInfo().split(":", 2);
                    if (resolvedUsername == null || resolvedUsername.isBlank() || resolvedUsername.equals("promptxub_user")) {
                        resolvedUsername = userParts[0];
                    }
                    if (resolvedPassword == null || resolvedPassword.isBlank() || resolvedPassword.equals("promptxub_password")) {
                        resolvedPassword = userParts[1];
                    }
                }

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath() != null ? uri.getPath() : "/promptxub_db";
                String query = uri.getQuery();

                StringBuilder jdbcBuilder = new StringBuilder("jdbc:postgresql://")
                        .append(host).append(":").append(port).append(path);

                if (query != null && !query.isBlank()) {
                    jdbcBuilder.append("?").append(query);
                    if (!query.contains("sslmode=")) {
                        jdbcBuilder.append("&sslmode=require");
                    }
                } else {
                    jdbcBuilder.append("?sslmode=require");
                }

                resolvedUrl = jdbcBuilder.toString();
                log.info("Normalized PostgreSQL connection URI to JDBC URL: {}", maskUrl(resolvedUrl));
            } catch (URISyntaxException e) {
                log.warn("Failed to parse PostgreSQL URI: {}. Proceeding with raw string.", e.getMessage());
            }
        } else if (resolvedUrl.startsWith("jdbc:postgresql://")) {
            // Ensure sslmode=require for non-localhost endpoints
            if (!resolvedUrl.contains("localhost") && !resolvedUrl.contains("127.0.0.1") && !resolvedUrl.contains("sslmode=")) {
                resolvedUrl = resolvedUrl.contains("?") ? resolvedUrl + "&sslmode=require" : resolvedUrl + "?sslmode=require";
            }
        }

        // 2. Check if the URL is an unconfigured template placeholder (e.g., ep-example...)
        if (resolvedUrl.contains("ep-example")) {
            log.warn("===============================================================================");
            log.warn("⚠️  [DATABASE NOTICE] Unconfigured placeholder DATABASE_URL detected ('ep-example...').");
            log.warn("⚠️  Switching to embedded in-memory database so application boots safely on Render.");
            log.warn("⚠️  To connect to your real Neon.tech database, configure DATABASE_URL in Render Dashboard!");
            log.warn("===============================================================================");
            return createFallbackDataSource();
        }

        // 3. Pre-flight verification of PostgreSQL connection
        log.info("Verifying PostgreSQL database connection to: {}", maskUrl(resolvedUrl));
        boolean connected = false;
        String connectionError = null;

        try {
            DriverManager.setLoginTimeout(20);
            try (Connection testConn = DriverManager.getConnection(resolvedUrl, resolvedUsername, resolvedPassword)) {
                if (testConn.isValid(5)) {
                    connected = true;
                    log.info("✅ PostgreSQL connection verified successfully! Product: {}", testConn.getMetaData().getDatabaseProductName());
                }
            }
        } catch (SQLException ex) {
            connectionError = ex.getMessage();
            log.warn("Initial PostgreSQL connection attempt failed: {}. Retrying once for serverless wake-up...", connectionError);
            try {
                Thread.sleep(3000);
                try (Connection retryConn = DriverManager.getConnection(resolvedUrl, resolvedUsername, resolvedPassword)) {
                    if (retryConn.isValid(5)) {
                        connected = true;
                        log.info("✅ PostgreSQL connection verified on retry! Product: {}", retryConn.getMetaData().getDatabaseProductName());
                    }
                }
            } catch (Exception retryEx) {
                connectionError = retryEx.getMessage();
            }
        }

        // 4. Return primary HikariCP DataSource or fallback
        if (connected) {
            this.usingFallback = false;
            this.databaseType = "POSTGRESQL";
            return createPostgresDataSource(resolvedUrl, resolvedUsername, resolvedPassword);
        } else {
            log.error("===============================================================================");
            log.error("❌  [DATABASE CONNECTION FAILED]");
            log.error("❌  Target JDBC URL: {}", maskUrl(resolvedUrl));
            log.error("❌  Username: {}", resolvedUsername);
            log.error("❌  Error Message: {}", connectionError);
            log.warn("⚠️  Falling back to in-memory H2 database (PostgreSQL mode) to prevent crash loop.");
            log.warn("⚠️  Please verify DATABASE_URL and credentials in Render Dashboard -> Settings -> Environment.");
            log.warn("===============================================================================");
            return createFallbackDataSource();
        }
    }

    private DataSource createPostgresDataSource(String url, String username, String password) {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setMaxLifetime(600000);
        config.setConnectionTimeout(30000);
        config.setValidationTimeout(5000);
        config.setInitializationFailTimeout(60000);
        config.setLeakDetectionThreshold(60000);
        config.setPoolName("PromptXub-NeonPool");

        config.addDataSourceProperty("reWriteBatchedInserts", "true");
        config.addDataSourceProperty("stringtype", "unspecified");

        return new HikariDataSource(config);
    }

    private DataSource createFallbackDataSource() {
        this.usingFallback = true;
        this.databaseType = "H2_POSTGRES_MODE";

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.h2.Driver");
        config.setJdbcUrl("jdbc:h2:mem:promptxub_db;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1");
        config.setUsername("sa");
        config.setPassword("");
        config.setMaximumPoolSize(5);
        config.setPoolName("PromptXub-FallbackH2Pool");

        return new HikariDataSource(config);
    }

    private String resolveUrl(Environment env) {
        String url = env.getProperty("DATABASE_URL");
        if (url == null || url.isBlank()) {
            url = env.getProperty("SPRING_DATASOURCE_URL");
        }
        if (url == null || url.isBlank()) {
            url = env.getProperty("spring.datasource.url");
        }
        return (url != null && !url.isBlank()) ? url.trim() : "jdbc:postgresql://ep-example.eu-central-1.aws.neon.tech/promptxub_db?sslmode=require";
    }

    private String resolveUsername(Environment env) {
        String user = env.getProperty("DATABASE_USERNAME");
        if (user == null || user.isBlank()) {
            user = env.getProperty("SPRING_DATASOURCE_USERNAME");
        }
        if (user == null || user.isBlank()) {
            user = env.getProperty("spring.datasource.username");
        }
        return (user != null && !user.isBlank()) ? user.trim() : "promptxub_user";
    }

    private String resolvePassword(Environment env) {
        String pass = env.getProperty("DATABASE_PASSWORD");
        if (pass == null || pass.isBlank()) {
            pass = env.getProperty("SPRING_DATASOURCE_PASSWORD");
        }
        if (pass == null || pass.isBlank()) {
            pass = env.getProperty("spring.datasource.password");
        }
        return (pass != null) ? pass.trim() : "promptxub_password";
    }

    private String maskUrl(String url) {
        if (url == null) return "null";
        return url.replaceAll(":[^/@]+@", ":***@");
    }

    public boolean isUsingFallback() {
        return usingFallback;
    }

    public String getDatabaseType() {
        return databaseType;
    }
}
