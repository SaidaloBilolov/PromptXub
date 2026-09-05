package com.promptxub.backend.repository;

import com.promptxub.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);

    Boolean existsBySlug(String slug);

    Boolean existsByName(String name);

    List<Category> findAllByOrderByDisplayOrderAsc();
}
