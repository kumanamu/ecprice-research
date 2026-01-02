package com.ecprice_research.auth.dto;

import com.ecprice_research.entity.Role;
import com.ecprice_research.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 어드민 - 사용자 목록 응답 DTO
 * 비밀번호 제외, 프론트엔드 친화적 구조
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserListResponse {

    private Long id;
    private String email;
    private String name;
    private String provider;  // "local" or "google"
    private Role role;
    private LocalDateTime createdAt;

    /**
     * User 엔티티 → DTO 변환
     */
    public static UserListResponse from(User user) {
        return UserListResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .provider(user.getProvider())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}