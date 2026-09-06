package com.promptxub.backend.repository;

import com.promptxub.backend.entity.DailyAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyAnalyticsRepository extends JpaRepository<DailyAnalytics, LocalDate> {

    List<DailyAnalytics> findByDateBetweenOrderByDateAsc(LocalDate startDate, LocalDate endDate);
}
