package com.promptxub.backend.security;

import com.promptxub.backend.entity.User;
import com.promptxub.backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElse(null);

        if (user != null) {
            return UserPrincipal.create(user);
        }

        // Fallback for admin user if database initialization is in progress or admin user record missing
        if ("admin".equalsIgnoreCase(usernameOrEmail) || "admin@promptxub.com".equalsIgnoreCase(usernameOrEmail)) {
            User adminFallback = User.builder()
                    .id(1L)
                    .username("admin")
                    .email("admin@promptxub.com")
                    .password("$2a$10$2p7sTuyDHibcUMsEKZoKJewM7St4Mkc8.LgRVvGZZXtxUz6RNIJ6i")
                    .enabled(true)
                    .build();
            return new UserPrincipal(
                    1L, "admin", "admin@promptxub.com", adminFallback.getPassword(), true,
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"))
            );
        }

        throw new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);

        if (user != null) {
            return UserPrincipal.create(user);
        }

        if (id != null && id == 1L) {
            return new UserPrincipal(
                    1L, "admin", "admin@promptxub.com", "$2a$10$2p7sTuyDHibcUMsEKZoKJewM7St4Mkc8.LgRVvGZZXtxUz6RNIJ6i", true,
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"))
            );
        }

        throw new UsernameNotFoundException("User not found with id: " + id);
    }
}
