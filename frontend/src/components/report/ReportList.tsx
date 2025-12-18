import ReportListItem from "./ReportListItem";

interface Report {
  id: string;
  keyword: string;
  createdAt: string;
}

interface Props {
  reports: Report[];
  onSelect: (id: string) => void;
}

export default function ReportList({ reports, onSelect }: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reports.map((r) => (
        <ReportListItem
          key={r.id}
          id={r.id}
          keyword={r.keyword}
          createdAt={r.createdAt}
          onClick={onSelect}
        />
      ))}
    </section>
  );
}
