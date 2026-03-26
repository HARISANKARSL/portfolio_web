import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import TextReveal from "@/components/TextReveal";
import ProjectAnalytics from "@/components/ProjectAnalytics";
import NetworkDashboard from "@/components/NetworkDashboard";


const Analytics = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          // Analytics section reveal
          gsap.fromTo(
            ".analytics-section",
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: ".analytics-section", start: "top 85%" },
            }
          );

          // Network dashboard section reveal
          gsap.fromTo(
            ".network-dashboard-section",
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: ".network-dashboard-section", start: "top 85%" },
            }
          );
        }, ref);
        return () => ctx.revert();
      });
    });
  }, []);

  return (
    <Layout>
      <div ref={ref} className="px-6 md:px-0">
        <section className="container max-w-5xl pt-12 md:pt-16">
          <div className="mb-16">
            <TextReveal
              as="h1"
              className="text-3xl md:text-5xl font-bold font-display mb-4"
              delay={0.1}
              stagger={0.08}
            >
              Project Analytics
            </TextReveal>
            <p className="text-muted-foreground text-lg">
              Deep dive into project metrics and network performance insights.
            </p>
          </div>

          {/* Project Analytics */}
          <div className="analytics-section opacity-0 mb-16">
            <ProjectAnalytics />
          </div>

          {/* Network Topography Dashboard */}
          <div className="network-dashboard-section opacity-0 mb-16">
            <NetworkDashboard />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Analytics;
