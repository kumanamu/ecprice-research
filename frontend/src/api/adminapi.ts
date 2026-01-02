// src/api/adminApi.ts
import api from "./axios";
import type {
  UserListItem,
  UserListPageResponse,
  UserStats,
  RoleUpdateRequest,
  PasswordChangeRequest,
} from "../types/Admintypes";

/**
 * 어드민 API
 */
export const adminApi = {
  /**
   * 사용자 목록 조회 (페이징)
   * @param page 페이지 번호 (0부터 시작)
   * @param size 페이지 크기
   * @param sort 정렬 (예: "createdAt,desc")
   */
  getUserList: (page = 0, size = 20, sort = "createdAt,desc") =>
    api.get<UserListPageResponse>("/admin/users", {
      params: { page, size, sort },
    }),

  /**
   * 전체 사용자 목록 조회 (페이징 없음)
   */
  getAllUsers: () =>
    api.get<UserListItem[]>("/admin/users/all"),

  /**
   * 사용자 통계 조회
   */
  getStats: () =>
    api.get<UserStats>("/admin/users/stats"),

  /**
   * 사용자 상세 조회
   */
  getUserById: (userId: number) =>
    api.get<UserListItem>(`/admin/users/${userId}`),

  /**
   * 사용자 권한 변경
   */
  updateRole: (data: RoleUpdateRequest) =>
    api.put<UserListItem>("/admin/users/role", data),

  /**
   * 사용자 삭제
   */
  deleteUser: (userId: number) =>
    api.delete(`/admin/users/${userId}`),

  /**
   * 비밀번호 변경
   */
  changePassword: (data: PasswordChangeRequest) =>
    api.put("/admin/users/password", data),
};