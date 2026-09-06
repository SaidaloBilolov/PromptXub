-- ===================================================================
-- PROMPTXUB - NEON POSTGRESQL SCHEMA INITIALIZATION SCRIPT
-- ===================================================================

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    provider VARCHAR(20) DEFAULT 'Email',
    avatar_url VARCHAR(500),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 3. User Roles Join Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    slug VARCHAR(60) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon VARCHAR(50),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE
);

-- 6. Prompts Table
CREATE TABLE IF NOT EXISTS prompts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    prompt_text TEXT NOT NULL,
    negative_prompt TEXT,
    ai_model VARCHAR(80) NOT NULL,
    content_type VARCHAR(20) NOT NULL,
    media_url VARCHAR(1000) NOT NULL,
    media_public_id VARCHAR(300),
    thumbnail_url VARCHAR(1000),
    aspect_ratio VARCHAR(20),
    width INT,
    height INT,
    duration DOUBLE PRECISION,
    real_copy_count BIGINT NOT NULL DEFAULT 0,
    real_view_count BIGINT NOT NULL DEFAULT 0,
    display_copy_count BIGINT NOT NULL DEFAULT 0,
    display_view_count BIGINT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 7. Prompt Tags Join Table
CREATE TABLE IF NOT EXISTS prompt_tags (
    prompt_id BIGINT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (prompt_id, tag_id)
);

-- 8. Copy Logs Table
CREATE TABLE IF NOT EXISTS copy_logs (
    id BIGSERIAL PRIMARY KEY,
    prompt_id BIGINT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    user_ip VARCHAR(64),
    user_agent VARCHAR(500),
    copied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Search Logs Table
CREATE TABLE IF NOT EXISTS search_logs (
    id BIGSERIAL PRIMARY KEY,
    query VARCHAR(255) NOT NULL,
    results_count INT,
    user_ip VARCHAR(64),
    searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Daily Analytics Table
CREATE TABLE IF NOT EXISTS daily_analytics (
    date DATE PRIMARY KEY,
    views_count BIGINT NOT NULL DEFAULT 0,
    copies_count BIGINT NOT NULL DEFAULT 0,
    visitors_count BIGINT NOT NULL DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompts_content_type ON prompts(content_type);
CREATE INDEX IF NOT EXISTS idx_prompts_ai_model ON prompts(ai_model);
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);

-- Seed Default Roles
INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;
