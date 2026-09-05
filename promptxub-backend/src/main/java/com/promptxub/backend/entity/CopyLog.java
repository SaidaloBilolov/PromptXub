package com.promptxub.backend.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "copy_logs", indexes = {
        @Index(name = "idx_copy_logs_prompt_id", columnList = "prompt_id"),
        @Index(name = "idx_copy_logs_copied_at", columnList = "copied_at DESC")
})
@EntityListeners(AuditingEntityListener.class)
public class CopyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;

    @Column(name = "user_ip", length = 64)
    private String userIp;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @CreatedDate
    @Column(name = "copied_at", nullable = false, updatable = false)
    private Instant copiedAt;

    public CopyLog() {
    }

    public CopyLog(Long id, Prompt prompt, String userIp, String userAgent, Instant copiedAt) {
        this.id = id;
        this.prompt = prompt;
        this.userIp = userIp;
        this.userAgent = userAgent;
        this.copiedAt = copiedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Prompt getPrompt() {
        return prompt;
    }

    public void setPrompt(Prompt prompt) {
        this.prompt = prompt;
    }

    public String getUserIp() {
        return userIp;
    }

    public void setUserIp(String userIp) {
        this.userIp = userIp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public Instant getCopiedAt() {
        return copiedAt;
    }

    public void setCopiedAt(Instant copiedAt) {
        this.copiedAt = copiedAt;
    }

    public static class Builder {
        private Long id;
        private Prompt prompt;
        private String userIp;
        private String userAgent;
        private Instant copiedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder prompt(Prompt prompt) {
            this.prompt = prompt;
            return this;
        }

        public Builder userIp(String userIp) {
            this.userIp = userIp;
            return this;
        }

        public Builder userAgent(String userAgent) {
            this.userAgent = userAgent;
            return this;
        }

        public Builder copiedAt(Instant copiedAt) {
            this.copiedAt = copiedAt;
            return this;
        }

        public CopyLog build() {
            return new CopyLog(id, prompt, userIp, userAgent, copiedAt);
        }
    }
}
