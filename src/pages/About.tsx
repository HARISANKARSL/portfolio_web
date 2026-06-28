import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import TextReveal from "@/components/TextReveal";
import { MapPin, Calendar, Award, Briefcase } from "lucide-react";
import { fetchExperiences, ExperienceItem } from "@/services/experience/experience";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const response = await fetchExperiences({ limit: 50, sortBy: "startDate", sortOrder: -1 });
        const sorted = (response.data || []).sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setExperiences(sorted);
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExperiences();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          // Hero info tags stagger
          gsap.fromTo(
            ".about-tag",
            { y: 20, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.1, delay: 0.6 }
          );

          gsap.fromTo(
            ".about-desc",
            { y: 30, opacity: 0, clipPath: "inset(0 100% 0 0)" },
            { y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out", delay: 0.3 }
          );

          // Timeline with line drawing
          gsap.fromTo(
            ".timeline-line",
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 1.5,
              ease: "power3.inOut",
              transformOrigin: "top",
              scrollTrigger: { trigger: ".timeline-container", start: "top 80%" },
            }
          );

          // Timeline items slide in from alternating sides
          gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
            gsap.fromTo(
              item,
              { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.7,
                delay: i * 0.15,
                scrollTrigger: { trigger: item, start: "top 85%" },
              }
            );
          });

          // Timeline dots scale in
          gsap.utils.toArray<HTMLElement>(".timeline-dot").forEach((dot, i) => {
            gsap.fromTo(
              dot,
              { scale: 0 },
              {
                scale: 1,
                duration: 0.4,
                ease: "back.out(3)",
                delay: i * 0.15 + 0.2,
                scrollTrigger: { trigger: dot, start: "top 85%" },
              }
            );
          });

          // Values cards with rotation
          gsap.utils.toArray<HTMLElement>(".value-card").forEach((card, i) => {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0, rotateY: -15 },
              {
                y: 0,
                opacity: 1,
                rotateY: 0,
                duration: 0.7,
                delay: i * 0.12,
                scrollTrigger: { trigger: card, start: "top 88%" },
              }
            );
          });
        }, ref);
        return () => ctx.revert();
      });
    });
  }, [isLoading]);

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
              About Me
            </TextReveal>
            <p className="about-desc opacity-0 text-muted-foreground text-lg leading-relaxed mb-4">

              Full-Stack Developer with 2+ years of experience, countless cups of coffee, and an unhealthy number of browser tabs open. I love building modern web applications with React and Node.js, solving challenging problems, and turning complex requirements into simple user experiences.

            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-12">
              <span className="about-tag opacity-0 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Trivandrum, Kerala</span>
              <span className="about-tag opacity-0 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> 2+ Years Exp</span>
              <span className="about-tag opacity-0 flex items-center gap-1.5"><Award className="w-4 h-4 text-primary" /> 10+ Projects</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8">
              // Experience
            </h2>
            <div className="timeline-container relative space-y-6">
              <div className="timeline-line absolute left-[5px] top-2 bottom-2 w-px bg-primary/30" style={{ transformOrigin: "top" }} />
              {experiences.map((item, i) => (
                <div key={item._id || i} className="timeline-item opacity-0 flex gap-4 items-start relative">
                  <div className="flex flex-col items-center relative z-10">
                    <div className="timeline-dot w-3 h-3 rounded-full bg-primary mt-1.5" />
                  </div>
                  <div className="pb-6">
                    <span className="text-xs font-mono text-primary">
                      {item.startDate ? (
                        item.currentlyWorking ? (
                          `${new Date(item.startDate).getFullYear()} - Present`
                        ) : item.endDate && new Date(item.startDate).getFullYear() !== new Date(item.endDate).getFullYear() ? (
                          `${new Date(item.startDate).getFullYear()} - ${new Date(item.endDate).getFullYear()}`
                        ) : (
                          new Date(item.startDate).getFullYear()
                        )
                      ) : ""}
                    </span>
                    <h3 className="font-semibold text-foreground">
                      {typeof item.title === 'object' ? item.title?.name : (item.title || item.position)}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {typeof item.company === 'object' ? item.company?.name : item.company}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
              // What I Value
            </h2>
            <div className="grid md:grid-cols-3 gap-4" style={{ perspective: "800px" }}>
              {[
                { title: "Clean Code", desc: "Readable, maintainable, and well-tested code is my standard." },
                { title: "User First", desc: "Every decision starts with the end-user experience." },
                { title: "Continuous Growth", desc: "Always learning new technologies and improving my craft." },
              ].map((v) => (
                <div key={v.title} className="value-card opacity-0 bg-card border border-border rounded-xl p-5 hover-lift">
                  <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
