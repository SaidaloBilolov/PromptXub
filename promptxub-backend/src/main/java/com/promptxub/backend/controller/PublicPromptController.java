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

            return ResponseEntity.ok(prompts);
        } catch (Exception ex) {
            log.error("Error fetching public prompts: {}", ex.getMessage(), ex);
            return ResponseEntity.ok(Page.empty());
        }
    }

    @GetMapping("/prompts/{id}")
    public ResponseEntity<Prompt> getPublicPromptById(@PathVariable Long id) {
        return promptRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }
}
