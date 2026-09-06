package com.promptxub.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "prompts", indexes = {
        @Index(name = "idx_prompts_content_type", columnList = "content_type"),
        @Index(name = "idx_prompts_ai_model", columnList = "ai_model"),
        @Index(name = "idx_prompts_copy_count", columnList = "copy_count DESC"),
        @Index(name = "idx_prompts_created_at", columnList = "created_at DESC"),
        @Index(name = "idx_prompts_is_featured", columnList = "is_featured"),
        @Index(name = "idx_prompts_is_active", columnList = "is_active")
})
@EntityListeners(AuditingEntityListener.class)
public class Prompt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank
    @Column(name = "prompt_text", nullable = false, columnDefinition = "TEXT")
    private String promptText;

    @Column(name = "negative_prompt", columnDefinition = "TEXT")
    private String negativePrompt;

    @NotBlank
    @Size(max = 80)
    @Column(name = "ai_model", nullable = false, length = 80)
    private String aiModel;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false, length = 20)
    private ContentType contentType;

    @NotBlank
    @Column(name = "media_url", nullable = false, length = 1000)
    private String mediaUrl;

    @Column(name = "media_public_id", length = 300)
    private String mediaPublicId;

    @Column(name = "thumbnail_url", length = 1000)
    private String thumbnailUrl;

    @Column(name = "aspect_ratio", length = 20)
    private String aspectRatio;

    private Integer width;

    private Integer height;

    private Double duration;

    @Column(name = "real_copy_count", nullable = false)
    private Long realCopyCount = 0L;

    @Column(name = "real_view_count", nullable = false)
    private Long realViewCount = 0L;

    @Column(name = "display_copy_count", nullable = false)
    private Long displayCopyCount = 0L;

    @Column(name = "display_view_count", nullable = false)
    private Long displayViewCount = 0L;

    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "prompt_tags",
            joinColumns = @JoinColumn(name = "prompt_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    public Prompt() {
    }

    public Prompt(Long id, String title, String promptText, String negativePrompt, String aiModel,
                  ContentType contentType, String mediaUrl, String mediaPublicId, String thumbnailUrl,
                  String aspectRatio, Integer width, Integer height, Double duration, Long realCopyCount,
                  Long realViewCount, Long displayCopyCount, Long displayViewCount, Boolean isFeatured,
                  Boolean isActive, Category category, User author, Set<Tag> tags, Instant createdAt,
                  Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.promptText = promptText;
        this.negativePrompt = negativePrompt;
        this.aiModel = aiModel;
        this.contentType = contentType;
        this.mediaUrl = mediaUrl;
        this.mediaPublicId = mediaPublicId;
        this.thumbnailUrl = thumbnailUrl;
        this.aspectRatio = aspectRatio;
        this.width = width;
        this.height = height;
        this.duration = duration;
        this.realCopyCount = (realCopyCount != null) ? realCopyCount : 0L;
        this.realViewCount = (realViewCount != null) ? realViewCount : 0L;
        this.displayCopyCount = (displayCopyCount != null) ? displayCopyCount : 0L;
        this.displayViewCount = (displayViewCount != null) ? displayViewCount : 0L;
        this.isFeatured = (isFeatured != null) ? isFeatured : false;
        this.isActive = (isActive != null) ? isActive : true;
        this.category = category;
        this.author = author;
        this.tags = (tags != null) ? tags : new HashSet<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getMediaPublicId() {
        return mediaPublicId;
    }

    public void setMediaPublicId(String mediaPublicId) {
        this.mediaPublicId = mediaPublicId;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getAspectRatio() {
        return aspectRatio;
    }

    public void setAspectRatio(String aspectRatio) {
        this.aspectRatio = aspectRatio;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public Long getRealCopyCount() {
        return realCopyCount != null ? realCopyCount : 0L;
    }

    public void setRealCopyCount(Long realCopyCount) {
        this.realCopyCount = realCopyCount;
    }

    public Long getRealViewCount() {
        return realViewCount != null ? realViewCount : 0L;
    }

    public void setRealViewCount(Long realViewCount) {
        this.realViewCount = realViewCount;
    }

    public Long getDisplayCopyCount() {
        return displayCopyCount != null ? displayCopyCount : 0L;
    }

    public void setDisplayCopyCount(Long displayCopyCount) {
        this.displayCopyCount = displayCopyCount;
    }

    public Long getDisplayViewCount() {
        return displayViewCount != null ? displayViewCount : 0L;
    }

    public void setDisplayViewCount(Long displayViewCount) {
        this.displayViewCount = displayViewCount;
    }

    public Long getCopyCount() {
        return getDisplayCopyCount();
    }

    public void setCopyCount(Long copyCount) {
        this.displayCopyCount = (copyCount != null) ? copyCount : 0L;
    }

    public Long getViewCount() {
        return getDisplayViewCount();
    }

    public void setViewCount(Long viewCount) {
        this.displayViewCount = (viewCount != null) ? viewCount : 0L;
    }

    public Double getConversionRate() {
        Long rViews = getRealViewCount();
        if (rViews == 0L) return 0.0;
        return Math.round(((double) getRealCopyCount() / rViews * 100.0) * 10.0) / 10.0;
    }

    public void incrementView() {
        this.realViewCount = getRealViewCount() + 1;
        this.displayViewCount = getDisplayViewCount() + 1;
    }

    public void incrementCopy() {
        this.realCopyCount = getRealCopyCount() + 1;
        this.displayCopyCount = getDisplayCopyCount() + 1;
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static class Builder {
        private Long id;
        private String title;
        private String promptText;
        private String negativePrompt;
        private String aiModel;
        private ContentType contentType;
        private String mediaUrl;
        private String mediaPublicId;
        private String thumbnailUrl;
        private String aspectRatio;
        private Integer width;
        private Integer height;
        private Double duration;
        private Long realCopyCount = 0L;
        private Long realViewCount = 0L;
        private Long displayCopyCount = 0L;
        private Long displayViewCount = 0L;
        private Boolean isFeatured = false;
        private Boolean isActive = true;
        private Category category;
        private User author;
        private Set<Tag> tags = new HashSet<>();
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder promptText(String promptText) {
            this.promptText = promptText;
            return this;
        }

        public Builder negativePrompt(String negativePrompt) {
            this.negativePrompt = negativePrompt;
            return this;
        }

        public Builder aiModel(String aiModel) {
            this.aiModel = aiModel;
            return this;
        }

        public Builder contentType(ContentType contentType) {
            this.contentType = contentType;
            return this;
        }

        public Builder mediaUrl(String mediaUrl) {
            this.mediaUrl = mediaUrl;
            return this;
        }

        public Builder mediaPublicId(String mediaPublicId) {
            this.mediaPublicId = mediaPublicId;
            return this;
        }

        public Builder thumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
            return this;
        }

        public Builder aspectRatio(String aspectRatio) {
            this.aspectRatio = aspectRatio;
            return this;
        }

        public Builder width(Integer width) {
            this.width = width;
            return this;
        }

        public Builder height(Integer height) {
            this.height = height;
            return this;
        }

        public Builder duration(Double duration) {
            this.duration = duration;
            return this;
        }

        public Builder realCopyCount(Long realCopyCount) {
            this.realCopyCount = realCopyCount;
            return this;
        }

        public Builder realViewCount(Long realViewCount) {
            this.realViewCount = realViewCount;
            return this;
        }

        public Builder displayCopyCount(Long displayCopyCount) {
            this.displayCopyCount = displayCopyCount;
            return this;
        }

        public Builder displayViewCount(Long displayViewCount) {
            this.displayViewCount = displayViewCount;
            return this;
        }

        public Builder copyCount(Long copyCount) {
            this.displayCopyCount = copyCount;
            return this;
        }

        public Builder viewCount(Long viewCount) {
            this.displayViewCount = viewCount;
            return this;
        }

        public Builder isFeatured(Boolean isFeatured) {
            this.isFeatured = isFeatured;
            return this;
        }

        public Builder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public Builder category(Category category) {
            this.category = category;
            return this;
        }

        public Builder author(User author) {
            this.author = author;
            return this;
        }

        public Builder tags(Set<Tag> tags) {
            this.tags = tags;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Prompt build() {
            return new Prompt(id, title, promptText, negativePrompt, aiModel, contentType, mediaUrl,
                    mediaPublicId, thumbnailUrl, aspectRatio, width, height, duration, realCopyCount,
                    realViewCount, displayCopyCount, displayViewCount, isFeatured, isActive, category,
                    author, tags, createdAt, updatedAt);
        }
    }
}
