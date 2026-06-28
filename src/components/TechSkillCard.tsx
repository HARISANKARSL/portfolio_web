import React from "react";
import DynamicIcon from "./DynamicIcon";

interface TechSkillCardProps {
  skill: {
    _id?: string;
    userId?: string;
    name: string;
    category?: string;
    description?: string;
    icon?: string | React.ReactNode;
    image?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  idx: number;
}

const getThemeColors = (idx: number) => {
  const themes = [
    {
      glow: "from-cyan-500/5 to-blue-500/5 hover:shadow-[0_0_35px_rgba(6,182,212,0.18)]",
      border: "border-slate-800/80 hover:border-cyan-500/40",
      brandBox: "bg-cyan-500/5 border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500/50",
      accent: "bg-cyan-500",
      text: "text-cyan-400"
    },
    {
      glow: "from-purple-500/5 to-pink-500/5 hover:shadow-[0_0_35px_rgba(168,85,247,0.18)]",
      border: "border-slate-800/80 hover:border-purple-500/40",
      brandBox: "bg-purple-500/5 border-purple-500/20 text-purple-400 group-hover:border-purple-500/50",
      accent: "bg-purple-500",
      text: "text-purple-400"
    },
    {
      glow: "from-emerald-500/5 to-teal-500/5 hover:shadow-[0_0_35px_rgba(16,185,129,0.18)]",
      border: "border-slate-800/80 hover:border-emerald-500/40",
      brandBox: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/50",
      accent: "bg-emerald-500",
      text: "text-emerald-400"
    },
    {
      glow: "from-amber-500/5 to-orange-500/5 hover:shadow-[0_0_35px_rgba(245,158,11,0.18)]",
      border: "border-slate-800/80 hover:border-amber-500/40",
      brandBox: "bg-amber-500/5 border-amber-500/20 text-amber-400 group-hover:border-amber-500/50",
      accent: "bg-amber-500",
      text: "text-amber-400"
    },
    {
      glow: "from-indigo-500/5 to-violet-500/5 hover:shadow-[0_0_35px_rgba(99,102,241,0.18)]",
      border: "border-slate-800/80 hover:border-indigo-500/40",
      brandBox: "bg-indigo-500/5 border-indigo-500/20 text-indigo-400 group-hover:border-indigo-500/50",
      accent: "bg-indigo-500",
      text: "text-indigo-400"
    },
    {
      glow: "from-rose-500/5 to-red-500/5 hover:shadow-[0_0_35px_rgba(244,63,94,0.18)]",
      border: "border-slate-800/80 hover:border-rose-500/40",
      brandBox: "bg-rose-500/5 border-rose-500/20 text-rose-400 group-hover:border-rose-500/50",
      accent: "bg-rose-500",
      text: "text-rose-400"
    }
  ];
  return themes[idx % themes.length];
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
};

const TechSkillCard: React.FC<TechSkillCardProps> = ({ skill, idx }) => {
  const theme = getThemeColors(idx);

  const renderBrandAsset = () => {
    if (skill.image) {
      return (
        <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
          <img
            src={skill.image}
            alt={skill.name}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-xs font-bold text-muted-foreground">${skill.name.substring(0, 2).toUpperCase()}</span>`;
              }
            }}
          />
        </div>
      );
    }

    if (skill.icon) {
      if (typeof skill.icon === "string") {
        return <DynamicIcon name={skill.icon} className="w-7 h-7 transition-transform duration-500 group-hover:scale-110" />;
      }
      if (React.isValidElement(skill.icon)) {
        return React.cloneElement(skill.icon as React.ReactElement, {
          className: "w-7 h-7 transition-transform duration-500 group-hover:scale-110"
        });
      }
    }

    return <span className="text-xs font-bold text-muted-foreground uppercase">{skill.name.substring(0, 2)}</span>;
  };

  return (
    <div className="skill-card group relative">
      <div className={`relative h-full border ${theme.border} rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-md transition-all duration-500 ${theme.glow} p-6 flex flex-col justify-between space-y-4`}>
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] transition-opacity duration-500" />

        {/* Diagonal top-right abstract gradient glow */}
        <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${theme.glow.split(' ')[0]} ${theme.glow.split(' ')[1]} rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500`} />

        {/* Card Header (Metadata & Status) */}
        <div className="relative z-10 flex items-center justify-between text-[0.62rem] font-mono tracking-widest text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            {skill.status && (
              <span className={`w-1.5 h-1.5 rounded-full ${skill.status === "active" ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : "bg-slate-500"}`} />
            )}
            <span className="uppercase">{skill.status || "active"}</span>
          </div>
          {skill.createdAt && (
            <span>{`INIT // ${formatDate(skill.createdAt)}`}</span>
          )}
        </div>

        {/* Brand Asset & Header Details */}
        <div className="relative z-10 flex items-center gap-4">
          {/* Glowing Brand/Icon Container */}
          <div className={`flex items-center justify-center w-14 h-14 rounded-xl border ${theme.brandBox} shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-105`}>
            {renderBrandAsset()}
          </div>

          <div className="space-y-1 min-w-0">
            {/* Skill Name */}
            <h3 className="font-display font-black text-lg text-foreground tracking-wide leading-tight group-hover:text-white transition-colors duration-300 truncate">
              {skill.name}
            </h3>
            {/* Category Tag */}
            <span className="inline-block font-mono text-[0.65rem] tracking-wider text-muted-foreground/70 uppercase">
              {`[ ${skill.category || "Technology"} ]`}
            </span>
          </div>
        </div>

        {/* Description */}
        {skill.description && (
          <p className="relative z-10 text-muted-foreground text-xs leading-relaxed line-clamp-3">
            {skill.description}
          </p>
        )}

        {/* Interactive Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900 overflow-hidden">
          <div className={`w-0 h-full bg-gradient-to-r ${theme.glow.split(' ')[0]} ${theme.glow.split(' ')[1]} group-hover:w-full transition-all duration-700 ease-out`} />
        </div>

      </div>
    </div>
  );
};

export default TechSkillCard;
