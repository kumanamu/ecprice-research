type Props = {
  keyword?: string;
  onKeywordChange?: (v: string) => void;
  onSearch?: () => void;
  lang?: string;
};

export default function SearchBar({
  keyword = "",
  onKeywordChange = () => {},
  onSearch = () => {},
}: Props) {
  return (
    <div>
      <input
        value={keyword}
        onChange={e => onKeywordChange(e.target.value)}
      />
      <button onClick={onSearch}>검색</button>
    </div>
  );
}
