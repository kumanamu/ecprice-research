// src/utils/convert.ts

export function formatKrw(value: number | null | undefined): string {
  if (value == null) return "-";
  return value.toLocaleString("ko-KR") + "원";
}

export function formatJpy(value: number | null | undefined): string {
  if (value == null) return "-";
  return "¥" + value.toLocaleString("ja-JP");
}

export function safeNumber(value: any): number {
  if (value == null || isNaN(value)) return 0;
  return Number(value);
}

export function safeText(value: any): string {
  if (value == null || value === "") return "-";
  return String(value);
}
