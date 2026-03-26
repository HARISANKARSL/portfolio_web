import { useMemo } from "react";

interface HeatmapGridProps {
  title: string;
  data?: number[];
  weeks?: number;
}

const HeatmapGrid = ({ title, data, weeks = 20 }: HeatmapGridProps) => {
  const cells = useMemo(() => {
    if (data) return data;
    // Generate mock data
    return Array.from({ length: weeks * 7 }, () => Math.floor(Math.random() * 5));
  }, [data, weeks]);

  const getColor = (level: number) => {
    const colors = [
      "bg-muted",
      "bg-primary/20",
      "bg-primary/40",
      "bg-primary/60",
      "bg-primary/80",
    ];
    return colors[Math.min(level, 4)];
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4 font-mono">{title}</h3>
      <div className="overflow-x-auto">
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
          {cells.map((level, i) => (
            <div
              key={i}
              className={`heatmap-cell w-3 h-3 ${getColor(level)}`}
              title={`${level} contributions`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`w-3 h-3 rounded-sm ${getColor(l)}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatmapGrid;
