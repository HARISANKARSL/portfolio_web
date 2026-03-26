import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import TextReveal from "@/components/TextReveal";

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
          // Skill categories slide in from alternating sides
          gsap.utils.toArray<HTMLElement>(".skill-category").forEach((cat, i) => {
            gsap.fromTo(
              cat,
              { x: i % 2 === 0 ? -80 : 80, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: cat, start: "top 85%" },
              }
            );
          });

          // Skill bars with elastic ease
          gsap.utils.toArray<HTMLElement>(".skill-bar-fill").forEach((bar) => {
            const width = bar.getAttribute("data-level") || "0";
            gsap.fromTo(
              bar,
              { width: "0%", opacity: 0 },
              {
                width: `${width}%`,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: { trigger: bar, start: "top 90%" },
              }
            );
          });

          // Skill labels stagger
          gsap.utils.toArray<HTMLElement>(".skill-label").forEach((label, i) => {
            gsap.fromTo(
              label,
              { x: -20, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.4,
                delay: (i % 5) * 0.08,
                scrollTrigger: { trigger: label, start: "top 92%" },
              }
            );
          });

          // Percentage counters
          gsap.utils.toArray<HTMLElement>(".skill-percent").forEach((el) => {
            const target = parseInt(el.getAttribute("data-level") || "0", 10);
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 92%" },
              onUpdate: () => {
                el.textContent = `${Math.floor(obj.val)}%`;
              },
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
          <div className="mb-12">
            <TextReveal
              as="h1"
              className="text-3xl md:text-5xl font-bold font-display mb-4"
              delay={0.1}
              stagger={0.08}
            >
              My Skills
            </TextReveal>
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
                        <span className="skill-label text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="skill-percent text-xs font-mono text-muted-foreground" data-level={skill.level}>
                          0%
                        </span>
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
