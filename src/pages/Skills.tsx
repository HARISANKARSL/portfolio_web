import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import TextReveal from "@/components/TextReveal";
import { Code2, Server, Cloud, GitBranch, Database } from "lucide-react";
import React from "react";
import TechSkillCard from "@/components/TechSkillCard";
import { fetchTechStack } from "@/services/techstacks/techstack";
import { useFilter } from "@/components/FilterContext";
import NoDataFound from "@/components/NoDataFound";

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

const Skills = () => {
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  
  const { setFilterConfig, setShowFilterButton, activeFilters } = useFilter();

  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Dynamic filter configuration mounting
  useEffect(() => {
    setShowFilterButton(true);
    setFilterConfig([
      { id: "name", label: "Skill Name", type: "text", iconType: "text", placeholder: "Search React, GSAP..." },
      { id: "createdAt", label: "Created Date", type: "date", iconType: "calendar" },
      { id: "status", label: "Status", type: "select", iconType: "status", options: [
        { label: "Active Status", value: "active" },
        { label: "Inactive Status", value: "inactive" }
      ]}
    ]);

    return () => {
      setShowFilterButton(false);
      setFilterConfig([]);
    };
  }, [setFilterConfig, setShowFilterButton]);

  const loadSkills = async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const apiFilters = { ...activeFilters };
      if (!apiFilters.status) {
        apiFilters.status = "active";
      }

      const res = await fetchTechStack({
        page: pageNum,
        limit: 10,
        search: activeFilters.name || "",
        filters: apiFilters
      });

      const hasFiltersActive = Object.keys(activeFilters).length > 0;

      if (res && res.data && res.data.length > 0) {
        if (isInitial) {
          setSkillsList(res.data);
        } else {
          setSkillsList((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = res.data.filter((item) => !existingIds.has(item._id));
            return [...prev, ...newItems];
          });
        }
        setHasNextPage(res.pagination.hasNextPage);
      } else {
        if (isInitial) {
          setSkillsList(hasFiltersActive ? [] : skills);
          setHasNextPage(false);
        } else {
          setHasNextPage(false);
        }
      }
    } catch (error) {
      console.error("Failed to load skills:", error);
      if (isInitial) {
        const hasFiltersActive = Object.keys(activeFilters).length > 0;
        setSkillsList(hasFiltersActive ? [] : skills);
        setHasNextPage(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch / refetch on activeFilters change
  useEffect(() => {
    setPage(1);
    loadSkills(1, true);
  }, [activeFilters]);

  // Infinite Scroll Observer Setup
  useEffect(() => {
    if (loading || !hasNextPage || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadSkills(nextPage, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, hasNextPage, loadingMore, page]);

  // Title animation (immediate)
  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
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
        }, ref);
        return () => ctx.revert();
      });
    });
  }, []);

  // Skill cards entrance animation (runs/re-runs when cards list changes)
  useEffect(() => {
    if (skillsList.length === 0) return;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>(".skill-card").forEach((card, i) => {
            gsap.fromTo(
              card,
              {
                y: 40,
                opacity: 0,
                scale: 0.95
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.2)",
                delay: (i % 10) * 0.05,
                scrollTrigger: { trigger: card, start: "top 90%" },
              }
            );
          });
        }, ref);
        return () => ctx.revert();
      });
    });
  }, [skillsList.length]);

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

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative h-[120px] border border-slate-900 rounded-2xl bg-slate-950/20 backdrop-blur-md p-7 animate-pulse flex items-start gap-5">
                    <div className="w-14 h-14 bg-slate-900 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-2.5 bg-slate-900 rounded w-1/3" />
                      <div className="h-4 bg-slate-900 rounded w-2/3" />
                      <div className="h-2.5 bg-slate-900 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : skillsList.length === 0 ? (
              <div className="flex justify-center py-12">
                <NoDataFound message="No skills match your filter query" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skillsList.map((skill, idx) => (
                    <TechSkillCard key={skill._id || skill.name} skill={skill} idx={idx} />
                  ))}
                </div>

                {/* Infinite Scroll Anchor */}
                <div ref={observerRef} className="w-full flex justify-center mt-12 py-4 min-h-[50px]">
                  {loadingMore && (
                    <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm">
                      <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                      <span>Loading next batch...</span>
                    </div>
                  )}
                </div>
              </>
            )}
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
