// src/utils/t.ts

type Lang = "ko" | "jp";

type TranslationKey =
  // 공통
  | "home"
  | "report"
  | "search"
  | "searchPlaceholder"
  | "korean"
  | "japanese"
  | "basic"
  | "premium"

  // 검색/로딩
  | "enterKeyword"
  | "searchFailed"
  | "loadingStep1"
  | "loadingStep2"
  | "loadingStep3"

  // 리포트
  | "platformPrice"
  | "summary"
  | "platform"
  | "profitKrw"
  | "profitJpy"
  | "keyMetrics"
  | "bestPlatform"
  | "expectedProfitKrw"
  | "expectedProfitJpy"

  // AI
  | "aiBasicAnalysis"
  | "aiPremiumAnalysis"
  | "aiAnalyzing"

  // 기타
  | "noImage"
  | "noResults"
  | "noReportSaved"
  | "view"
  | "won"
  | "yen";

const translations: Record<TranslationKey, Record<Lang, string>> = {
  // 공통
  home: { ko: "홈", jp: "ホーム" },
  report: { ko: "리포트", jp: "レポート" },
  search: { ko: "검색", jp: "検索" },
  searchPlaceholder: { ko: "검색어 입력", jp: "検索ワード入力" },
  korean: { ko: "🇰🇷 한국어", jp: "🇰🇷 韓国語" },
  japanese: { ko: "🇯🇵 일본어", jp: "🇯🇵 日本語" },
  basic: { ko: "📘 기본 분석", jp: "📘 基本分析" },
  premium: { ko: "✨ 프리미엄", jp: "✨ プレミアム" },

  // 검색/로딩
  enterKeyword: { ko: "검색어를 입력하세요.", jp: "検索ワードを入力してください。" },
  searchFailed: { ko: "검색 실패!", jp: "検索失敗！" },
  loadingStep1: { ko: "🔍 초기 요청 중...", jp: "🔍 初期リクエスト中..." },
  loadingStep2: { ko: "📦 가격 데이터 준비 중...", jp: "📦 価格データ準備中..." },
  loadingStep3: { ko: "🤖 AI 분석 준비 중...", jp: "🤖 AI分析準備中..." },

  // 리포트
  platformPrice: { ko: "플랫폼별 가격", jp: "プラットフォーム別価格" },
  summary: { ko: "핵심 요약", jp: "主要サマリー" },
  platform: { ko: "플랫폼", jp: "プラットフォーム" },
  profitKrw: { ko: "수익(KRW)", jp: "利益(KRW)" },
  profitJpy: { ko: "수익(JPY)", jp: "利益(JPY)" },
  keyMetrics: { ko: "핵심 지표", jp: "主要指標" },
  bestPlatform: { ko: "최적 플랫폼", jp: "最適プラットフォーム" },
  expectedProfitKrw: { ko: "예상 이익 (KRW)", jp: "予想利益 (KRW)" },
  expectedProfitJpy: { ko: "예상 이익 (JPY)", jp: "予想利益 (JPY)" },

  // AI
  aiBasicAnalysis: { ko: "AI 기본 분석 요약", jp: "AI基本分析サマリー" },
  aiPremiumAnalysis: { ko: "AI 프리미엄 심층 분석", jp: "AIプレミアム詳細分析" },
  aiAnalyzing: { ko: "AI 분석 준비중...", jp: "AI分析準備中..." },

  // 기타
  noImage: { ko: "이미지 없음", jp: "画像なし" },
  noResults: { ko: "검색 결과 없음", jp: "検索結果なし" },
  noReportSaved: { ko: "아직 저장된 리포트 없음", jp: "まだ保存されたレポートなし" },
  view: { ko: "보기", jp: "見る" },
  won: { ko: "원", jp: "ウォン" },
  yen: { ko: "엔", jp: "円" },
};

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? key;
}