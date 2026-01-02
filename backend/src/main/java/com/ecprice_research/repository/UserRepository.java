package com.ecprice_research.repository;

import com.ecprice_research.entity.Role;
import com.ecprice_research.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByOauthId(String oauthId);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // ========================================
    // 어드민 - 통계용 쿼리 메서드
    // ========================================

    /**
     * 권한별 사용자 수 조회
     */
    long countByRole(Role role);

    /**
     * 가입 방식별 사용자 수 조회
     */
    long countByProvider(String provider);

    /**
     * 특정 날짜 이후 가입한 사용자 수 조회
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate")
    long countUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);
}