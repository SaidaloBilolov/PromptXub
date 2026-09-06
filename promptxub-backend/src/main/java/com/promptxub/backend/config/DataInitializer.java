package com.promptxub.backend.config;

import com.promptxub.backend.entity.Category;
import com.promptxub.backend.entity.ContentType;
import com.promptxub.backend.entity.ERole;
import com.promptxub.backend.entity.Prompt;
import com.promptxub.backend.entity.Role;
import com.promptxub.backend.entity.User;
import com.promptxub.backend.repository.CategoryRepository;
import com.promptxub.backend.repository.PromptRepository;
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
    private final PromptRepository promptRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           PromptRepository promptRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.promptRepository = promptRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${promptxub.default-admin.password:Admin@PromptXub2025!}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) {
        try {
            initRoles();
            initDefaultAdmin();
            initDefaultCategories();
            initDefaultPrompts();
        } catch (Exception ex) {
            log.warn("⚠️ Data initialization warning (will retry on next launch or migration): {}", ex.getMessage());
        }
    }

    private void initRoles() {
        for (ERole eRole : ERole.values()) {
            try {
                if (!roleRepository.existsByName(eRole)) {
                    Role role = Role.builder().name(eRole).build();
                    roleRepository.save(role);
                    log.info("Initialized role: {}", eRole);
                }
            } catch (Exception ex) {
                log.warn("Role {} initialization note: {}", eRole, ex.getMessage());
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

    private void initDefaultPrompts() {
        if (promptRepository.count() == 0) {
            Category photorealistic = categoryRepository.findBySlug("photorealistic").orElse(null);
            Category cinematic = categoryRepository.findBySlug("cinematic").orElse(null);
            Category animeConcept = categoryRepository.findBySlug("anime-concept").orElse(null);
            Category architecture = categoryRepository.findBySlug("architecture").orElse(null);
            Category aiVideo = categoryRepository.findBySlug("ai-video-motion").orElse(null);

            User adminAuthor = userRepository.findByUsername("admin").orElse(null);

            List<Prompt> defaultPrompts = List.of(
                    Prompt.builder()
                            .title("Samurai Mecha Warrior in Shinjuku")
                            .promptText("Massive Japanese mecha samurai kneeling amidst glowing neon holographic billboards in future Tokyo, detailed worn battle armor with katana drawn, sparks flying from damaged shoulder plating, dramatic anamorphic lens flare, photorealistic cgi render --ar 4:5")
                            .negativePrompt("flat colors, low detail, blurry")
                            .aiModel("Midjourney v6")
                            .contentType(ContentType.PHOTO)
                            .mediaUrl("https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop")
                            .aspectRatio("4:5")
                            .displayCopyCount(3120L)
                            .displayViewCount(14500L)
                            .realCopyCount(0L)
                            .realViewCount(0L)
                            .isFeatured(true)
                            .isActive(true)
                            .category(animeConcept)
                            .author(adminAuthor)
                            .build(),
                    Prompt.builder()
                            .title("Liquid Gold Cheetah Fluid Motion")
                            .promptText("A majestic cheetah made of liquid chrome and molten gold sprinting at lightning speed across obsidian desert dunes, high-speed fluid dynamics, slow-motion particle spray, camera tracking forward, hyper-realistic physics, cinematic lighting, 60fps")
                            .negativePrompt("choppy, static, low framerate, artifacts, glitch")
                            .aiModel("Runway Gen-3")
                            .contentType(ContentType.VIDEO)
                            .mediaUrl("https://res.cloudinary.com/demo/video/upload/q_auto/cld_sample_video.mp4")
                            .aspectRatio("16:9")
                            .displayCopyCount(2310L)
                            .displayViewCount(11400L)
                            .realCopyCount(0L)
                            .realViewCount(0L)
                            .isFeatured(true)
                            .isActive(true)
                            .category(aiVideo)
                            .author(adminAuthor)
                            .build(),
                    Prompt.builder()
                            .title("Cyberpunk Geisha in Neon Rain")
                            .promptText("Cyberpunk geisha portrait standing under torrential acid rain, vibrant neon signs reflecting in puddles, translucent holographic umbrella, intricate mechanical kimono with glowing fiber optics, hyperdetailed skin texture, volumetric smoke, cinematic 8k, photorealistic --ar 16:9 --v 6.0 --style raw")
                            .negativePrompt("blurry, low quality, deformed hands, extra fingers, cartoon, 3d render")
                            .aiModel("Midjourney v6")
                            .contentType(ContentType.PHOTO)
                            .mediaUrl("https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop")
                            .aspectRatio("16:9")
                            .displayCopyCount(1420L)
                            .displayViewCount(6850L)
                            .realCopyCount(0L)
                            .realViewCount(0L)
                            .isFeatured(true)
                            .isActive(true)
                            .category(photorealistic)
                            .author(adminAuthor)
                            .build(),
                    Prompt.builder()
                            .title("Futuristic Solarpunk Floating City")
                            .promptText("Sweeping aerial cinematic shot of an utopian solarpunk city floating in emerald clouds, waterfalls cascading into the abyss, lush vertical gardens wrapping around curved glass skyscrapers, drone camera swooping between bridges, soft morning sunrise glow")
                            .negativePrompt("dark, dystopian, noisy, jittery motion")
                            .aiModel("Luma Dream Machine")
                            .contentType(ContentType.VIDEO)
                            .mediaUrl("https://res.cloudinary.com/demo/video/upload/q_auto/cld_sample_video.mp4")
                            .aspectRatio("16:9")
                            .displayCopyCount(1890L)
                            .displayViewCount(8900L)
                            .realCopyCount(0L)
                            .realViewCount(0L)
                            .isFeatured(true)
                            .isActive(true)
                            .category(aiVideo)
                            .author(adminAuthor)
                            .build(),
                    Prompt.builder()
                            .title("Ethereal Forest Solitary Explorer")
                            .promptText("A solitary astronaut walking through a bioluminescent alien forest, giant towering crystalline trees emitting soft cyan and ultraviolet light, atmospheric mist, dust motes floating in light rays, Kodak Portra 800 tone, shallow depth of field --ar 9:16 --v 6.0")
                            .negativePrompt("oversaturated, plastic, anime, amateurish")
                            .aiModel("Flux.1")
                            .contentType(ContentType.PHOTO)
                            .mediaUrl("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop")
                            .aspectRatio("9:16")
                            .displayCopyCount(980L)
                            .displayViewCount(4200L)
                            .realCopyCount(0L)
                            .realViewCount(0L)
                            .isFeatured(true)
                            .isActive(true)
                            .category(cinematic)
                            .author(adminAuthor)
                            .build(),
                    Prompt.builder()
                            .title("Minimalist Brutalist Concrete Sanctuary")
                            .promptText("Modern architectural interior of a minimalist brutalist villa overlooking the ocean, raw textured concrete walls, light beams cutting through ceiling skylight, monolithic black marble pool, warm beige linen furniture, architectural digest photography --ar 16:9")
                            .negativePrompt("cluttered, dirty, oversaturated, unrealistic")
                            .aiModel("Flux.1")
                            .contentType(ContentType.PHOTO)
                            .mediaUrl("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop")
                            .aspectRatio("16:9")
                            .displayCopyCount(840L)
                            .displayViewCount(3900L)
                            .realCopyCount(0L)
                            .realViewCount(0L)
                            .isFeatured(false)
                            .isActive(true)
                            .category(architecture)
                            .author(adminAuthor)
                            .build()
            );

            promptRepository.saveAll(defaultPrompts);
            log.info("Initialized {} default prompts into database.", defaultPrompts.size());
        }
    }
}
