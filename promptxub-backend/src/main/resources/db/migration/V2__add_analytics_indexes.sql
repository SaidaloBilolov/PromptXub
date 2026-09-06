-- PostgreSQL Migration Script: Indexes for Prompt Analytics & Performance Optimization
-- Target Database: PostgreSQL 14+ / Supabase / Neon

CREATE INDEX IF NOT EXISTS idx_prompts_display_view_count ON prompts (display_view_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_display_copy_count ON prompts (display_copy_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_real_view_count ON prompts (real_view_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_real_copy_count ON prompts (real_copy_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts (category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_content_type ON prompts (content_type);
CREATE INDEX IF NOT EXISTS idx_prompts_ai_model ON prompts (ai_model);
