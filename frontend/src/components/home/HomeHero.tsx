import HomeHeroRaw from "./HomeHeroRaw";

interface Props {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export default function HomeHero({
  keyword,
  onKeywordChange,
  onSearch,
  loading = false,
}: Props) {
  return (
    <HomeHeroRaw
      keyword={keyword}
      onKeywordChange={onKeywordChange}
      onSearch={onSearch}
      loading={loading}
    />
  );
}
