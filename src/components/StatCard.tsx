import { ReactNode, useEffect, useRef } from "react";
import CountUp from "./CountUp";

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  delay?: number;
}

const StatCard = ({ icon, value, label, delay = 0 }: StatCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timeout = setTimeout(() => {
      import("gsap").then(({ default: gsap }) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div ref={ref} className="opacity-0 bg-card border border-border rounded-xl p-5 hover-lift glow-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      </div>
      <CountUp value={value} className="text-2xl font-bold font-mono text-foreground" />
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

export default StatCard;
