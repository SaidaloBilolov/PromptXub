package com.promptxub.backend.service;

import com.promptxub.backend.dto.MediaUploadResponse;
import com.promptxub.backend.dto.PromptUpdateRequest;
import com.promptxub.backend.entity.Category;
import com.promptxub.backend.entity.ContentType;
import com.promptxub.backend.entity.Prompt;
import com.promptxub.backend.entity.Tag;
import com.promptxub.backend.repository.CategoryRepository;
import com.promptxub.backend.repository.PromptRepository;
import com.promptxub.backend.repository.TagRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PromptService {

    private static final Logger log = LoggerFactory.getLogger(PromptService.class);

    private final PromptRepository promptRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final ImageKitService imageKitService;

    public PromptService(PromptRepository promptRepository,
                         CategoryRepository categoryRepository,
                         TagRepository tagRepository,
                         ImageKitService imageKitService) {
        this.promptRepository = promptRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.imageKitService = imageKitService;
    }

    @Transactional
    public Prompt createPromptWithMedia(MultipartFile file,
                                         String title,
                                         String promptText,
                                         String negativePrompt,
                                         String aiModel,
                                         String contentTypeStr,
                                         String aspectRatio,
                                         String categorySlug,
                                         String tagsStr,
                                         Long displayCopyCount,
                                         Long displayViewCount) {
        if (title == null || title.isBlank()) {
            title = "Untitled AI Prompt";
        }
        if (promptText == null || promptText.isBlank()) {
            promptText = title;
        }
        if (aiModel == null || aiModel.isBlank()) {
            aiModel = "Midjourney v6";
        }

        ContentType type = ContentType.PHOTO;
        if (contentTypeStr != null && contentTypeStr.equalsIgnoreCase("VIDEO")) {
            type = ContentType.VIDEO;
        }

        String mediaUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop";
        String mediaPublicId = null;
        String thumbUrl = null;
        Integer width = null;
        Integer height = null;

        if (file != null && !file.isEmpty()) {
            try {
                MediaUploadResponse uploadRes = imageKitService.uploadMedia(file, type);
                if (uploadRes != null && uploadRes.getUrl() != null) {
                    mediaUrl = uploadRes.getUrl();
                    mediaPublicId = uploadRes.getFileId();
                    thumbUrl = uploadRes.getThumbnailUrl();
                    width = uploadRes.getWidth();
                    height = uploadRes.getHeight();
                }
            } catch (Throwable ex) {
                log.warn("Media upload failed, using fallback URL: {}", ex.getMessage());
            }
        }

        Category category = null;
        if (categorySlug != null && !categorySlug.isBlank()) {
            String cleanSlug = categorySlug.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
            category = categoryRepository.findBySlug(cleanSlug).orElse(null);
            if (category == null && !cleanSlug.isBlank()) {
                String name = categorySlug.trim();
                Category newCat = Category.builder()
                        .name(name)
                        .slug(cleanSlug)
                        .displayOrder(99)
                        .build();
                try {
                    category = categoryRepository.save(newCat);
                } catch (Throwable ignored) {}
            }
        }
        if (category == null) {
            category = categoryRepository.findAll().stream().findFirst().orElse(null);
        }

        Set<Tag> tagSet = new HashSet<>();
        if (tagsStr != null && !tagsStr.isBlank()) {
            String[] split = tagsStr.split(",");
            for (String t : split) {
                String clean = t.trim().toLowerCase().replace("#", "");
                if (!clean.isEmpty()) {
                    try {
                        Tag tag = tagRepository.findBySlug(clean)
                                .orElseGet(() -> tagRepository.save(Tag.builder().name(clean).slug(clean).build()));
                        tagSet.add(tag);
                    } catch (Throwable ignored) {}
                }
            }
        }

        Prompt prompt = Prompt.builder()
                .title(title)
                .promptText(promptText)
                .negativePrompt(negativePrompt)
                .aiModel(aiModel)
                .contentType(type)
                .mediaUrl(mediaUrl)
                .mediaPublicId(mediaPublicId)
                .thumbnailUrl(thumbUrl)
                .aspectRatio(aspectRatio != null ? aspectRatio : "16:9")
                .width(width)
                .height(height)
                .displayCopyCount(displayCopyCount != null ? displayCopyCount : 0L)
                .displayViewCount(displayViewCount != null ? displayViewCount : 0L)
                .realCopyCount(0L)
                .realViewCount(0L)
                .isFeatured(true)
                .isActive(true)
                .category(category)
                .tags(tagSet)
                .build();

        return promptRepository.save(prompt);
    }

    @Transactional
    public Prompt createPromptFromJson(PromptUpdateRequest request) {
        String title = (request.getTitle() != null && !request.getTitle().isBlank()) ? request.getTitle() : "Untitled AI Prompt";
        String promptText = (request.getPromptText() != null && !request.getPromptText().isBlank()) ? request.getPromptText() : title;
        String aiModel = (request.getAiModel() != null && !request.getAiModel().isBlank()) ? request.getAiModel() : "Midjourney v6";

        ContentType type = ContentType.PHOTO;
        if (request.getContentType() != null && request.getContentType().equalsIgnoreCase("VIDEO")) {
            type = ContentType.VIDEO;
        }

        String mediaUrl = (request.getMediaUrl() != null && !request.getMediaUrl().isBlank())
                ? request.getMediaUrl()
                : "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop";

        Category category = null;
        if (request.getCategorySlug() != null && !request.getCategorySlug().isBlank()) {
            String cleanSlug = request.getCategorySlug().trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
            category = categoryRepository.findBySlug(cleanSlug).orElse(null);
            if (category == null && !cleanSlug.isBlank()) {
                String name = request.getCategorySlug().trim();
                Category newCat = Category.builder()
                        .name(name)
                        .slug(cleanSlug)
                        .displayOrder(99)
                        .build();
                try {
                    category = categoryRepository.save(newCat);
                } catch (Throwable ignored) {}
            }
        }
        if (category == null) {
            category = categoryRepository.findAll().stream().findFirst().orElse(null);
        }

        Prompt prompt = Prompt.builder()
                .title(title)
                .promptText(promptText)
                .negativePrompt(request.getNegativePrompt())
                .aiModel(aiModel)
                .contentType(type)
                .mediaUrl(mediaUrl)
                .aspectRatio(request.getAspectRatio() != null ? request.getAspectRatio() : "16:9")
                .displayCopyCount(request.getDisplayCopyCount() != null ? request.getDisplayCopyCount() : 0L)
                .displayViewCount(request.getDisplayViewCount() != null ? request.getDisplayViewCount() : 0L)
                .realCopyCount(0L)
                .realViewCount(0L)
                .isFeatured(true)
                .isActive(true)
                .category(category)
                .build();

        return promptRepository.save(prompt);
    }

    @Transactional
    public Prompt updatePromptMetrics(Long id, PromptUpdateRequest request) {
        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prompt not found with id: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            prompt.setTitle(request.getTitle());
        }
        if (request.getPromptText() != null && !request.getPromptText().isBlank()) {
            prompt.setPromptText(request.getPromptText());
        }
        if (request.getNegativePrompt() != null) {
            prompt.setNegativePrompt(request.getNegativePrompt());
        }
        if (request.getAiModel() != null && !request.getAiModel().isBlank()) {
            prompt.setAiModel(request.getAiModel());
        }
        if (request.getAspectRatio() != null && !request.getAspectRatio().isBlank()) {
            prompt.setAspectRatio(request.getAspectRatio());
        }
        if (request.getCategorySlug() != null && !request.getCategorySlug().isBlank()) {
            String cleanSlug = request.getCategorySlug().trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
            Category cat = categoryRepository.findBySlug(cleanSlug).orElse(null);
            if (cat == null && !cleanSlug.isBlank()) {
                String name = request.getCategorySlug().trim();
                Category newCat = Category.builder()
                        .name(name)
                        .slug(cleanSlug)
                        .displayOrder(99)
                        .build();
                try {
                    cat = categoryRepository.save(newCat);
                } catch (Throwable ignored) {}
            }
            if (cat != null) {
                prompt.setCategory(cat);
            }
        }
        if (request.getContentType() != null && !request.getContentType().isBlank()) {
            try {
                prompt.setContentType(ContentType.valueOf(request.getContentType().toUpperCase()));
            } catch (Exception ignored) {}
        }
        if (request.getDisplayCopyCount() != null) {
            prompt.setDisplayCopyCount(request.getDisplayCopyCount());
        } else if (request.getCopyCount() != null) {
            prompt.setDisplayCopyCount(request.getCopyCount());
        }
        if (request.getDisplayViewCount() != null) {
            prompt.setDisplayViewCount(request.getDisplayViewCount());
        } else if (request.getViewCount() != null) {
            prompt.setDisplayViewCount(request.getViewCount());
        }
        if (request.getIsFeatured() != null) {
            prompt.setIsFeatured(request.getIsFeatured());
        }
        if (request.getIsActive() != null) {
            prompt.setIsActive(request.getIsActive());
        }

        return promptRepository.save(prompt);
    }

    public java.util.List<Prompt> getAllPromptsForAdmin() {
        return promptRepository.findAll();
    }
}
