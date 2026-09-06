package com.promptxub.backend.dto;

import java.util.List;

public class UserStatsResponse {
    private Long totalUsers;
    private Long googleUsersCount;
    private Long appleUsersCount;
    private Long emailUsersCount;
    private Long newUsersToday;
    private List<UserSummaryDto> usersList;

    public UserStatsResponse() {
    }

    public UserStatsResponse(Long totalUsers, Long googleUsersCount, Long appleUsersCount, Long emailUsersCount, Long newUsersToday, List<UserSummaryDto> usersList) {
        this.totalUsers = totalUsers;
        this.googleUsersCount = googleUsersCount;
        this.appleUsersCount = appleUsersCount;
        this.emailUsersCount = emailUsersCount;
        this.newUsersToday = newUsersToday;
        this.usersList = usersList;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getGoogleUsersCount() {
        return googleUsersCount;
    }

    public void setGoogleUsersCount(Long googleUsersCount) {
        this.googleUsersCount = googleUsersCount;
    }

    public Long getAppleUsersCount() {
        return appleUsersCount;
    }

    public void setAppleUsersCount(Long appleUsersCount) {
        this.appleUsersCount = appleUsersCount;
    }

    public Long getEmailUsersCount() {
        return emailUsersCount;
    }

    public void setEmailUsersCount(Long emailUsersCount) {
        this.emailUsersCount = emailUsersCount;
    }

    public Long getNewUsersToday() {
        return newUsersToday;
    }

    public void setNewUsersToday(Long newUsersToday) {
        this.newUsersToday = newUsersToday;
    }

    public List<UserSummaryDto> getUsersList() {
        return usersList;
    }

    public void setUsersList(List<UserSummaryDto> usersList) {
        this.usersList = usersList;
    }
}
