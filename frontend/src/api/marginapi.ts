// src/api/marginapi.ts

import api from "./api";

/** 🔥 병렬 플랫폼 API들 - (추가 코드) */
export const fetchAmazon = (keyword: string, lang: string) =>
  api.get("/margin/amazon", { params: { keyword, lang } });

export const fetchRakuten = (keyword: string, lang: string) =>
  api.get("/margin/rakuten", { params: { keyword, lang } });

export const fetchNaver = (keyword: string, lang: string) =>
  api.get("/margin/naver", { params: { keyword, lang } });

export const fetchCoupang = (keyword: string, lang: string) =>
  api.get("/margin/coupang", { params: { keyword, lang } });

/** 🔥 통합 compare API */
export const fetchCompare = (keyword: string, lang: string) =>
  api.get("/margin", { params: { keyword, lang } });
