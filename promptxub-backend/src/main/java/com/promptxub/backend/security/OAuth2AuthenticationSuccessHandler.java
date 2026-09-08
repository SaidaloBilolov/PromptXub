package com.promptxub.backend.security;

import com.promptxub.backend.entity.User;
import com.promptxub.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Value("${promptxub.oauth2.default-redirect-url:https://prompt-xub.vercel.app/dashboard}")
    private String defaultRedirectUrl;

    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect.");
            return;
        }

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        Optional<User> userOptional = userRepository.findByEmail(email);

        String username = email;
        Long userId = 1L;
        String roles = "ROLE_USER";

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            username = user.getUsername();
            userId = user.getId();
            roles = user.getRoles().stream()
                    .map(r -> r.getName().name())
                    .collect(Collectors.joining(","));
        }

        String token = tokenProvider.generateTokenForUsername(username, email, userId, roles);

        String targetUrl = UriComponentsBuilder.fromUriString(defaultRedirectUrl)
                .queryParam("token", token)
                .queryParam("username", username)
                .queryParam("email", email)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
