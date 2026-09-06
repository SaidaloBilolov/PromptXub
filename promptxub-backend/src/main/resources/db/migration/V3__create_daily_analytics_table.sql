-- PostgreSQL Migration Script: Daily Analytics Time-Series Table
-- Target Database: PostgreSQL 14+

CREATE TABLE IF NOT EXISTS daily_analytics (
    date DATE PRIMARY KEY,
    views_count BIGINT NOT NULL DEFAULT 0,
    copies_count BIGINT NOT NULL DEFAULT 0,
    visitors_count BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics (date DESC);
