import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import HeatmapGrid from "@/components/HeatmapGrid";
import { FolderKanban, Users, DollarSign, Code, Star, GitBranch, Sun, Moon } from "lucide-react";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          // Hero animation
          gsap.fromTo(
            ".hero-title",
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
          );
          gsap.fromTo(
            ".hero-subtitle",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
          );
          gsap.fromTo(
            ".hero-cta",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.8 }
          );

          // Scroll-triggered sections
          gsap.utils.toArray<HTMLElement>(".scroll-section").forEach((section) => {
            gsap.fromTo(
              section,
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
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

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-6 hero-cta opacity-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Available for work
            </div>
            <h1 className="hero-title opacity-0 text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight tracking-tight">
              Hi, I'm a{" "}
              <span className="gradient-text">Full-Stack</span>
              <br />
              Developer
            </h1>
            <p className="hero-subtitle opacity-0 mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Building scalable web applications with modern technologies. 
              Passionate about clean code, great UX, and solving complex problems.
            </p>
            <div className="hero-cta opacity-0 flex flex-wrap gap-3 mt-8">
              <a
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <FolderKanban className="w-4 h-4" />
                View Projects
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="scroll-section opacity-0 px-6 md:px-0 mb-16">
          <div className="container">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
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

        {/* Heatmaps */}
        <section className="scroll-section opacity-0 px-6 md:px-0 mb-16">
          <div className="container">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
              // Activity
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <HeatmapGrid title="GitHub Contributions" weeks={20} />
              <HeatmapGrid title="LeetCode Activity" weeks={20} />
            </div>
          </div>
        </section>

        {/* Quick Info */}
        <section className="scroll-section opacity-0 px-6 md:px-0 mb-16">
          <div className="container">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
              // Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "PostgreSQL", "Docker", "AWS", "GraphQL", "Redis"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-mono text-foreground hover-lift cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Projects */}
        <section className="scroll-section opacity-0 px-6 md:px-0 mb-16">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                // Recent Projects
              </h2>
              <a href="/projects" className="text-xs text-primary font-mono hover:underline">
                View all →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "E-Commerce Platform", desc: "Full-stack marketplace with real-time features", tags: ["React", "Node.js", "MongoDB"] },
                { title: "Analytics Dashboard", desc: "Data visualization tool for SaaS metrics", tags: ["Next.js", "D3.js", "PostgreSQL"] },
                { title: "AI Chat Application", desc: "Real-time chat with AI-powered responses", tags: ["TypeScript", "OpenAI", "WebSocket"] },
              ].map((project) => (
                <div key={project.title} className="bg-card border border-border rounded-xl p-5 hover-lift group cursor-pointer">
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
