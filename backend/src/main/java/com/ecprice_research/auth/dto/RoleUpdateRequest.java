package com.ecprice_research.auth.dto;

import com.ecprice_research.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 어드민 - 사용자 권한 변경 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoleUpdateRequest {

    @NotNull(message = "사용자 ID는 필수입니다.")
    private Long userId;

    @NotNull(message = "새로운 권한은 필수입니다.")
    private Role newRole;
}