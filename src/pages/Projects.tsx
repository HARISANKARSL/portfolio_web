import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import TextReveal from "@/components/TextReveal";

import { fetchProjects } from "@/services/projects/projectsservice";
import ProjectCard from "@/components/ProjectCard";
import NoDataFound from "@/components/NoDataFound";

interface Technology {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  link?: string;
  stars?: number;
  technologies?: Technology[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
console.log("[12121212]",projects)
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetchProjects();
console.log("res",res)
        console.log("API Response:", res);

        setProjects(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    loadProjects();
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, i) => {
            const col = i % 3;
            const rotateY = col === 0 ? -8 : col === 2 ? 8 : 0;

            gsap.fromTo(
              card,
              {
                y: 80,
                opacity: 0,
                rotateY,
                rotateX: 8,
                scale: 0.95,
              },
              {
                y: 0,
                opacity: 1,
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.8,
                delay: (i % 3) * 0.12,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 90%",
                },
              }
            );
          });
        }, ref);

        return () => ctx.revert();
      });
    });
  }, [projects]);

  return (
    <Layout>
      <div ref={ref} className="px-6 md:px-0">
        <section className="container max-w-4xl pt-12 md:pt-16">
          <div className="mb-12">
            <TextReveal
              as="h1"
              className="text-3xl md:text-5xl font-bold font-display mb-4"
              delay={0.1}
              stagger={0.08}
            >
              My Projects
            </TextReveal>

            <p className="text-muted-foreground text-lg">
              A selection of projects I've built — from client work to open source.
            </p>
          </div>

          <div
  className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
  style={{ perspective: "1000px" }}
>
  {projects.length > 0 ? (
    projects.map((project) => (
      <ProjectCard
        key={project._id}
        project={project}
      />
    ))
  ) : (
    <NoDataFound message="No project found" />
  )}
</div>
        </section>
      </div>
    </Layout>
  );
};

export default Projects;