import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useEffect, useRef } from "react";

interface DemographicData {
  name: string;
  value: number;
  fill: string;
}

interface TrafficData {
  source: string;
  value: number;
  fill: string;
}

const DEMOGRAPHICS_DATA: DemographicData[] = [
  { name: "NA", value: 47, fill: "#06b6d4" },
  { name: "EU", value: 30, fill: "#a855f7" },
  { name: "ASIA", value: 15, fill: "#0ea5e9" },
  { name: "SA", value: 8, fill: "#06b6d4" },
];

const DEVICE_DATA: DemographicData[] = [
  { name: "DESKTOP", value: 60, fill: "#a855f7" },
  { name: "MOBILE", value: 25, fill: "#06b6d4" },
  { name: "TABLET", value: 15, fill: "#0ea5e9" },
];

const TRAFFIC_DATA: TrafficData[] = [
  { source: "DIRECT", value: 25427, fill: "#7c3aed" },
  { source: "ORGANIC", value: 33063, fill: "#06b6d4" },
  { source: "REFERRAL", value: 15047, fill: "#0ea5e9" },
  { source: "SOCIAL", value: 256, fill: "#06b6d4" },
];

interface DemographicsChartProps {
  title: string;
  data: DemographicData[];
  innerRadius?: number;
  outerRadius?: number;
}

const DemographicsChart = ({
  title,
  data,
  innerRadius = 50,
  outerRadius = 80,
}: DemographicsChartProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid #404040",
              borderRadius: "8px",
            }}
            formatter={(value) => `${value}%`}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-xs text-muted-foreground font-mono space-y-1 mt-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span>
              {item.name} {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface NetworkDashboardProps {
  title?: string;
  subtitle?: string;
}

const NetworkDashboard = ({
  title = "NETWORK TOPOGRAPHY",
  subtitle = "DASHBOARD",
}: NetworkDashboardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      gsap.context(() => {
        // Status bar animation
        gsap.fromTo(
          ".status-bar",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.out",
            transformOrigin: "left",
          }
        );

        // Map container animation
        gsap.fromTo(
          ".map-container",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.2,
          }
        );

        // Stats cards animation
        gsap.utils.toArray<HTMLElement>(".stat-card").forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.3 + i * 0.1,
              ease: "back.out(1.5)",
            }
          );
        });

        // Chart animation
        gsap.utils.toArray<HTMLElement>(".chart-container").forEach((chart, i) => {
          gsap.fromTo(
            chart,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.7,
              delay: 0.5 + i * 0.1,
              ease: "back.out(1.5)",
            }
          );
        });
      }, ref);
    });
  }, []);

  return (
    <div ref={ref} className="w-full space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          // {title}
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {subtitle}
        </h3>
      </div>

      {/* System Health Status */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          System Health
        </h3>
        <div className="status-bar relative h-12 bg-muted rounded-full overflow-hidden border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
          <div className="absolute inset-1 bg-background rounded-full flex items-center pl-4">
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              STATUS: OPTIMAL - 99.9% UPTIME
            </span>
          </div>
        </div>
        <div className="mt-3 text-right text-xs text-muted-foreground font-mono">
          STATUS: OPTIMAL - 99.9% UPTIME
        </div>
      </div>

      {/* Consistency Map */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
        <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          Consistency_Map
        </h3>
        <div className="map-container relative h-72 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl overflow-hidden border border-border/50 flex items-center justify-center">
          {/* Simplified Network Visualization */}
          <svg
            className="w-full h-full"
            viewBox="0 0 500 300"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Network Lines */}
            <line x1="100" y1="80" x2="250" y2="150" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
            <line x1="250" y1="150" x2="400" y2="80" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
            <line x1="400" y1="80" x2="450" y2="200" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
            <line x1="450" y1="200" x2="250" y2="150" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
            <line x1="250" y1="150" x2="100" y2="220" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />

            {/* World Map Outlines (simplified) */}
            <text x="80" y="100" fill="#888" fontSize="10" fontFamily="monospace">
              US-EAST
            </text>
            <text x="350" y="70" fill="#888" fontSize="10" fontFamily="monospace">
              EU-WEST
            </text>
            <text x="420" y="50" fill="#888" fontSize="10" fontFamily="monospace">
              ASIA-PAC
            </text>
            <text x="420" y="220" fill="#888" fontSize="10" fontFamily="monospace">
              ASIA-OSC
            </text>

            {/* Network Nodes */}
            <circle cx="100" cy="80" r="8" fill="url(#nodeGradient)" filter="url(#glow)" />
            <circle cx="100" cy="220" r="8" fill="#06b6d4" filter="url(#glow)" />
            <circle cx="250" cy="150" r="10" fill="#06b6d4" filter="url(#glow)" opacity="0.8" />
            <circle cx="400" cy="80" r="8" fill="#a855f7" filter="url(#glow)" />
            <circle cx="450" cy="200" r="6" fill="#06b6d4" filter="url(#glow)" />
            <circle cx="350" cy="220" r="7" fill="#a855f7" filter="url(#glow)" />

            {/* Data Packets */}
            <rect x="160" y="110" width="12" height="12" fill="#06b6d4" opacity="0.8" rx="2" />
            <rect x="300" y="90" width="12" height="12" fill="#a855f7" opacity="0.8" rx="2" />
            <rect x="380" y="160" width="12" height="12" fill="#06b6d4" opacity="0.8" rx="2" />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="stat-card bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-5">
            Quick Stats
          </h3>
          <div className="space-y-4">
            {TRAFFIC_DATA.map((item) => (
              <div key={item.source}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-mono text-foreground">{item.source}</span>
                  <span className="text-sm font-bold text-cyan-400">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: item.fill,
                      width: `${Math.min((item.value / 35000) * 100, 100)}%`,
                      animation: `slideIn 1s ease-out forwards`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes slideIn {
              from { width: 0; }
              to { width: var(--target-width); }
            }
          `}</style>
        </div>

        {/* User Demographics */}
        <div className="stat-card bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            User Demographics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="chart-container">
              <DemographicsChart title="Region" data={DEMOGRAPHICS_DATA} />
            </div>
            <div className="chart-container">
              <DemographicsChart title="Device Type" data={DEVICE_DATA} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground font-mono">
        <p>Real-time network monitoring and analytics</p>
        <p className="text-cyan-400/70 mt-1">Last synced: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default NetworkDashboard;
