import { useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";

interface StatItemType {
  label: string;
  value: number | string;
  icon: React.ReactNode;
   progress?: number;
}

interface CodeStatsProps {
  header: string;
  icon?: React.ReactNode;
  stats: StatItemType[];
  color?: "cyan" | "purple";
}

const CodeStats = ({
  header,
  icon,
  stats,
  color = "cyan",
}: CodeStatsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const colorClass =
    color === "cyan"
      ? "text-cyan-400"
      : "text-purple-400";

  const borderHover =
    color === "cyan"
      ? "hover:border-cyan-500/50"
      : "hover:border-purple-500/50";

  const bgIcon =
    color === "cyan"
      ? "bg-cyan-500/20"
      : "bg-purple-500/20";

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      gsap.context(() => {
        gsap.fromTo(
          ".card",
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          }
        );

        gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: 0.15 + i * 0.05,
              ease: "back.out(1.5)",
            }
          );
        });
      }, ref);
    });
  }, []);

  return (
    <div ref={ref}>
      <div
       className={`card h-full flex flex-col opacity-0 bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 ${borderHover}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`p-2 rounded-lg ${bgIcon}`}>{icon}</div>
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {header}
          </h3>
        </div>

        {/* Stats */}
    <div className="space-y-6 overflow-y-auto pr-2">
  {stats.map((item, index) => (
    <div key={index} className="stat-value opacity-0 space-y-1">
      <p className="text-xs font-mono text-muted-foreground uppercase">
        {item.label}
      </p>

      <div className="flex items-center gap-2">
        {item.icon}
        <span className={`text-2xl font-bold ${colorClass}`}>
          {item.value}
        </span>
      </div>

      {/* ✅ Progress bar (optional) */}
      {item.progress !== undefined && (
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              color === "cyan"
                ? "bg-gradient-to-r from-cyan-400 to-cyan-500"
                : "bg-gradient-to-r from-purple-400 to-purple-500"
            }`}
            style={{
              width: `${item.progress}%`,
              transition: "width 1s ease-out",
            }}
          />
        </div>
      )}
      
    </div>
    
  ))}
</div>

      </div>

     
    
    </div>
  );
};

export default CodeStats;