// src/api/marginApi.ts
import api from "./axios";

/**
 * 플랫폼별 가격 SSE 스트림
 * - EventSource는 axios를 쓰지 않으므로
 * - 이 파일에서는 "URL 생성용"으로만 관여
 */
export const marginStreamUrl = (keyword: string, lang: string) => {
  const params = new URLSearchParams({
    keyword,
    lang,
  });

  return `/api/margin/stream?${params.toString()}`;
};

/**
 * 최종 AI 분석 요청
 */
export const marginApi = {
  finalCompare: (
    keyword: string,
    lang: string,
    platformResults: Record<string, any>
  ) =>
    api.post(
      "/margin/finalCompare",
      platformResults,
      {
        params: { keyword, lang },
      }
    ),
};
