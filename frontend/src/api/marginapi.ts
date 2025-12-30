// src/api/marginApi.ts
import api from "./axios";
import { getToken } from "./axios";

/**
 * 플랫폼별 가격 SSE 스트림
 */
export const marginStreamUrl = (keyword: string, lang: string) => {
  const token = getToken();

  const params = new URLSearchParams({
    keyword,
    lang,
  });

  if (token) {
    params.append("token", token);
  }

const baseURL = import.meta.env?.VITE_API_URL || "http://localhost:8080/api";
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