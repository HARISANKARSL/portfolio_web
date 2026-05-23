import { ExternalLink, GitBranch, Star } from "lucide-react";

interface Technology {
  _id: string;
  name: string;
}

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description: string;
    link?: string;
    stars?: number;
    technologies?: Technology[];
  };
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  console.log("project", project);

  return (
    <div className="project-card bg-card border border-border rounded-xl p-5 hover-lift group cursor-pointer flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />

          <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Star className="w-3 h-3" />
            {project.stars || 0}
          </span>
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        )}
      </div>

      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
        {project.name}
      </h3>

      <p className="text-sm text-muted-foreground flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {project.technologies?.map((tech) => (
          <span
            key={tech._id}
            className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded"
          >
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  );
}