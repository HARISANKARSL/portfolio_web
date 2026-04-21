import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import HeatmapGrid from "@/components/HeatmapGrid";
import CodeStats from "@/components/CodeStats";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import { FolderKanban, Users, DollarSign, Code, Star, GitBranch, Sun, Moon, Code2, GitCommit, LocateFixed, Target, Smile, TrendingUp, Flame } from "lucide-react";

import { fetchGitHubStats } from "@/services/github/githubService";
import TechStack from "@/components/TechStack";
import { fetchLeetCodeStats } from "@/services/leetcode/leetcodeservice";
import { fetchTechStack } from "@/services/techstacks/techstack";

interface HeatmapCell {
  date: string;
  count: number;
}
interface GitHubStats {
  repos: {
    total: number;
    public: number;
    private: number;
  };
  stars: number;
  commits: {
    total: number;
    public: number;
    private: number;
  };
}
const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

const [githubData, setGithubData] = useState<HeatmapCell[]>([]);
const [leetcodeData, setLeetcodeData] = useState<HeatmapCell[]>([]);
const [gitStats, setGitStats] = useState<GitHubStats | null>(null);
const [leetCodeStats, setLeetCodeStats] = useState<any>(null);
const [techs, setTechs] = useState<any[]>([]);
interface GitHubStats {
  repos: {
    total: number;
    public: number;
    private: number;
  };
  stars: number;
  commits: {
    total: number;
    public: number;
    private: number;
  };
}




useEffect(() => {
  const loadGitHub = async () => {
    try {
      const { stats, heatmap } = await fetchGitHubStats();

      setGitStats(stats);
      setGithubData(heatmap);
    } catch (error) {
      console.error("GitHub Fetch Error:", error);
    }
  };

  loadGitHub();
}, []);

useEffect(() => {
  const loadLeetCode = async () => {
    try {
      const { stats, heatmap } = await fetchLeetCodeStats("5HLBLRxRzq");

      setLeetcodeData(heatmap);
      setLeetCodeStats(stats);
    } catch (error) {
      console.error("LeetCode error:", error);
    }
  };

  loadLeetCode();
}, []);

useEffect(() => {
  const load = async () => {
    const res = await fetchTechStack({
      page: 1,
      limit: 20,
    });

    setTechs(res.data);
  };

  load();
}, []);



const maxValue = Math.max(
  gitStats?.stars || 0,
  gitStats?.repos?.total || 0,
  gitStats?.commits?.total || 0
);

