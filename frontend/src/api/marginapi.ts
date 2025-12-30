// src/api/marginApi.ts
import api from "./axios";
import { getToken } from "./axios";  // ✅ 추가

/**
 * 플랫폼별 가격 SSE 스트림
 * - EventSource는 axios를 쓰지 않으므로
 * - 이 파일에서는 "URL 생성용"으로만 관여
 */
export const marginStreamUrl = (keyword: string, lang: string) => {
  const token = getToken();  // ✅ 토큰 가져오기

  const params = new URLSearchParams({
    keyword,
    lang,
  });

  // ✅ 토큰이 있으면 파라미터에 추가
  if (token) {
    params.append("token", token);
  }

  // ✅ 절대 URL 생성 (백엔드 서버로 직접!)
  const baseURL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api";
  return `${baseURL}/margin/stream?${params.toString()}`;
};

/**
 * 최종 AI 분석 요청
 */
export const marginApi = {
  finalCompare: (
    keyword: string,
    lang: string,
    platformResults: Record<string, unknown>
  ) =>
    api.post(
      "/margin/finalCompare",
      platformResults,
      {
        params: { keyword, lang },
      }
    ),
};