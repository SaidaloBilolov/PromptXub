package com.promptxub.backend.dto;

import java.time.Instant;

public class UserSummaryDto {
    private Long id;
    private String name;
    private String email;
    private String provider;
    private String avatarUrl;
    private Instant joinedDate;
    private Integer savedPromptsCount;
    private boolean enabled;

    public UserSummaryDto() {
    }

    public UserSummaryDto(Long id, String name, String email, String provider, String avatarUrl, Instant joinedDate, Integer savedPromptsCount, boolean enabled) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.provider = provider;
        this.avatarUrl = avatarUrl;
        this.joinedDate = joinedDate;
        this.savedPromptsCount = savedPromptsCount;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Instant getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(Instant joinedDate) {
        this.joinedDate = joinedDate;
    }

    public Integer getSavedPromptsCount() {
        return savedPromptsCount;
    }

    public void setSavedPromptsCount(Integer savedPromptsCount) {
        this.savedPromptsCount = savedPromptsCount;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
