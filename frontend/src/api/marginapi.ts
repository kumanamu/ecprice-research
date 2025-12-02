import axios from "axios";
import type { MarginResponse } from "../types/marginTypes";

const BASE_URL = "http://localhost:8080/api";

export async function getMarginResult(keyword: string, lang: "ko" | "jp") {
  const res = await axios.get<MarginResponse>(`${BASE_URL}/margin`, {
    params: { keyword, lang }
  });
  return res.data;
}
