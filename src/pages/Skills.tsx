import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import TextReveal from "@/components/TextReveal";
import { Code2, Server, Cloud, GitBranch, Database } from "lucide-react";
import React from "react";

const skills = [
  { 
    icon: <Code2 className="w-8 h-8" />,
    name: "React",
    category: "UI Framework",
    percentage: 92
  },
  { 
    icon: <Code2 className="w-8 h-8" />,
    name: "TypeScript",
    category: "Type System",
    percentage: 88
  },
  { 
    icon: <Server className="w-8 h-8" />,
    name: "Node.js",
    category: "Runtime Environment",
    percentage: 85
  },
  { 
    icon: <Cloud className="w-8 h-8" />,
    name: "Cloud Infra",
    category: "AWS/GCP",
    percentage: 79
  },
  { 
    icon: <Database className="w-8 h-8" />,
    name: "PostgreSQL",
    category: "Database",
    percentage: 82
  },
  { 
    icon: <GitBranch className="w-8 h-8" />,
    name: "Git",
    category: "Version Control",
    percentage: 95
  },
  { 
    icon: <GitBranch className="w-8 h-8" />,
    name: "Next.js",
    category: "Framework",
    percentage: 87
  },
  { 
    icon: <Code2 className="w-8 h-8" />,
    name: "Docker",
    category: "Containerization",
    percentage: 80
  },
];

const gradientColor = (percentage: number): string => {
  if (percentage >= 90) return "from-cyan-400 to-cyan-500";
  if (percentage >= 80) return "from-purple-400 to-purple-500";
  return "from-blue-400 to-blue-500";
};

