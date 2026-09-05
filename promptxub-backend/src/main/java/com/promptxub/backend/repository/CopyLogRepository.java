package com.promptxub.backend.repository;

import com.promptxub.backend.entity.CopyLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface CopyLogRepository extends JpaRepository<CopyLog, Long> {

    long countByPromptId(Long promptId);

    long countByCopiedAtAfter(Instant instant);

    Page<CopyLog> findByPromptIdOrderByCopiedAtDesc(Long promptId, Pageable pageable);

    @Query("SELECT cl.prompt.id, COUNT(cl) as cnt FROM CopyLog cl WHERE cl.copiedAt >= :since GROUP BY cl.prompt.id ORDER BY cnt DESC")
    List<Object[]> findTopTrendingPromptIds(@Param("since") Instant since, Pageable pageable);
}