const githubStatsConfig = [
  {
    label: "Stars",
    value: gitStats?.stars || 0,
    icon: <Star className="w-4 h-4 text-cyan-400" />,
    progress: (gitStats?.stars / maxValue) * 100,
  },
  {
    label: "Repos",
    value: gitStats?.repos?.total || 0,
    icon: <GitBranch className="w-4 h-4 text-cyan-400" />,
    progress: (gitStats?.repos?.total / maxValue) * 100,
  },
  {
    label: "Commits",
    value: gitStats?.commits?.total || 0,
    icon: <GitCommit className="w-4 h-4 text-cyan-400" />,
    progress: (gitStats?.commits?.total / maxValue) * 100,
  },
];
const total = leetCodeStats?.totalSolved || 0;
const leetCodeStatsConfig = [
  {
    label: "Total Problems Solved",
    value: total,
    icon: <Target className="w-4 h-4 text-cyan-400" />,
  },
  {
    label: "Easy Problems",
    value: leetCodeStats?.easy || 0,
    icon: <Smile className="w-4 h-4 text-green-400" />,
   
  },
  {
    label: "Medium Problems",
    value: leetCodeStats?.medium || 0,
    icon: <TrendingUp className="w-4 h-4 text-yellow-400" />,
   
  },
  {
    label: "Hard Problems",
    value: leetCodeStats?.hard || 0,
    icon: <Flame className="w-4 h-4 text-red-400" />,
    
  },
];




  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          // Hero badge
          gsap.fromTo(
            ".hero-badge",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.3 }
          );

          // Hero subtitle line draw
          gsap.fromTo(
            ".hero-subtitle",
            { y: 30, opacity: 0, clipPath: "inset(0 100% 0 0)" },
            { y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power3.out", delay: 0.7 }
          );

          // CTA buttons stagger
          gsap.fromTo(
            ".hero-cta-btn",
            { y: 40, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)", stagger: 0.15, delay: 1 }
          );

          // Scroll-triggered sections with different effects
          gsap.utils.toArray<HTMLElement>(".scroll-section").forEach((section, i) => {
            // Alternate between slide-up and scale-in
            const isEven = i % 2 === 0;
            gsap.fromTo(
              section,
              {
                y: isEven ? 80 : 0,
                x: isEven ? 0 : -60,
                opacity: 0,
                scale: isEven ? 1 : 0.95,
              },
              {
                y: 0,
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

          // Parallax for section headers
          gsap.utils.toArray<HTMLElement>(".section-header").forEach((header) => {
            gsap.fromTo(
              header,
              { x: -100, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: header,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

          // Staggered card reveals
          gsap.utils.toArray<HTMLElement>(".stagger-card").forEach((card, i) => {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0, rotateX: 15 },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.7,
                ease: "power3.out",
                delay: (i % 4) * 0.1,
                scrollTrigger: {
                  trigger: card,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

          // Tech tags wave animation
          gsap.utils.toArray<HTMLElement>(".tech-tag").forEach((tag, i) => {
            gsap.fromTo(
              tag,
              { y: 30, opacity: 0, scale: 0.8 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(2)",
                delay: i * 0.05,
                scrollTrigger: {
                  trigger: tag.parentElement,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

          // Project cards with 3D tilt entrance
          gsap.utils.toArray<HTMLElement>(".project-card-home").forEach((card, i) => {
            gsap.fromTo(
              card,
              {
                y: 80,
                opacity: 0,
                rotateY: i === 0 ? -10 : i === 2 ? 10 : 0,
                rotateX: 10,
              },
              {
                y: 0,
                opacity: 1,
                rotateY: 0,
                rotateX: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: i * 0.15,
                scrollTrigger: {
                  trigger: card,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              }
            );
          });
        }, heroRef);

        return () => ctx.revert();
      });
    });
  }, []);

  return (
    <Layout>
      <div ref={heroRef}>
        {/* Hero */}
        <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-0">
          <div className="container max-w-4xl">
            {/* Mobile theme toggle */}
            <div className="flex justify-end mb-6 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Available for work
            </div>

            <TextReveal
              as="h1"
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight tracking-tight"
              delay={0.2}
              stagger={0.06}
            >
              Hi, I'm a Full-Stack Developer
            </TextReveal>

            <p className="hero-subtitle opacity-0 mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Building scalable web applications with modern technologies.
              Passionate about clean code, great UX, and solving complex problems.
            </p>

            <div className="flex flex-wrap gap-3 mt-8" style={{ perspective: "600px" }}>
              <MagneticButton strength={0.25}>
                <a
                  href="/projects"
                  className="hero-cta-btn opacity-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <FolderKanban className="w-4 h-4" />
                  View Projects
                </a>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <a
                  href="/contact"
                  className="hero-cta-btn opacity-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
                >
                  Get in Touch
                </a>
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="scroll-section opacity-0 px-6 md:px-0 mb-16">
          <div className="container">
            <h2 className="section-header text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
              // Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<FolderKanban className="w-5 h-5" />} value="25+" label="Projects" delay={0} />
              <StatCard icon={<Users className="w-5 h-5" />} value="15+" label="Clients" delay={100} />
              <StatCard icon={<DollarSign className="w-5 h-5" />} value="$50K+" label="Revenue" delay={200} />
              <StatCard icon={<Star className="w-5 h-5" />} value="100+" label="GitHub Stars" delay={300} />
            </div>
          </div>
        </section>

        {/* Unified Analytics Homepage */}
        <section className="scroll-section opacity-0 px-6 md:px-0 mb-16">
          <div className="container">
            <div className="mb-8">
              <h2 className="section-header text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                // Unified Analytics
              </h2>
              <p className="text-sm text-muted-foreground">Heatmap insights & real-time coding metrics</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Heatmaps */}
              {/* <div className="lg:col-span-1 space-y-4"> */}
                <HeatmapGrid 
                  title="GitHub Contributions" 
                  weeks={14}
                  subtitle="14 weeks of activity"
                  data={githubData}
                />
                <HeatmapGrid 
                  title="LeetCode Activity" 
                  weeks={26}
                  subtitle="26 weeks of problems solved"
                  data={leetcodeData}
                />
              {/* </div> */}
              {/* Right: Code Stats */}
            </div>
              <div className="grid md:grid-cols-2 gap-4 w-full mt-8 items-stretch">
                    
                <CodeStats
  header="GitHub Protocol"
  icon={<GitBranch className="w-4 h-4 text-cyan-400" />}
  stats={githubStatsConfig}
/>
                <CodeStats
  header="LeetCode Protocol"
  icon={<GitBranch className="w-4 h-4 text-cyan-400" />}
  stats={leetCodeStatsConfig}
/>
              </div>
          </div>
        </section>

   

        {/* Tech Stack */}
     <TechStack
  title="// Tech Stack"
  techs={techs.length > 0 ? techs.map(t => t.name) : ["React", "Node.js", "Express", "MongoDB", "TypeScript"]}
/>


        {/* Recent Projects */}
        <section className="scroll-section opacity-0 px-6 md:px-0 mb-16">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-header text-xs font-mono text-muted-foreground uppercase tracking-widest">
                // Recent Projects
              </h2>
              <a href="/projects" className="text-xs text-primary font-mono hover:underline">
                View all →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-4" style={{ perspective: "1000px" }}>
              {[
                { title: "E-Commerce Platform", desc: "Full-stack marketplace with real-time features", tags: ["React", "Node.js", "MongoDB"] },
                { title: "Analytics Dashboard", desc: "Data visualization tool for SaaS metrics", tags: ["Next.js", "D3.js", "PostgreSQL"] },
                { title: "AI Chat Application", desc: "Real-time chat with AI-powered responses", tags: ["TypeScript", "OpenAI", "WebSocket"] },
              ].map((project) => (
                <div key={project.title} className="project-card-home opacity-0 bg-card border border-border rounded-xl p-5 hover-lift group cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-primary" />
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{project.desc}</p>
                  <div className="flex gap-2 mt-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;


