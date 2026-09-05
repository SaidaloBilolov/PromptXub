package com.promptxub.backend.repository;

import com.promptxub.backend.entity.SearchLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchLogRepository extends JpaRepository<SearchLog, Long> {

    @Query("SELECT sl.query, COUNT(sl) as totalCount FROM SearchLog sl GROUP BY sl.query ORDER BY totalCount DESC")
    List<Object[]> findPopularSearchQueries(Pageable pageable);
}
