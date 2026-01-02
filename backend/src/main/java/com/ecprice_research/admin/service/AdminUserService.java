package com.ecprice_research.admin.service;


import com.ecprice_research.auth.dto.UserListResponse;
import com.ecprice_research.auth.dto.UserStatsResponse;
import com.ecprice_research.entity.Role;
import com.ecprice_research.entity.User;
import com.ecprice_research.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 전체 사용자 목록 조회 (DTO 변환)
     */
    public List<UserListResponse> findAllUsers() {
        return userRepository.findAll().stream()
                .map(UserListResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 페이징 처리된 사용자 목록 조회
     */
    public Page<UserListResponse> findAllUsersWithPaging(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(UserListResponse::from);
    }

    /**
     * 사용자 통계 조회
     */
    public UserStatsResponse getUserStats() {
        // 전체 사용자 수
        long totalUsers = userRepository.count();

        // 권한별
        long totalAdmins = userRepository.countByRole(Role.ROLE_ADMIN);
        long totalRegularUsers = userRepository.countByRole(Role.ROLE_USER);

        // 가입 방식별
        long localUsers = userRepository.countByProvider("local");
        long oauthUsers = userRepository.countByProvider("google");

        // 최근 가입자 (오늘, 이번주, 이번달)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.minusWeeks(1);
        LocalDateTime startOfMonth = now.minusMonths(1);

        long newUsersToday = userRepository.countUsersCreatedAfter(startOfToday);
        long newUsersThisWeek = userRepository.countUsersCreatedAfter(startOfWeek);
        long newUsersThisMonth = userRepository.countUsersCreatedAfter(startOfMonth);

        return UserStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalAdmins(totalAdmins)
                .totalRegularUsers(totalRegularUsers)
                .localUsers(localUsers)
                .oauthUsers(oauthUsers)
                .newUsersToday(newUsersToday)
                .newUsersThisWeek(newUsersThisWeek)
                .newUsersThisMonth(newUsersThisMonth)
                .build();
    }

    /**
     * 사용자 권한 변경
     */
    @Transactional
    public UserListResponse updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        return UserListResponse.from(updatedUser);
    }

    /**
     * 사용자 삭제
     */
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId);
        }

        userRepository.deleteById(userId);
    }

    /**
     * 사용자 ID로 조회
     */
    public UserListResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        return UserListResponse.from(user);
    }

    /**
     * 비밀번호 변경
     */
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        // OAuth 사용자는 비밀번호 변경 불가
        if (!"local".equals(user.getProvider())) {
            throw new IllegalStateException("OAuth 사용자는 비밀번호를 변경할 수 없습니다.");
        }

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호로 변경
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}