import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { ExternalLink, GitBranch, Star } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    desc: "A full-stack marketplace with real-time inventory management, payment processing, and admin dashboard.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    stars: 48,
    link: "#",
  },
  {
    title: "Analytics Dashboard",
    desc: "Data visualization tool for SaaS companies to track user engagement and revenue metrics.",
    tags: ["Next.js", "D3.js", "PostgreSQL", "Redis"],
    stars: 125,
    link: "#",
  },
  {
    title: "AI Chat Application",
    desc: "Real-time messaging app with AI-powered smart replies and context-aware suggestions.",
    tags: ["TypeScript", "OpenAI", "WebSocket", "React"],
    stars: 89,
    link: "#",
  },
  {
    title: "Task Management Tool",
    desc: "Kanban-style project management with team collaboration, file sharing, and time tracking.",
    tags: ["React", "GraphQL", "PostgreSQL"],
    stars: 67,
    link: "#",
  },
  {
    title: "Portfolio Generator",
    desc: "CLI tool that generates beautiful portfolio websites from a JSON configuration file.",
    tags: ["Node.js", "CLI", "Handlebars"],
    stars: 234,
    link: "#",
  },
  {
    title: "Real-time Collaboration",
    desc: "Google Docs-style editor with live cursors, comments, and version history.",
    tags: ["React", "CRDT", "WebSocket", "Y.js"],
    stars: 156,
    link: "#",
  },
];

const Projects = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.fromTo(".projects-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 });

          gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, i) => {
            gsap.fromTo(card, { y: 40, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.6, delay: (i % 3) * 0.1,
              scrollTrigger: { trigger: card, start: "top 88%" },
            });
          });
        }, ref);
        return () => ctx.revert();
      });
    });
  }, []);

  return (
    <Layout>
      <div ref={ref} className="px-6 md:px-0">
        <section className="container max-w-4xl pt-12 md:pt-16">
          <div className="projects-title opacity-0 mb-12">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              A selection of projects I've built — from client work to open source.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {projects.map((project) => (
              <div key={project.title} className="project-card opacity-0 bg-card border border-border rounded-xl p-5 hover-lift group cursor-pointer flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary" />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                      <Star className="w-3 h-3" /> {project.stars}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground flex-1">{project.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Projects;