const Skills = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          // Title animation
          gsap.fromTo(
            ".skills-title",
            { x: -40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.2,
              scrollTrigger: { trigger: ".skills-title", start: "top 85%" },
            }
          );

          // Skill cards staggered entrance with subtle scale
          gsap.utils.toArray<HTMLElement>(".skill-card").forEach((card, i) => {
            gsap.fromTo(
              card,
              { 
                y: 50, 
                opacity: 0, 
                scale: 0.9
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.7,
                ease: "back.out(1.5)",
                delay: i * 0.08,
                scrollTrigger: { trigger: card, start: "top 88%" },
              }
            );
          });

          // Progress bar fill animation
          gsap.utils.toArray<HTMLElement>(".progress-bar-fill").forEach((bar) => {
            const percentage = bar.getAttribute("data-percentage") || "0";
            gsap.fromTo(
              bar,
              { width: "0%", opacity: 0 },
              {
                width: `${percentage}%`,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: { trigger: bar, start: "top 90%" },
              }
            );
          });
        }, ref);
        return () => ctx.revert();
      });
    });
  }, []);

  return (
    <Layout>
      <div ref={ref} className="px-6 md:px-0">
        <section className="container max-w-5xl pt-12 md:pt-16 pb-20">
          {/* Header */}
          <div className="mb-16 skills-title">
            <TextReveal
              as="h1"
              className="text-4xl md:text-5xl font-bold font-display mb-4"
              delay={0.1}
              stagger={0.08}
            >
              Technical Skills
            </TextReveal>
            <p className="text-muted-foreground text-base md:text-lg">
              Core technologies and frameworks that power my development work.
            </p>
          </div>

          {/* Technical Dashboard */}
          <div className="mb-16">
            <h2 className="text-xl font-mono text-muted-foreground uppercase tracking-widest mb-8 text-center">
              Technical_Dashboard
            </h2>
            
            {/* First Row - Skills 1-4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {skills.slice(0, 4).map((skill, idx) => {
                const iconBgColor = 
                  skill.percentage >= 90 ? "bg-cyan-500/20 text-cyan-400" :
                  skill.percentage >= 85 ? "bg-purple-500/20 text-purple-400" :
                  skill.percentage >= 80 ? "bg-green-500/20 text-green-400" :
                  "bg-blue-500/20 text-blue-400";
                
                const borderColor = 
                  skill.percentage >= 90 ? "border-cyan-500/40 hover:border-cyan-500/70" :
                  skill.percentage >= 85 ? "border-purple-500/40 hover:border-purple-500/70" :
                  skill.percentage >= 80 ? "border-green-500/40 hover:border-green-500/70" :
                  "border-blue-500/40 hover:border-blue-500/70";

                return (
                  <div key={idx} className="skill-card group">
                    <div className={`relative h-full border ${borderColor} rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl p-6`}>
                      {/* Circuit Board Pattern */}
                      <svg className="absolute inset-0 w-full h-full opacity-[0.1] group-hover:opacity-[0.2] transition-opacity" viewBox="0 0 400 300">
                        <defs>
                          <pattern id={`circuit-${idx}`} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                            <rect width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="5" cy="5" r="2" fill="currentColor"/>
                            <circle cx="45" cy="45" r="2" fill="currentColor"/>
                            <path d="M 10 5 L 40 5" stroke="currentColor" strokeWidth="0.5"/>
                            <path d="M 45 10 L 45 40" stroke="currentColor" strokeWidth="0.5"/>
                            <circle cx="25" cy="25" r="1.5" fill="currentColor" opacity="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="400" height="300" fill={`url(#circuit-${idx})`}/>
                      </svg>

                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col justify-between space-y-5">
                        <div className="space-y-4">
                          <div className={`inline-flex p-3.5 ${iconBgColor} rounded-lg transition-all group-hover:scale-110`}>
                            {React.cloneElement(skill.icon as React.ReactElement, { className: "w-6 h-6" })}
                          </div>
                          <h3 className="font-mono font-bold text-sm text-foreground uppercase tracking-wide">
  {skill.name}{" "}
  <span className="text-muted-foreground/60">{'>'}</span>{" "}
  {skill.category}
</h3>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[0.65rem] font-mono text-muted-foreground/70 uppercase tracking-widest">Level</span>
                            <span className="text-sm font-mono font-bold text-primary">{skill.percentage}%</span>
                          </div>
                          <div className="h-4 bg-slate-800 rounded-sm overflow-hidden border border-slate-700/50">
                            <div
                              className={`h-full rounded-sm bg-gradient-to-r ${gradientColor(skill.percentage)} progress-bar-fill`}
                              data-percentage={skill.percentage}
                              style={{ width: "0%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Second Row - Skills 5-8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.slice(4, 8).map((skill, idx) => {
                const iconBgColor = 
                  skill.percentage >= 90 ? "bg-cyan-500/20 text-cyan-400" :
                  skill.percentage >= 85 ? "bg-purple-500/20 text-purple-400" :
                  skill.percentage >= 82 ? "bg-green-500/20 text-green-400" :
                  "bg-blue-500/20 text-blue-400";
                
                const borderColor = 
                  skill.percentage >= 90 ? "border-cyan-500/40 hover:border-cyan-500/70" :
                  skill.percentage >= 85 ? "border-purple-500/40 hover:border-purple-500/70" :
                  skill.percentage >= 82 ? "border-green-500/40 hover:border-green-500/70" :
                  "border-blue-500/40 hover:border-blue-500/70";

                return (
                  <div key={idx + 4} className="skill-card group">
                    <div className={`relative h-full border ${borderColor} rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl p-6`}>
                      {/* Circuit Board Pattern */}
                      <svg className="absolute inset-0 w-full h-full opacity-[0.1] group-hover:opacity-[0.2] transition-opacity" viewBox="0 0 400 300">
                        <defs>
                          <pattern id={`circuit-${idx + 4}`} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                            <rect width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="5" cy="5" r="2" fill="currentColor"/>
                            <circle cx="45" cy="45" r="2" fill="currentColor"/>
                            <path d="M 10 5 L 40 5" stroke="currentColor" strokeWidth="0.5"/>
                            <path d="M 45 10 L 45 40" stroke="currentColor" strokeWidth="0.5"/>
                            <circle cx="25" cy="25" r="1.5" fill="currentColor" opacity="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="400" height="300" fill={`url(#circuit-${idx + 4})`}/>
                      </svg>

                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col justify-between space-y-5">
                        <div className="space-y-4">
                          <div className={`inline-flex p-3.5 ${iconBgColor} rounded-lg transition-all group-hover:scale-110`}>
                            {React.cloneElement(skill.icon as React.ReactElement, { className: "w-6 h-6" })}
                          </div>
                          <h3 className="font-mono font-bold text-sm text-foreground uppercase tracking-wide">
                            {skill.name} <span className="text-muted-foreground/60">{'>'}</span> {skill.category}
                          </h3>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[0.65rem] font-mono text-muted-foreground/70 uppercase tracking-widest">Level</span>
                            <span className="text-sm font-mono font-bold text-primary">{skill.percentage}%</span>
                          </div>
                          <div className="h-4 bg-slate-800 rounded-sm overflow-hidden border border-slate-700/50">
                            <div
                              className={`h-full rounded-sm bg-gradient-to-r ${gradientColor(skill.percentage)} progress-bar-fill`}
                              data-percentage={skill.percentage}
                              style={{ width: "0%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="border-t border-border/50 pt-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Ready to collaborate?</h3>
            <p className="text-muted-foreground text-sm mb-6">Let's build something exceptional together</p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Skills;
