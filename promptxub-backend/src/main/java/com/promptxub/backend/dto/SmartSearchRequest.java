package com.promptxub.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class SmartSearchRequest {

    @NotBlank(message = "Search query is required")
    private String query;

    public SmartSearchRequest() {
    }

    public SmartSearchRequest(String query) {
        this.query = query;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
