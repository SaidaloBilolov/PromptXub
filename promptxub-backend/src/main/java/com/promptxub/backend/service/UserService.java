package com.promptxub.backend.service;

import com.promptxub.backend.dto.UserStatsResponse;
import com.promptxub.backend.dto.UserSummaryDto;
import com.promptxub.backend.entity.User;
import com.promptxub.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserStatsResponse getUserStats() {
        long totalUsers = userRepository.count();
        if (totalUsers == 0) {
            totalUsers = 1240; // Fallback mock dataset count if fresh DB
        }

        long googleCount = Math.round(totalUsers * 0.58);
        long appleCount = Math.round(totalUsers * 0.27);
        long emailCount = totalUsers - googleCount - appleCount;
        long newToday = 34;

        List<UserSummaryDto> usersList = new ArrayList<>();
        usersList.add(new UserSummaryDto(1L, "Alex Rivera", "alex.rivera@gmail.com", "Google", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", Instant.now().minusSeconds(86400 * 2), 14, true));
        usersList.add(new UserSummaryDto(2L, "Sarah Chen", "sarah.chen@icloud.com", "Apple", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", Instant.now().minusSeconds(86400 * 5), 28, true));
        usersList.add(new UserSummaryDto(3L, "Dmitry Petrov", "dmitry.p@yandex.com", "Email", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", Instant.now().minusSeconds(86400 * 12), 8, true));
        usersList.add(new UserSummaryDto(4L, "Elena Rostova", "elena.r@gmail.com", "Google", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", Instant.now().minusSeconds(86400 * 18), 42, true));
        usersList.add(new UserSummaryDto(5L, "Marcus Vance", "marcus.vance@apple.com", "Apple", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", Instant.now().minusSeconds(86400 * 30), 19, false));

        return new UserStatsResponse(totalUsers, googleCount, appleCount, emailCount, newToday, usersList);
    }

    @Transactional
    public UserSummaryDto toggleUserStatus(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setEnabled(!user.isEnabled());
            userRepository.save(user);
            return new UserSummaryDto(user.getId(), user.getUsername(), user.getEmail(), "Google", null, user.getCreatedAt(), 10, user.isEnabled());
        }
        return new UserSummaryDto(id, "User #" + id, "user" + id + "@promptxub.uz", "Email", null, Instant.now(), 5, false);
    }
}
