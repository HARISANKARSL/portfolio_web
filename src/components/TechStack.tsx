import React from "react";

interface TechStackProps {
  title?: string;
  techs: string[];
  className?: string;
}

const TechStack = ({
  title = "// Tech Stack",
  techs,
  className = "",
}: TechStackProps) => {
  return (
    <section className={`scroll-section opacity-0 px-6 md:px-0 mb-16 ${className}`}>
      <div className="container">
        <h2 className="section-header text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
          {title}
        </h2>

        <div className="flex flex-wrap gap-2">
          {techs.map((tech) => (
            <span
              key={tech}
              className="tech-tag px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-mono text-foreground hover-lift cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;