package com.promptxub.backend.security;

import com.promptxub.backend.entity.ERole;
import com.promptxub.backend.entity.Role;
import com.promptxub.backend.entity.User;
import com.promptxub.backend.repository.RoleRepository;
import com.promptxub.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger log = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomOAuth2UserService(UserRepository userRepository,
                                  RoleRepository roleRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        try {
            return processOAuth2User(oAuth2User);
        } catch (Exception ex) {
            log.error("Error processing OAuth2 user", ex);
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String googleId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email not found from Google OAuth2 provider");
        }

        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    existingUser.setGoogleId(googleId);
                    if (picture != null && !picture.isBlank()) {
                        existingUser.setAvatarUrl(picture);
                    }
                    existingUser.setProvider("Google");
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> createNewGoogleUser(googleId, email, name, picture));

        return oAuth2User;
    }

    private User createNewGoogleUser(String googleId, String email, String name, String picture) {
        String baseUsername = (email != null && email.contains("@")) ? email.split("@")[0] : "user";
        String username = baseUsername;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter++;
        }

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(ERole.ROLE_USER).build()));

        User newUser = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .provider("Google")
                .avatarUrl(picture)
                .enabled(true)
                .roles(Collections.singleton(userRole))
                .build();

        newUser.setGoogleId(googleId);
        return userRepository.save(newUser);
    }
}
