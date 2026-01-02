// src/types/adminTypes.ts

/**
 * 사용자 역할
 */
export type UserRole = "ROLE_USER" | "ROLE_ADMIN";

/**
 * 가입 방식
 */
export type Provider = "local" | "google";

/**
 * 사용자 정보 (목록용)
 */
export interface UserListItem {
  id: number;
  email: string;
  name: string | null;
  provider: Provider;
  role: UserRole;
  createdAt: string;  // ISO 8601 format
}

/**
 * 페이징 처리된 사용자 목록 응답
 */
export interface UserListPageResponse {
  content: UserListItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * 사용자 통계
 */
export interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
  localUsers: number;
  oauthUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

/**
 * 권한 변경 요청 (확장용으로 남겨둠)
 */
export interface RoleUpdateRequest {
  userId: number;
  newRole: UserRole;
}

/**
 * 비밀번호 변경 요청
 */
export interface PasswordChangeRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
}