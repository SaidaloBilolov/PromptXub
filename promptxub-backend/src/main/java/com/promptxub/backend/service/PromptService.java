package com.promptxub.backend.service;

import com.promptxub.backend.dto.PromptUpdateRequest;
import com.promptxub.backend.entity.Prompt;
import com.promptxub.backend.repository.PromptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PromptService {

    private final PromptRepository promptRepository;

    public PromptService(PromptRepository promptRepository) {
        this.promptRepository = promptRepository;
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
        if (request.getCopyCount() != null) {
            prompt.setCopyCount(request.getCopyCount());
        }
        if (request.getViewCount() != null) {
            prompt.setViewCount(request.getViewCount());
        }
        if (request.getIsFeatured() != null) {
            prompt.setIsFeatured(request.getIsFeatured());
        }
        if (request.getIsActive() != null) {
            prompt.setIsActive(request.getIsActive());
        }

        return promptRepository.save(prompt);
    }
}
