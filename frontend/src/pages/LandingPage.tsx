import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign } from 'lucide-react';
import { useLang } from '../context/LangContext';

const LandingPage = () => {
  const { lang } = useLang();

  const [stats, setStats] = useState({
    todayAnalysis: 0,
    avgMarginRate: 0
  });

  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const animateCount = (target: number, setter: (val: number) => void, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    };

    animateCount(1247, (val) => setStats(prev => ({ ...prev, todayAnalysis: val })));

    const marginTimer = setInterval(() => {
      setStats(prev => {
        if (prev.avgMarginRate < 23.5) {
          return { ...prev, avgMarginRate: +(prev.avgMarginRate + 0.1).toFixed(1) };
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(marginTimer);
  }, []);

  // 다국어 텍스트
  const text = {
    ko: {
      title1: '한일',
      title2: '가격비교',
      title3: '수출입 이익 판단 툴',
      subtitle: '4개 플랫폼을 동시 비교하여 AI가 최적의 수익 구조를 제안합니다',
      searchPlaceholder: '상품명을 입력하여 분석 시작...',
      popularLabel: '인기:',
      popularKeywords: ['다이슨 에어랩', 'Apple Watch Ultra', '샤넬 가방'],
      todayAnalysis: '오늘의 분석 수',
      avgMargin: '평균 마진율',
      startButton: '무료로 시작하기',
      exampleTitle: '💡 실제 분석 예시',
      exampleSubtitle: '원클릭으로 4개 플랫폼 동시 비교',
      step1Title: '1. 상품 검색',
      step1Desc: '키워드 입력만으로 4개 사이트 일괄 검색',
      step2Title: '2. 가격 비교',
      step2Desc: '환율 자동 계산으로 한눈에 비교 가능',
      step3Title: '3. AI 분석',
      step3Desc: '이익률 계산 후 AI가 최적 전략 제안',
      feature1Title: '4개 사이트 동시 검색',
      feature1Desc: '쿠팡, 네이버, Amazon.jp, 라쿠텐을 한번에 검색',
      feature2Title: '자동 환율 계산',
      feature2Desc: '실시간 환율로 정확한 가격 비교',
      feature3Title: 'AI 이익 분석',
      feature3Desc: '마진율 계산 후 최적 판매 전략 제안',
      feature4Title: '한일 번역 지원',
      feature4Desc: '분석 결과를 한국어·일본어로 확인 가능',
      platformsLabel: '지원 플랫폼',
      ctaTitle: '지금 바로 시작하세요',
      ctaSubtitle: '무료 계정을 만들어 국경을 넘는 가격 분석을 경험하세요',
      ctaButton: '계정 만들기'
    },
    jp: {
      title1: '韓日',
      title2: '価格比較',
      title3: '輸出入利益判断ツール',
      subtitle: '4つのプラットフォームを同時比較し、AIが最適な収益構造を提案します',
      searchPlaceholder: '商品名を入力して分析を開始...',
      popularLabel: '人気:',
      popularKeywords: ['ダイソンエアラップ', 'Apple Watch Ultra', 'シャネル バッグ'],
      todayAnalysis: '今日の分析数',
      avgMargin: '平均マージン率',
      startButton: '無料で始める',
      exampleTitle: '💡 実際の分析例',
      exampleSubtitle: 'ワンクリックで4つのプラットフォームを同時比較',
      step1Title: '1. 商品を検索',
      step1Desc: 'キーワードを入力するだけで4つのサイトを一括検索',
      step2Title: '2. 価格を比較',
      step2Desc: '為替レートを自動計算して一目で比較可能',
      step3Title: '3. AI分析',
      step3Desc: '利益率を計算してAIが最適な戦略を提案',
      feature1Title: '4サイト同時検索',
      feature1Desc: 'クーパン、ネイバー、Amazon.jp、楽天を一度に検索',
      feature2Title: '自動為替計算',
      feature2Desc: 'リアルタイムの為替レートで正確な価格比較',
      feature3Title: 'AI利益分析',
      feature3Desc: 'マージン率を計算して最適な販売戦略を提案',
      feature4Title: '日韓翻訳対応',
      feature4Desc: '分析結果を日本語・韓国語で確認可能',
      platformsLabel: '対応プラットフォーム',
      ctaTitle: '今すぐ始めましょう',
      ctaSubtitle: '無料アカウントを作成して、国境を越えた価格分析を体験してください',
      ctaButton: 'アカウント作成'
    }
  };

  const t = text[lang];

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    window.location.href = '/login';
  };

  const handleStartClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            {t.title1}<span className="text-blue-600">{t.title2}</span>
            <br />
            {t.title3}
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                placeholder={t.searchPlaceholder}
                className="w-full px-6 py-5 pr-14 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={() => handleSearch(searchKeyword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search size={24} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-slate-500">{t.popularLabel}</span>
              {t.popularKeywords.map((keyword, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(keyword)}
                  className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="text-blue-600" size={24} />
                <div className="text-3xl font-bold text-slate-900">
                  {stats.todayAnalysis.toLocaleString()}
                </div>
              </div>
              <div className="text-slate-600 text-sm">{t.todayAnalysis}</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <DollarSign className="text-green-600" size={24} />
                <div className="text-3xl font-bold text-slate-900">
                  +{stats.avgMarginRate}%
                </div>
              </div>
              <div className="text-slate-600 text-sm">{t.avgMargin}</div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleStartClick}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              {t.startButton}
            </button>
          </div>
        </div>
      </div>

      {/* Demo Screenshots Section */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
              {t.exampleTitle}
            </h2>
            <p className="text-center text-slate-600 mb-12">
              {t.exampleSubtitle}
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Screenshot 1 - Search */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100 border-b-4 border-blue-500 overflow-hidden">
                  <img
                    src="/landing/search.png"
                    alt={t.step1Title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 placeholder 표시
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <div class="text-center p-6">
                            <div class="text-4xl mb-3">🔍</div>
                            <div class="text-slate-600 text-sm font-medium">${lang === 'ko' ? '검색화면 예시' : '検索画面の例'}</div>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-2">{t.step1Title}</h3>
                  <p className="text-sm text-slate-600">{t.step1Desc}</p>
                </div>
              </div>

              {/* Screenshot 2 - Comparison */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100 border-b-4 border-green-500 overflow-hidden">
                  <img
                    src="/landing/comparison.png"
                    alt={t.step2Title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <div class="text-center p-6">
                            <div class="text-4xl mb-3">📊</div>
                            <div class="text-slate-600 text-sm font-medium">${lang === 'ko' ? '가격비교 결과 예시' : '価格比較結果の例'}</div>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-2">{t.step2Title}</h3>
                  <p className="text-sm text-slate-600">{t.step2Desc}</p>
                </div>
              </div>

              {/* Screenshot 3 - AI Analysis */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100 border-b-4 border-purple-500 overflow-hidden">
                  <img
                    src="/landing/ai-analysis.png"
                    alt={t.step3Title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <div class="text-center p-6">
                            <div class="text-4xl mb-3">🤖</div>
                            <div class="text-slate-600 text-sm font-medium">${lang === 'ko' ? 'AI 분석 예시' : 'AI分析の例'}</div>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-2">{t.step3Title}</h3>
                  <p className="text-sm text-slate-600">{t.step3Desc}</p>
                </div>
              </div>
            </div>

            <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t.feature1Title}</h4>
                  <p className="text-sm text-slate-600">{t.feature1Desc}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t.feature2Title}</h4>
                  <p className="text-sm text-slate-600">{t.feature2Desc}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t.feature3Title}</h4>
                  <p className="text-sm text-slate-600">{t.feature3Desc}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t.feature4Title}</h4>
                  <p className="text-sm text-slate-600">{t.feature4Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-slate-600 mb-6 font-medium">{t.platformsLabel}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                <span className="text-xl">🇰🇷</span>
                <span className="text-slate-700 font-medium">{lang === 'ko' ? '쿠팡' : 'クーパン'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                <span className="text-xl">🇰🇷</span>
                <span className="text-slate-700 font-medium">{lang === 'ko' ? '네이버' : 'ネイバー'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                <span className="text-xl">🇯🇵</span>
                <span className="text-slate-700 font-medium">Amazon.jp</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                <span className="text-xl">🇯🇵</span>
                <span className="text-slate-700 font-medium">{lang === 'ko' ? '라쿠텐' : '楽天'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t.ctaSubtitle}
          </p>
          <button
            onClick={handleStartClick}
            className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all"
          >
            {t.ctaButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;