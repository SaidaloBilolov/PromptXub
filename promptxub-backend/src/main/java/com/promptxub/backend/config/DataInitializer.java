package com.promptxub.backend.config;

import com.promptxub.backend.entity.Category;
import com.promptxub.backend.entity.ERole;
import com.promptxub.backend.entity.Role;
import com.promptxub.backend.entity.User;
import com.promptxub.backend.repository.CategoryRepository;
import com.promptxub.backend.repository.RoleRepository;
import com.promptxub.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${promptxub.default-admin.password:Admin@PromptXub2025!}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) {
        initRoles();
        initDefaultAdmin();
        initDefaultCategories();
    }

    private void initRoles() {
        for (ERole eRole : ERole.values()) {
            if (roleRepository.findByName(eRole).isEmpty()) {
                roleRepository.save(Role.builder().name(eRole).build());
                log.info("Initialized role: {}", eRole);
            }
        }
    }

    private void initDefaultAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new IllegalStateException("ROLE_ADMIN not found"));
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new IllegalStateException("ROLE_USER not found"));

            User admin = User.builder()
                    .username("admin")
                    .email("admin@promptxub.com")
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .roles(Set.of(adminRole, userRole))
                    .enabled(true)
                    .build();

            userRepository.save(admin);
            log.info("Default Admin account created: admin / {}", defaultAdminPassword);
        }
    }

    private void initDefaultCategories() {
        List<Category> defaultCategories = List.of(
                Category.builder().name("Photorealistic").slug("photorealistic").description("Lifelike portraits and hyper-realistic captures").icon("Camera").displayOrder(1).build(),
                Category.builder().name("Cinematic").slug("cinematic").description("Moody, atmospheric movie-grade lighting and scenes").icon("Film").displayOrder(2).build(),
                Category.builder().name("Anime & Concept").slug("anime-concept").description("Anime illustrations, fantasy, and concept art").icon("Palette").displayOrder(3).build(),
                Category.builder().name("Architecture").slug("architecture").description("Modern interior designs and futuristic structures").icon("Home").displayOrder(4).build(),
                Category.builder().name("3D & CGI").slug("3d-cgi").description("Isometric renders, surreal 3D models and digital art").icon("Box").displayOrder(5).build(),
                Category.builder().name("AI Video & Motion").slug("ai-video-motion").description("Runway, Luma, Kling motion video prompts").icon("Video").displayOrder(6).build()
        );

        for (Category category : defaultCategories) {
            if (!categoryRepository.existsBySlug(category.getSlug())) {
                categoryRepository.save(category);
                log.info("Initialized category: {}", category.getName());
            }
        }
    }
}
