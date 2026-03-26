import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { MapPin, Calendar, Award, Briefcase } from "lucide-react";

const timeline = [
  { year: "2024", title: "Senior Developer", company: "Tech Corp", desc: "Leading frontend architecture" },
  { year: "2023", title: "Full-Stack Developer", company: "StartupXYZ", desc: "Built core platform from scratch" },
  { year: "2022", title: "Frontend Developer", company: "Agency Co", desc: "Delivered 20+ client projects" },
  { year: "2021", title: "Junior Developer", company: "Freelance", desc: "Started professional journey" },
];

const About = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.fromTo(".about-hero", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 });

          gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
            gsap.fromTo(item, { x: -30, opacity: 0 }, {
              x: 0, opacity: 1, duration: 0.6, delay: i * 0.1,
              scrollTrigger: { trigger: item, start: "top 85%" },
            });
          });

          gsap.utils.toArray<HTMLElement>(".about-section").forEach((section) => {
            gsap.fromTo(section, { y: 40, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.7,
              scrollTrigger: { trigger: section, start: "top 85%" },
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
          <div className="about-hero opacity-0">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
              About <span className="gradient-text">Me</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              I'm a passionate full-stack developer with 4+ years of experience building web applications 
              that users love. I specialize in React, TypeScript, and modern backend technologies.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-12">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> San Francisco, CA</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> 4+ Years Exp</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-primary" /> 25+ Projects</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="about-section opacity-0 mb-16">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8">
              // Experience
            </h2>
            <div className="space-y-6">
              {timeline.map((item) => (
                <div key={item.year} className="timeline-item opacity-0 flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                    <div className="w-px h-full bg-border min-h-[40px]" />
                  </div>
                  <div className="pb-6">
                    <span className="text-xs font-mono text-primary">{item.year}</span>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {item.company}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="about-section opacity-0 mb-16">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
              // What I Value
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Clean Code", desc: "Readable, maintainable, and well-tested code is my standard." },
                { title: "User First", desc: "Every decision starts with the end-user experience." },
                { title: "Continuous Growth", desc: "Always learning new technologies and improving my craft." },
              ].map((v) => (
                <div key={v.title} className="bg-card border border-border rounded-xl p-5 hover-lift">
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
