package com.ecprice_research.admin.controller;


import com.ecprice_research.admin.service.AdminUserService;
import com.ecprice_research.auth.dto.PasswordChangeRequest;
import com.ecprice_research.auth.dto.RoleUpdateRequest;
import com.ecprice_research.auth.dto.UserListResponse;
import com.ecprice_research.auth.dto.UserStatsResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    /**
     * 전체 사용자 목록 조회 (페이징)
     * GET /api/admin/users?page=0&size=20&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<UserListResponse>> getAllUsers(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        Page<UserListResponse> users = adminUserService.findAllUsersWithPaging(pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * 전체 사용자 목록 조회 (페이징 없음)
     * GET /api/admin/users/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<UserListResponse>> getAllUsersWithoutPaging() {
        List<UserListResponse> users = adminUserService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * 사용자 통계 조회
     * GET /api/admin/users/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        UserStatsResponse stats = adminUserService.getUserStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * 사용자 권한 변경
     * PUT /api/admin/users/role
     */
    @PutMapping("/role")
    public ResponseEntity<UserListResponse> updateUserRole(
            @Valid @RequestBody RoleUpdateRequest request
    ) {
        UserListResponse updatedUser = adminUserService.updateUserRole(
                request.getUserId(),
                request.getNewRole()
        );
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * 사용자 삭제
     * DELETE /api/admin/users/{userId}
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminUserService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 사용자 상세 조회
     * GET /api/admin/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserListResponse> getUserById(@PathVariable Long userId) {
        UserListResponse user = adminUserService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    /**
     * 비밀번호 변경
     * PUT /api/admin/users/password
     */
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        adminUserService.changePassword(
                request.getUserId(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        return ResponseEntity.ok().build();
    }
}