package com.promptxub.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_analytics", indexes = {
        @Index(name = "idx_daily_analytics_date", columnList = "date DESC")
})
public class DailyAnalytics {

    @Id
    @Column(nullable = false, unique = true)
    private LocalDate date;

    @Column(name = "views_count", nullable = false)
    private Long viewsCount = 0L;

    @Column(name = "copies_count", nullable = false)
    private Long copiesCount = 0L;

    @Column(name = "visitors_count", nullable = false)
    private Long visitorsCount = 0L;

    public DailyAnalytics() {
    }

    public DailyAnalytics(LocalDate date, Long viewsCount, Long copiesCount, Long visitorsCount) {
        this.date = date;
        this.viewsCount = (viewsCount != null) ? viewsCount : 0L;
        this.copiesCount = (copiesCount != null) ? copiesCount : 0L;
        this.visitorsCount = (visitorsCount != null) ? visitorsCount : 0L;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getViewsCount() {
        return viewsCount;
    }

    public void setViewsCount(Long viewsCount) {
        this.viewsCount = viewsCount;
    }

    public Long getCopiesCount() {
        return copiesCount;
    }

    public void setCopiesCount(Long copiesCount) {
        this.copiesCount = copiesCount;
    }

    public Long getVisitorsCount() {
        return visitorsCount;
    }

    public void setVisitorsCount(Long visitorsCount) {
        this.visitorsCount = visitorsCount;
    }
}
