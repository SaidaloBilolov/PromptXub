package com.promptxub.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "search_logs", indexes = {
        @Index(name = "idx_search_logs_query", columnList = "query"),
        @Index(name = "idx_search_logs_searched_at", columnList = "searched_at DESC")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}
