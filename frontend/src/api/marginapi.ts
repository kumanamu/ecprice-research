// src/api/marginapi.ts

import axios from "axios";   // 🔥 빠져서 오류났던 부분
import type { MarginResponse } from "../types/marginTypes";

const BASE_URL = "http://localhost:8080/api/margin";

export async function getMarginResult(keyword: string, lang: "ko" | "jp") {
  try {
    const res = await axios.get<MarginResponse>(BASE_URL, {
      params: { keyword, lang }
    });

    return res.data;
  } catch (err) {
    console.error("❌ API 오류:", err);
    throw err;
  }
}
