package com.ecprice_research.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 어드민 - 사용자 통계 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {

    // 전체 통계
    private Long totalUsers;
    private Long totalAdmins;
    private Long totalRegularUsers;

    // 가입 방식별
    private Long localUsers;
    private Long oauthUsers;

    // 최근 가입
    private Long newUsersToday;
    private Long newUsersThisWeek;
    private Long newUsersThisMonth;
}