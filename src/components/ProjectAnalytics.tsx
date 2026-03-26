import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { useEffect, useRef } from "react";

interface ProjectStat {
  name: string;
  value: number;
  fullMark: 100;
}

interface ProjectAnalyticsProps {
  title?: string;
  subtitle?: string;
  data?: ProjectStat[];
  gradientColor?: string;
}

const defaultData: ProjectStat[] = [
  { name: "Speed", value: 80, fullMark: 100 },
  { name: "Performance", value: 88, fullMark: 100 },
  { name: "Efficiency", value: 75, fullMark: 100 },
  { name: "Security", value: 90, fullMark: 100 },
  { name: "Reliability", value: 85, fullMark: 100 },
  { name: "Innovation", value: 60, fullMark: 100 },
];

const ProjectAnalytics = ({
  title = "PROJECT STATS",
  subtitle = "DEEP DIVE",
  data = defaultData,
  gradientColor = "url(#colorGradient)",
}: ProjectAnalyticsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      gsap.context(() => {
        // Animate the chart container
        gsap.fromTo(
          ".radar-chart-container",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        );

        // Animate stat values
        gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: "back.out(2)" }
          );
        });
      }, ref);
    });
  }, []);

  return (
    <div
      ref={ref}
      className="w-full bg-card border border-border/50 rounded-xl p-8 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          // {title}
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {subtitle}
        </h3>
      </div>

      {/* Chart and Stats */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <div className="md:col-span-2 flex items-center justify-center">
          <div className="radar-chart-container w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="gradientFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#404040" strokeDasharray="0" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "#888", fontSize: 12, fontFamily: "monospace" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#666", fontSize: 11 }}
                  tickCount={5}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="url(#colorGradient)"
                  fill="url(#gradientFill)"
                  strokeWidth={2.5}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Side Panel */}
        <div className="space-y-3">
          {data.map((stat, i) => (
            <div
              key={stat.name}
              className="stat-value opacity-0 bg-muted/50 border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-foreground font-semibold">{stat.name}</span>
                <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </div>
              <div className="h-1 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  style={{
                    width: `${stat.value}%`,
                    animation: `slideIn 0.8s ease-out ${i * 0.1}s backwards`,
                  }}
                />
              </div>
            </div>
          ))}

          <style>{`
            @keyframes slideIn {
              from {
                width: 0;
                opacity: 0;
              }
              to {
                width: var(--target-width);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-8 border-t border-border/50 text-xs text-muted-foreground font-mono space-y-1">
        <p>Generated metrics based on project quality assessments</p>
        <p className="text-cyan-400/70">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
