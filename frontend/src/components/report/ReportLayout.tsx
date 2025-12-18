
export default function ReportLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">{left}</div>
        {right && (
          <aside className="w-full lg:w-[360px] shrink-0">
            {right}
          </aside>
        )}
      </div>
    </div>
  );
}
