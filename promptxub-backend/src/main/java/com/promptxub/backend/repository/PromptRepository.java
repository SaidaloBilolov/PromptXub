package com.promptxub.backend.repository;

import com.promptxub.backend.entity.ContentType;
import com.promptxub.backend.entity.Prompt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, Long>, JpaSpecificationExecutor<Prompt> {

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category", "tags", "author"})
    Page<Prompt> findByIsActiveTrue(Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category", "tags", "author"})
    Page<Prompt> findByContentTypeAndIsActiveTrue(ContentType contentType, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category", "tags", "author"})
    Page<Prompt> findByCategorySlugAndIsActiveTrue(String slug, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category", "tags", "author"})
    Page<Prompt> findByAiModelIgnoreCaseAndIsActiveTrue(String aiModel, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category", "tags", "author"})
    Page<Prompt> findByIsFeaturedTrueAndIsActiveTrue(Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category", "tags", "author"})
    @Query("SELECT p FROM Prompt p WHERE p.isActive = true AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(p.promptText) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(p.aiModel) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Prompt> searchPrompts(@Param("query") String query, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category", "tags", "author"})
    @Query("SELECT p FROM Prompt p WHERE p.isActive = true AND p.contentType = :contentType AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(p.promptText) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(p.aiModel) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Prompt> searchPromptsByContentType(@Param("query") String query,
                                            @Param("contentType") ContentType contentType,
                                            Pageable pageable);

    @Modifying
    @Query("UPDATE Prompt p SET p.realCopyCount = p.realCopyCount + 1, p.displayCopyCount = p.displayCopyCount + 1 WHERE p.id = :id")
    int incrementCopyCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Prompt p SET p.realViewCount = p.realViewCount + 1, p.displayViewCount = p.displayViewCount + 1 WHERE p.id = :id")
    int incrementViewCount(@Param("id") Long id);

    List<Prompt> findTop10ByIsActiveTrueOrderByDisplayCopyCountDesc();

    @Query("SELECT COALESCE(SUM(p.displayCopyCount), 0) FROM Prompt p")
    Long getTotalCopyCount();

    @Query("SELECT COALESCE(SUM(p.realCopyCount), 0) FROM Prompt p")
    Long getTotalRealCopyCount();

    @Query("SELECT COALESCE(SUM(p.displayViewCount), 0) FROM Prompt p")
    Long getTotalViewCount();

    @Query("SELECT COALESCE(SUM(p.realViewCount), 0) FROM Prompt p")
    Long getTotalRealViewCount();

    @Query("SELECT COUNT(p) FROM Prompt p WHERE p.contentType = :contentType")
    Long countByContentType(@Param("contentType") ContentType contentType);

    @Query("SELECT p.aiModel, COALESCE(SUM(p.realCopyCount), 0), COALESCE(SUM(p.realViewCount), 0) " +
           "FROM Prompt p GROUP BY p.aiModel")
    List<Object[]> getModelRealConversionStats();
}
