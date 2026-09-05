package com.promptxub.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "search_logs", indexes = {
        @Index(name = "idx_search_logs_query", columnList = "query"),
        @Index(name = "idx_search_logs_searched_at", columnList = "searched_at DESC")
})
@EntityListeners(AuditingEntityListener.class)
public class SearchLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String query;

    @Column(name = "results_count")
    private Integer resultsCount;

    @Column(name = "user_ip", length = 64)
    private String userIp;

    @CreatedDate
    @Column(name = "searched_at", nullable = false, updatable = false)
    private Instant searchedAt;

    public SearchLog() {
    }

    public SearchLog(Long id, String query, Integer resultsCount, String userIp, Instant searchedAt) {
        this.id = id;
        this.query = query;
        this.resultsCount = resultsCount;
        this.userIp = userIp;
        this.searchedAt = searchedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public Integer getResultsCount() {
        return resultsCount;
    }

    public void setResultsCount(Integer resultsCount) {
        this.resultsCount = resultsCount;
    }

    public String getUserIp() {
        return userIp;
    }

    public void setUserIp(String userIp) {
        this.userIp = userIp;
    }

    public Instant getSearchedAt() {
        return searchedAt;
    }

    public void setSearchedAt(Instant searchedAt) {
        this.searchedAt = searchedAt;
    }

    public static class Builder {
        private Long id;
        private String query;
        private Integer resultsCount;
        private String userIp;
        private Instant searchedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder query(String query) {
            this.query = query;
            return this;
        }

        public Builder resultsCount(Integer resultsCount) {
            this.resultsCount = resultsCount;
            return this;
        }

        public Builder userIp(String userIp) {
            this.userIp = userIp;
            return this;
        }

        public Builder searchedAt(Instant searchedAt) {
            this.searchedAt = searchedAt;
            return this;
        }

        public SearchLog build() {
            return new SearchLog(id, query, resultsCount, userIp, searchedAt);
        }
    }
}
