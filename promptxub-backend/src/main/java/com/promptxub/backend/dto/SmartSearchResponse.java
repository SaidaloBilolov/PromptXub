package com.promptxub.backend.dto;

import java.util.List;

public class SmartSearchResponse {
    private String originalQuery;
    private String optimizedQuery;
    private String aiModel;
    private String category;
    private List<String> suggestedKeywords;

    public SmartSearchResponse() {
    }

    public SmartSearchResponse(String originalQuery, String optimizedQuery, String aiModel, String category, List<String> suggestedKeywords) {
        this.originalQuery = originalQuery;
        this.optimizedQuery = optimizedQuery;
        this.aiModel = aiModel;
        this.category = category;
        this.suggestedKeywords = suggestedKeywords;
    }

    public String getOriginalQuery() {
        return originalQuery;
    }

    public void setOriginalQuery(String originalQuery) {
        this.originalQuery = originalQuery;
    }

    public String getOptimizedQuery() {
        return optimizedQuery;
    }

    public void setOptimizedQuery(String optimizedQuery) {
        this.optimizedQuery = optimizedQuery;
    }

    public String getAiModel() {
        return aiModel;
    }

    public void setAiModel(String aiModel) {
        this.aiModel = aiModel;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getSuggestedKeywords() {
        return suggestedKeywords;
    }

    public void setSuggestedKeywords(List<String> suggestedKeywords) {
        this.suggestedKeywords = suggestedKeywords;
    }
}
