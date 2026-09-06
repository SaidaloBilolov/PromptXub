package com.promptxub.backend.dto;

import java.util.List;

public class JwtAuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String email;
    private List<String> roles;

    public JwtAuthResponse() {
    }

    public JwtAuthResponse(String accessToken, String tokenType, String username, String email, List<String> roles) {
        this.accessToken = accessToken;
        this.tokenType = (tokenType != null) ? tokenType : "Bearer";
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
