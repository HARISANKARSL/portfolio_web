import { useMemo } from "react";
interface HeatmapCell {
  date: string;
  count: number;
}
interface HeatmapGridProps {
  title: string;
    data?: HeatmapCell[];
  weeks?: number;
  subtitle?: string;
  
}

const HeatmapGrid = ({ title, data, weeks = 20,subtitle }: HeatmapGridProps) => {
const cells = useMemo(() => {
  if (data) return data;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);

  return Array.from({ length: weeks * 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    return {
      date: d.toISOString().split("T")[0], // ✅ valid date
      count: Math.floor(Math.random() * 5),
    };
  });
}, [data, weeks]);

const months = useMemo(() => {
  const monthLabels: { label: string; weekIndex: number }[] = [];

  for (let i = 0; i < cells.length; i += 7) {
    const cell = cells[i];
    const date = new Date(cell.date);

    if (isNaN(date.getTime())) continue; // safety

    const month = date.toLocaleString("default", { month: "short" });

    if (!monthLabels.find((m) => m.label === month)) {
      monthLabels.push({
        label: month,
        weekIndex: i / 7,
      });
    }
  }

  return monthLabels;
}, [cells]);
const maxCount = useMemo(() => {
  if (!cells || cells.length === 0) return 0;
  return Math.max(...cells.map(c => c.count));
}, [cells]);

const getColor = (count: number) => {
  if (count === 0) return "bg-transparent border border-border"; // 👈 no fill

  if (count < 2) return "bg-[#0e4429]";
  if (count < 5) return "bg-[#006d32]";
  if (count < 10) return "bg-[#26a641]";

  return "bg-[#39d353]";
};

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4 font-mono">{title}</h3>
      <div className="overflow-x-auto">
<div className="flex text-xs text-muted-foreground mb-2 relative h-4">
  {months.map((m, i) => (
    <span
      key={i}
      className="absolute whitespace-nowrap"
      style={{
        left: `${(m.weekIndex / (cells.length / 7)) * 100}%`,
      }}
    >
      {m.label}
    </span>
  ))}
</div>
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateRows: "repeat(7, 1fr)",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(0, 1fr)",
            width: "fit-content",
            minWidth: "100%",
          }}
        >
         {cells.map((cell, i) => (
  <div
    key={i}
    className={`heatmap-cell w-3 h-3 rounded-xs! ${getColor(cell.count)}`}
    title={`${cell.date} — ${cell.count} contributions`} // 🔥 real tooltip
  />
))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`w-3 h-3 rounded--sm ${getColor(l)}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatmapGrid;
