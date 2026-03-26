import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "Tailwind CSS", level: 95 },
      { name: "GSAP", level: 80 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Express", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "MongoDB", level: 75 },
      { name: "GraphQL", level: 70 },
    ],
  },
  {
    title: "DevOps & Tools",
    skills: [
      { name: "Docker", level: 80 },
      { name: "AWS", level: 75 },
      { name: "Git", level: 95 },
      { name: "CI/CD", level: 80 },
      { name: "Linux", level: 85 },
    ],
  },
];

const Skills = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.fromTo(".skills-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 });

          gsap.utils.toArray<HTMLElement>(".skill-category").forEach((cat, i) => {
            gsap.fromTo(cat, { y: 50, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.7, delay: i * 0.15,
              scrollTrigger: { trigger: cat, start: "top 85%" },
            });
          });

          gsap.utils.toArray<HTMLElement>(".skill-bar-fill").forEach((bar) => {
            const width = bar.getAttribute("data-level") || "0";
            gsap.fromTo(bar, { width: "0%" }, {
              width: `${width}%`, duration: 1, ease: "power3.out",
              scrollTrigger: { trigger: bar, start: "top 90%" },
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
        <section className="container max-w-3xl pt-12 md:pt-16">
          <div className="skills-title opacity-0 mb-12">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
              My <span className="gradient-text">Skills</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Technologies and tools I work with daily to build amazing products.
            </p>
          </div>

          <div className="space-y-10 mb-16">
            {skillCategories.map((category) => (
              <div key={category.title} className="skill-category opacity-0">
                <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-5">
                  // {category.title}
                </h2>
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs font-mono text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="skill-bar-fill h-full bg-primary rounded-full"
                          data-level={skill.level}
                          style={{ width: "0%" }}
                        />
                      </div>
                    </div>
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

export default Skills;
