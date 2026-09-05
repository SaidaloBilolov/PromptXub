package com.promptxub.backend.repository;

import com.promptxub.backend.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findBySlug(String slug);

    Optional<Tag> findByName(String name);

    List<Tag> findByNameIn(Collection<String> names);

    List<Tag> findBySlugIn(Collection<String> slugs);

    Boolean existsBySlug(String slug);
}
