import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
}

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform with payment integration",
      technologies: "React, Node.js, MongoDB",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      imageUrl: "",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.technologies
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      setProjects(
        projects.map((proj) =>
          proj.id === editingId
            ? { ...proj, ...formData }
            : proj
        )
      );
      setEditingId(null);
    } else {
      setProjects([
        ...projects,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
    }

    setFormData({
      title: "",
      description: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      imageUrl: "",
    });
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((proj) => proj.id !== id));
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      imageUrl: project.imageUrl,
    });
    setEditingId(project.id);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Projects Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Showcase your projects and portfolio work
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: "",
                    description: "",
                    technologies: "",
                    liveUrl: "",
                    githubUrl: "",
                    imageUrl: "",
                  });
                }}
              >
                + Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Project" : "Add New Project"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update your project details below"
                    : "Fill in your project details"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., E-Commerce Platform"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="technologies">Technologies *</Label>
                  <Input
                    id="technologies"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/example/project"
                  />
                </div>

                <Button onClick={handleAddProject} className="w-full">
                  {editingId ? "Update Project" : "Add Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Links</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.split(",").map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="space-x-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No projects yet. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsAdmin;
