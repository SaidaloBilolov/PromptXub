package com.promptxub.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class EnhancePromptRequest {

    @NotBlank(message = "Prompt text is required")
    private String prompt;

    private String aiModel;

    public EnhancePromptRequest() {
    }

    public EnhancePromptRequest(String prompt, String aiModel) {
        this.prompt = prompt;
        this.aiModel = aiModel;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getAiModel() {
        return aiModel;
    }

    public void setAiModel(String aiModel) {
        this.aiModel = aiModel;
    }
}
