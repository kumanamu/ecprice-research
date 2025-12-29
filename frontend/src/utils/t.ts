// src/utils/t.ts
export type Lang = "ko" | "jp";

export type TranslationKey =
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
  | "aiAnalyzing"

  // 인증
  | "login"
  | "signup"
  | "logout"
  | "loginTitle"
  | "signupTitle"
  | "email"
  | "password"
  | "or"
  | "loginLoading"
  | "signupLoading"
  | "backToLogin"

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

  // 기타
  | "noImage"
  | "noResults"
  | "noReportSaved"
  | "view"
  | "won"
  | "yen";

const translations: Record<TranslationKey, Record<Lang, string>> = {
  home: { ko: "홈", jp: "ホーム" },
  report: { ko: "리포트", jp: "レポート" },
  search: { ko: "검색", jp: "検索" },
  searchPlaceholder: { ko: "검색어 입력", jp: "検索ワード入力" },
  korean: { ko: "한국어", jp: "韓国語" },
  japanese: { ko: "일본어", jp: "日本語" },
  basic: { ko: "기본 분석", jp: "基本分析" },
  premium: { ko: "프리미엄", jp: "プレミアム" },

  enterKeyword: { ko: "검색어를 입력하세요.", jp: "検索ワードを入力してください。" },
  searchFailed: { ko: "검색 실패", jp: "検索失敗" },
  loadingStep1: { ko: "초기 요청 중...", jp: "初期リクエスト中..." },
  loadingStep2: { ko: "가격 수집 중...", jp: "価格取得中..." },
  loadingStep3: { ko: "AI 분석 준비 중...", jp: "AI分析準備中..." },
  aiAnalyzing: { ko: "분석 중...", jp: "分析中..." },

  login: { ko: "로그인", jp: "ログイン" },
  signup: { ko: "회원가입", jp: "会員登録" },
  logout: { ko: "로그아웃", jp: "ログアウト" },
  loginTitle: { ko: "로그인", jp: "ログイン" },
  signupTitle: { ko: "회원가입", jp: "会員登録" },
  email: { ko: "이메일", jp: "メールアドレス" },
  password: { ko: "비밀번호", jp: "パスワード" },
  or: { ko: "또는", jp: "または" },
  loginLoading: { ko: "로그인 중...", jp: "ログイン中..." },
  signupLoading: { ko: "가입 중...", jp: "登録中..." },
  backToLogin: { ko: "로그인으로 돌아가기", jp: "ログインに戻る" },

  platformPrice: { ko: "플랫폼별 가격", jp: "プラットフォーム別価格" },
  summary: { ko: "요약", jp: "サマリー" },
  platform: { ko: "플랫폼", jp: "プラットフォーム" },
  profitKrw: { ko: "수익(KRW)", jp: "利益(KRW)" },
  profitJpy: { ko: "수익(JPY)", jp: "利益(JPY)" },
  keyMetrics: { ko: "핵심 지표", jp: "主要指標" },
  bestPlatform: { ko: "최적 플랫폼", jp: "最適プラットフォーム" },
  expectedProfitKrw: { ko: "예상 수익(KRW)", jp: "予想利益(KRW)" },
  expectedProfitJpy: { ko: "예상 수익(JPY)", jp: "予想利益(JPY)" },

  noImage: { ko: "이미지 없음", jp: "画像なし" },
  noResults: { ko: "결과 없음", jp: "結果なし" },
  noReportSaved: { ko: "저장된 리포트 없음", jp: "保存されたレポートなし" },
  view: { ko: "보기", jp: "見る" },
  won: { ko: "원", jp: "ウォン" },
  yen: { ko: "엔", jp: "円" },
};

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? key;
}

// ✅ 플랫폼명 번역 (추가)
const platformNames: Record<string, Record<Lang, string>> = {
  NAVER: { ko: "네이버", jp: "ネイバー" },
  naver: { ko: "네이버", jp: "ネイバー" },
  COUPANG: { ko: "쿠팡", jp: "クーパン" },
  coupang: { ko: "쿠팡", jp: "クーパン" },
  amazon: { ko: "아마존", jp: "アマゾン" },
  AMAZON: { ko: "아마존", jp: "アマゾン" },
  rakuten: { ko: "라쿠텐", jp: "楽天" },
  RAKUTEN: { ko: "라쿠텐", jp: "楽天" },
};

export function translatePlatform(platform: string, lang: Lang): string {
  return platformNames[platform]?.[lang] ?? platform;
}

// ✅ 가격 표시 규칙 (추가)
export function formatPrice(
  priceKrw: number | null,
  priceJpy: number | null,
  country: string, // "KR" | "JP"
  lang: Lang
): { main: string; sub?: string } {
  if (lang === "ko") {
    // 한국어 모드: 원화 기준
    if (priceKrw !== null) {
      const main = `${priceKrw.toLocaleString()} 원`;
      const sub = country === "JP" && priceJpy !== null
        ? `${priceJpy.toLocaleString()} 엔`
        : undefined;
      return { main, sub };
    }
  } else {
    // 일본어 모드: 엔화 기준
    if (priceJpy !== null) {
      const main = `${priceJpy.toLocaleString()} 円`;
      const sub = country === "KR" && priceKrw !== null
        ? `${priceKrw.toLocaleString()} ウォン`
        : undefined;
      return { main, sub };
    }
  }
  return { main: "-" };
}