package com.promptxub.backend.controller;

import com.promptxub.backend.entity.ContentType;
import com.promptxub.backend.entity.Prompt;
import com.promptxub.backend.repository.CategoryRepository;
import com.promptxub.backend.repository.PromptRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/v1/public")
@Transactional(readOnly = true)
public class PublicPromptController {

    private static final Logger log = LoggerFactory.getLogger(PublicPromptController.class);

    private final PromptRepository promptRepository;
    private final CategoryRepository categoryRepository;

    public PublicPromptController(PromptRepository promptRepository, CategoryRepository categoryRepository) {
        this.promptRepository = promptRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/prompts")
    public ResponseEntity<?> getPublicPrompts(
            @RequestParam(required = false) String contentType,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        try {
            Sort sortOrder = Sort.by(Sort.Direction.DESC, "id");
            if ("trending".equalsIgnoreCase(sort) || "top".equalsIgnoreCase(sort)) {
                sortOrder = Sort.by(Sort.Direction.DESC, "displayCopyCount");
            }

            Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sortOrder);
            ContentType cType = null;
            if (contentType != null && !contentType.isBlank()) {
                try {
                    cType = ContentType.valueOf(contentType.toUpperCase());
                } catch (Exception ignored) {}
            }

            Page<Prompt> prompts;
            if (query != null && !query.isBlank()) {
                if (cType != null) {
                    prompts = promptRepository.searchPromptsByContentType(query, cType, pageable);
                } else {
                    prompts = promptRepository.searchPrompts(query, pageable);
                }
            } else if (category != null && !category.isBlank()) {
                prompts = promptRepository.findByCategorySlugAndIsActiveTrue(category, pageable);
            } else if (cType != null) {
                prompts = promptRepository.findByContentTypeAndIsActiveTrue(cType, pageable);
            } else {
                prompts = promptRepository.findByIsActiveTrue(pageable);
            }

            Page<Map<String, Object>> dtoPage = prompts.map(this::mapToPromptResponse);
            return ResponseEntity.ok(dtoPage);
        } catch (Throwable ex) {
            log.error("Error fetching public prompts: {}", ex.getMessage(), ex);
            java.io.StringWriter sw = new java.io.StringWriter();
            ex.printStackTrace(new java.io.PrintWriter(sw));
            Map<String, Object> err = new LinkedHashMap<>();
            err.put("error", ex.getClass().getName() + ": " + ex.getMessage());
            err.put("trace", sw.toString());
            return ResponseEntity.status(500).body(err);
        }
    }

    @GetMapping("/prompts/{id}")
    public ResponseEntity<?> getPublicPromptById(@PathVariable Long id) {
        return promptRepository.findById(id)
                .map(p -> ResponseEntity.ok(mapToPromptResponse(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    private Map<String, Object> mapToPromptResponse(Prompt p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", p.getId());
        map.put("title", p.getTitle());
        map.put("promptText", p.getPromptText());
        map.put("negativePrompt", p.getNegativePrompt());
        map.put("aiModel", p.getAiModel());
        map.put("contentType", p.getContentType());
        map.put("mediaUrl", p.getMediaUrl());
        map.put("mediaPublicId", p.getMediaPublicId());
        map.put("thumbnailUrl", p.getThumbnailUrl());
        map.put("aspectRatio", p.getAspectRatio());
        map.put("width", p.getWidth());
        map.put("height", p.getHeight());
        map.put("duration", p.getDuration());
        map.put("copyCount", p.getDisplayCopyCount());
        map.put("viewCount", p.getDisplayViewCount());
        map.put("displayCopyCount", p.getDisplayCopyCount());
        map.put("displayViewCount", p.getDisplayViewCount());
        map.put("realCopyCount", p.getRealCopyCount());
        map.put("realViewCount", p.getRealViewCount());
        map.put("isFeatured", p.getIsFeatured());
        map.put("isActive", p.getIsActive());
        map.put("createdAt", p.getCreatedAt());
        map.put("updatedAt", p.getUpdatedAt());

        if (org.hibernate.Hibernate.isInitialized(p.getCategory()) && p.getCategory() != null) {
            try {
                Map<String, Object> catMap = new LinkedHashMap<>();
                catMap.put("id", p.getCategory().getId());
                catMap.put("name", p.getCategory().getName());
                catMap.put("slug", p.getCategory().getSlug());
                catMap.put("description", p.getCategory().getDescription());
                catMap.put("icon", p.getCategory().getIcon());
                catMap.put("displayOrder", p.getCategory().getDisplayOrder());
                map.put("category", catMap);
            } catch (Exception ex) {
                map.put("category", null);
            }
        } else {
            map.put("category", null);
        }

        try {
            if (org.hibernate.Hibernate.isInitialized(p.getTags()) && p.getTags() != null && !p.getTags().isEmpty()) {
                List<Map<String, Object>> tagsList = p.getTags().stream().map(t -> {
                    Map<String, Object> tagMap = new LinkedHashMap<>();
                    tagMap.put("id", t.getId());
                    tagMap.put("name", t.getName());
                    tagMap.put("slug", t.getSlug());
                    return tagMap;
                }).collect(Collectors.toList());
                map.put("tags", tagsList);
            } else {
                map.put("tags", Collections.emptyList());
            }
        } catch (Exception ex) {
            map.put("tags", Collections.emptyList());
        }

        return map;
    }
}
