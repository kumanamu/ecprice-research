// src/utils/convert.ts

export function formatKrw(value: number | null | undefined): string {
  if (value == null) return "-";
  return value.toLocaleString("ko-KR") + "원";
}

export function formatJpy(value: number | null | undefined): string {
  if (value == null) return "-";
  return "¥" + value.toLocaleString("ja-JP");
}

export function safeNumber(value: unknown): number {
  if (value == null) return 0;

  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

export function safeText(value: unknown): string {
  if (value == null || value === "") return "-";
  return String(value);
}
