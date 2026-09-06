package com.promptxub.backend.service;

import com.promptxub.backend.dto.UserStatsResponse;
import com.promptxub.backend.dto.UserSummaryDto;
import com.promptxub.backend.entity.User;
import com.promptxub.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserSummaryDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserSummaryDto> list = new ArrayList<>();
        for (User user : users) {
            list.add(mapToDto(user));
        }
        return list;
    }

    public UserStatsResponse getUserStats() {
        long totalUsers = userRepository.count();
        long googleCount = userRepository.countByProviderIgnoreCase("google");
        long appleCount = userRepository.countByProviderIgnoreCase("apple");
        long emailCount = userRepository.countByProviderIgnoreCase("email");

        if (googleCount + appleCount + emailCount < totalUsers) {
            emailCount = totalUsers - googleCount - appleCount;
        }

        Instant startOfDay = LocalDate.now(ZoneId.of("UTC")).atStartOfDay(ZoneId.of("UTC")).toInstant();
        long newToday = userRepository.countByCreatedAtGreaterThanEqual(startOfDay);

        List<UserSummaryDto> usersList = getAllUsers();

        return new UserStatsResponse(totalUsers, googleCount, appleCount, emailCount, newToday, usersList);
    }

    @Transactional
    public UserSummaryDto toggleUserStatus(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setEnabled(!user.isEnabled());
            user = userRepository.save(user);
            return mapToDto(user);
        }
        return new UserSummaryDto(id, "User #" + id, "user" + id + "@promptxub.uz", "Email", null, Instant.now(), 0, false);
    }

    private UserSummaryDto mapToDto(User user) {
        String avatar = user.getAvatarUrl();
        if (avatar == null || avatar.isBlank()) {
            avatar = "https://ui-avatars.com/api/?name=" + user.getUsername() + "&background=6366f1&color=fff";
        }
        String provider = user.getProvider();
        if (provider == null || provider.isBlank()) {
            provider = "Email";
        } else {
            provider = provider.substring(0, 1).toUpperCase() + provider.substring(1).toLowerCase();
        }

        Instant joinedDate = user.getCreatedAt();
        if (joinedDate == null) {
            joinedDate = Instant.now();
        }

        return new UserSummaryDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                provider,
                avatar,
                joinedDate,
                5,
                user.isEnabled()
        );
    }
}
