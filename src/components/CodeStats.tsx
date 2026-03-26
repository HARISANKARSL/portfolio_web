import { useEffect, useRef } from "react";
import { Star, GitBranch, GitCommit, Code2, TrendingUp } from "lucide-react";

interface StatItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "cyan" | "purple";
}

const StatItem = ({ label, value, icon, color }: StatItemProps) => {
  const colorClass = color === "cyan" ? "text-cyan-400" : "text-purple-400";
  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-muted-foreground uppercase">{label}</p>
      <div className="flex items-center gap-2">
        <span className={`${colorClass}`}>{icon}</span>
        <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
      </div>
    </div>
  );
};

interface CodeStatsProps {
  showRealtimeIndicator?: boolean;
}

const CodeStats = ({ showRealtimeIndicator = true }: CodeStatsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      gsap.context(() => {
        // Github card slide in
        gsap.fromTo(
          ".github-card",
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.1,
          }
        );

        // LeetCode card slide in
        gsap.fromTo(
          ".leetcode-card",
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.2,
          }
        );

        // Real-time analytics slide in
        gsap.fromTo(
          ".realtime-card",
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.3,
          }
        );

        // Animate stat values
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
    <div
      ref={ref}
      className="grid md:grid-cols-3 gap-4 w-full"
    >
      {/* GitHub Protocol Card */}
      <div className="github-card opacity-0 bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <GitBranch className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            GitHub Protocol
          </h3>
        </div>

        <div className="space-y-6">
          <div className="stat-value opacity-0 space-y-1">
            <p className="text-xs font-mono text-muted-foreground uppercase">STARS</p>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">1,243</span>
            </div>
          </div>

          <div className="stat-value opacity-0 space-y-1">
            <p className="text-xs font-mono text-muted-foreground uppercase">REPOS</p>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">45</span>
            </div>
          </div>

          <div className="stat-value opacity-0 space-y-1">
            <p className="text-xs font-mono text-muted-foreground uppercase">COMMITS</p>
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">5,243</span>
            </div>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                style={{
                  width: "85%",
                  animation: `slideIn 1s ease-out forwards`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LeetCode Node Card */}
      <div className="leetcode-card opacity-0 bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Code2 className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            LeetCode Node
          </h3>
        </div>

        <div className="space-y-6">
          <div className="stat-value opacity-0 space-y-1">
            <p className="text-xs font-mono text-muted-foreground uppercase">SOLVED</p>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">350</span>
            </div>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-500"
                style={{
                  width: "78%",
                  animation: `slideIn 1s ease-out forwards`,
                }}
              />
            </div>
          </div>

          <div className="stat-value opacity-0 space-y-1">
            <p className="text-xs font-mono text-muted-foreground uppercase">RANKING</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">TOP 5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Analytics Card */}
      <div className="realtime-card opacity-0 bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Real-time Analytics
          </h3>
        </div>

        <div className="space-y-6 flex flex-col justify-center h-32">
          <div className="stat-value opacity-0 space-y-3">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Activity Status
            </p>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-muted animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-2.5 h-2.5 rounded-full bg-muted animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <span className="text-xs text-cyan-400 font-mono">Active</span>
            </div>
          </div>

          <div className="stat-value opacity-0 text-xs text-muted-foreground font-mono">
            Last update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { width: 0; }
          to { width: var(--target-width); }
        }
      `}</style>
    </div>
  );
};

export default CodeStats;
