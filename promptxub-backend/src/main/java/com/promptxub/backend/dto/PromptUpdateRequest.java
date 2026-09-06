package com.promptxub.backend.dto;

public class PromptUpdateRequest {
    private String title;
    private String promptText;
    private String negativePrompt;
    private String aiModel;
    private String contentType;
    private String mediaUrl;
    private String aspectRatio;
    private Long copyCount;
    private Long viewCount;
    private Long displayCopyCount;
    private Long displayViewCount;
    private Boolean isFeatured;
    private Boolean isActive;
    private String categorySlug;

    public PromptUpdateRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPromptText() {
        return promptText;
    }

    public void setPromptText(String promptText) {
        this.promptText = promptText;
    }

    public String getNegativePrompt() {
        return negativePrompt;
    }

    public void setNegativePrompt(String negativePrompt) {
        this.negativePrompt = negativePrompt;
    }

    public String getAiModel() {
        return aiModel;
    }

    public void setAiModel(String aiModel) {
        this.aiModel = aiModel;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getAspectRatio() {
        return aspectRatio;
    }

    public void setAspectRatio(String aspectRatio) {
        this.aspectRatio = aspectRatio;
    }

    public Long getCopyCount() {
        return copyCount != null ? copyCount : displayCopyCount;
    }

    public void setCopyCount(Long copyCount) {
        this.copyCount = copyCount;
    }

    public Long getViewCount() {
        return viewCount != null ? viewCount : displayViewCount;
    }

    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }

    public Long getDisplayCopyCount() {
        return displayCopyCount != null ? displayCopyCount : copyCount;
    }

    public void setDisplayCopyCount(Long displayCopyCount) {
        this.displayCopyCount = displayCopyCount;
    }

    public Long getDisplayViewCount() {
        return displayViewCount != null ? displayViewCount : viewCount;
    }

    public void setDisplayViewCount(Long displayViewCount) {
        this.displayViewCount = displayViewCount;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public void setCategorySlug(String categorySlug) {
        this.categorySlug = categorySlug;
    }
}
