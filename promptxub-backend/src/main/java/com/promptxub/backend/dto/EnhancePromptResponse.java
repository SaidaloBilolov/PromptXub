package com.promptxub.backend.dto;

public class EnhancePromptResponse {

    private String originalPrompt;
    private String enhancedPrompt;
    private String aiModel;
    private String suggestedParameters;

    public EnhancePromptResponse() {
    }

    public EnhancePromptResponse(String originalPrompt, String enhancedPrompt, String aiModel, String suggestedParameters) {
        this.originalPrompt = originalPrompt;
        this.enhancedPrompt = enhancedPrompt;
        this.aiModel = aiModel;
        this.suggestedParameters = suggestedParameters;
    }

    public String getOriginalPrompt() {
        return originalPrompt;
    }

    public void setOriginalPrompt(String originalPrompt) {
        this.originalPrompt = originalPrompt;
    }

    public String getEnhancedPrompt() {
        return enhancedPrompt;
    }

    public void setEnhancedPrompt(String enhancedPrompt) {
        this.enhancedPrompt = enhancedPrompt;
    }

    public String getAiModel() {
        return aiModel;
    }

    public void setAiModel(String aiModel) {
        this.aiModel = aiModel;
    }

    public String getSuggestedParameters() {
        return suggestedParameters;
    }

    public void setSuggestedParameters(String suggestedParameters) {
        this.suggestedParameters = suggestedParameters;
    }
}
