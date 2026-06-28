import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ExternalLink,
  Edit,
  Trash2,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import SectionHeader from "@/components/SectionHeader";
import DataTable, {
  DataTableColumn,
} from "@/components/DataTable";

import TableToolbar from "@/components/TableToolbar";
import FormRow, {
  FormFieldConfig,
} from "@/components/FormRow";

import { toast } from "@/components/ui/use-toast";
import { FilterProvider, useFilter } from "@/components/FilterContext";

import {
  fetchProjects,
  saveProject,
  deleteProject,
} from "@/services/projects/projectsservice";
import { fetchSkillOptions } from "@/services/techstacks/techstack";

interface Project {
  _id: string;
  name: string;
  description?: string;
  technologies?: any; // String or Array depending on backend
  link?: string;
  githubUrl?: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

type ViewType = "table" | "grid";

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("table");
  const [skillOptions, setSkillOptions] = useState<{ label: string, value: string }[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Search & Global Filters
  const [search, setSearch] = useState("");
  const { setFilterConfig, activeFilters } = useFilter();

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Dialog
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete Confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: [] as string[],
    link: "",
    githubUrl: "",
    image: "",
    status: "active"
  });
  console.log("form", formData);

  useEffect(() => {
    fetchSkillOptions().then((data) => {
      setSkillOptions(
        data.map((item: any) => {
          if (typeof item === 'string') {
            return { label: item, value: item };
          }
          const idKey = Object.keys(item).find(key => key.toLowerCase().endsWith('id'));
          const idValue = idKey ? item[idKey] : undefined;
          return {
            label: item.label || item.name || item.title || String(item),
            value: item.value || item.code || item._id || item.id || idValue || item.name || String(item),
          };
        })
      );
    }).catch(console.error);
  }, []);

  // Configure popover filters on mount
  useEffect(() => {
    setFilterConfig([
      {
        id: "status",
        label: "Status",
        type: "select",
        iconType: "status",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ]
      }
    ]);
  }, [setFilterConfig]);

  // FORM CONFIG
  const formFieldsConfig: FormFieldConfig[] = [
    {
      id: "name",
      name: "name",
      type: "text",
      label: "Project Name",
      placeholder: "E-Commerce Platform",
      value: formData.name,
      required: true,
      disabled: isSaving,
    },
    {
      id: "technologies",
      name: "technologies",
      type: "multi-select",
      label: "Technologies",
      placeholder: "Select technologies...",
      value: formData.technologies,
      options: skillOptions,
      disabled: isSaving,
    },
    {
      id: "link",
      name: "link",
      type: "text",
      label: "Live URL",
      placeholder: "https://example.com",
      value: formData.link,
      disabled: isSaving,
    },
    {
      id: "githubUrl",
      name: "githubUrl",
      type: "text",
      label: "GitHub URL",
      placeholder: "https://github.com/example/project",
      value: formData.githubUrl,
      disabled: isSaving,
    },
    {
      id: "image",
      name: "image",
      type: "text",
      label: "Image URL",
      placeholder: "https://example.com/image.png",
      value: formData.image,
      disabled: isSaving,
    },
    {
      id: "description",
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Describe your project...",
      value: formData.description,
      disabled: isSaving,
    },
    {
      id: "status",
      name: "status",
      type: "select",
      label: "Status",
      placeholder: "Select Status",
      value: formData.status,
      required: true,
      disabled: isSaving,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ]
    }
  ];

  // FETCH PROJECTS
  const loadProjects = useCallback(
    async (
      currentPage = 1,
      currentPageSize = 10,
      searchQuery = "",
      appliedFilters = {}
    ) => {
      try {
        setIsLoading(true);

        const cleanedFilters = Object.entries(
          appliedFilters
        ).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            if (
              value !== undefined &&
              value !== null &&
              value !== ""
            ) {
              acc[key] = value as string;
            }
            return acc;
          },
          {}
        );

        const payload = {
          search: searchQuery,
          page: currentPage,
          limit: currentPageSize,
          filters: cleanedFilters,
        };

        const res = await fetchProjects(payload as any);
        const projectData = res?.data || [];
        setProjects(projectData);

        if (res?.pagination) {
          setPagination(res.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // INITIAL LOAD
  useEffect(() => {
    loadProjects(page, pageSize, search, activeFilters);
  }, []);

  // SEARCH / FILTER debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      loadProjects(1, pageSize, search, activeFilters);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [search, activeFilters]);

  // FIELD CHANGE
  const handleFieldChange = (
    fieldId: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // ADD / EDIT PROJECT
  const handleAddProject = async () => {
    if (!formData.name) {
      toast({
        title: "Required Field Missing",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const payload: any = {
        ...(editingId ? { _id: editingId } : {}),
        name: formData.name,
        status: formData.status || "active",
      };

      if (formData.description !== undefined) {
        payload.description = formData.description.trim();
      }
      payload.technologies = formData.technologies || [];
      if (formData.link !== undefined) {
        payload.link = formData.link.trim();
      }
      if (formData.githubUrl !== undefined) {
        payload.githubUrl = formData.githubUrl.trim();
      }
      if (formData.image !== undefined) {
        payload.image = formData.image.trim();
      }

      const result = await saveProject(payload);
      console.log("Project saved successfully:", result);

      toast({
        title: "Success",
        description: `Project "${formData.name}" saved successfully!`,
      });

      // Reset form and close dialog
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        technologies: [],
        link: "",
        githubUrl: "",
        image: "",
        status: "active"
      });
      setOpen(false);

      // Refresh the projects list from the API
      await loadProjects(page, pageSize, search, activeFilters);
    } catch (error) {
      console.error("Failed to save project:", error);
      toast({
        title: "Error Saving Project",
        description: "Failed to save the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE
  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      setIsLoading(true);
      await deleteProject(projectToDelete);
      console.log("Project deleted successfully:", projectToDelete);
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      await loadProjects(page, pageSize, search, activeFilters);
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast({
        title: "Error Deleting Project",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // EDIT
  const handleEdit = (project: Project) => {
    setEditingId(project._id);
    let techArr: string[] = [];
    if (typeof project.technologies === "string" && project.technologies !== "") {
      techArr = project.technologies.split(",");
    } else if (Array.isArray(project.technologies)) {
      techArr = project.technologies.map((t: any) => {
        if (typeof t === 'string') return t;
        const idKey = Object.keys(t).find(key => key.toLowerCase().endsWith('id'));
        return t.value || t.code || t._id || t.id || (idKey ? t[idKey] : undefined) || t.name || t;
      });
    }

    setFormData({
      name: project.name || "",
      description: project.description || "",
      technologies: techArr,
      link: project.link || "",
      githubUrl: project.githubUrl || "",
      image: project.image || "",
      status: project.status || "active",
    });
    setOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadProjects(newPage, pageSize, search, activeFilters);
  };

  const handlePageSizeChange = (value: string) => {
    const size = parseInt(value, 10);
    setPageSize(size);
    setPage(1);
    loadProjects(1, size, search, activeFilters);
  };

  // TABLE COLUMNS
  const tableColumns: DataTableColumn[] = [
    {
      key: "name",
      label: "Project Name",
      render: (_, row) => (
        <span className="font-medium">{row?.name}</span>
      ),
    },
    {
      key: "technologies",
      label: "Technologies",
      render: (_, row) => {
        let techArr: any[] = [];
        if (typeof row?.technologies === "string") {
          techArr = row.technologies.split(",");
        } else if (Array.isArray(row?.technologies)) {
          techArr = row.technologies;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {techArr.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded text-xs"
              >
                {typeof tech === "object" ? tech.name : tech.trim()}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "link",
      label: "Links",
      render: (_, row) => (
        <div className="flex space-x-2">
          {row?.link && (
            <a
              href={row.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-3 h-3" />
              Live
            </a>
          )}
          {row?.githubUrl && (
            <a
              href={row.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ExternalLink className="w-3 h-3" />
              GitHub
            </a>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const isActive = value?.toLowerCase() === "active";
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${isActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
              }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
  ];

  const pageNumbers = Array.from(
    { length: Math.max(pagination.totalPages, 1) },
    (_, index) => index + 1
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <SectionHeader
          title="Projects Management"
          description="Manage and showcase your portfolio projects"
          button={true}
          buttonLabel="Add Project"
          onButtonClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              description: "",
              technologies: [],
              link: "",
              githubUrl: "",
              image: "",
              status: "active"
            });
            setOpen(true);
          }}
        />

        {/* TOOLBAR (Search, Filters, View Toggle) */}
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewChange={setViewType}
          searchPlaceholder="Search projects..."
        />

        {/* DATA */}
        {viewType === "table" ? (
          <>
            <DataTable
              data={projects || []}
              config={{
                columns: tableColumns,
                columnOrder: ["name", "technologies", "link", "status"],
                isLoading: isLoading,
                emptyMessage: "No projects found",
                actions: "Actions",
                actionRender: (project: Project) => (
                  <div className="flex justify-end gap-2">
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
                      onClick={() => handleDeleteClick(project._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ),
              }}
            />
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={!pagination.hasPreviousPage}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {pageNumbers.map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(p)}
                        className="w-8 h-8 p-0"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {isLoading ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Loading projects...
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="relative group bg-card border rounded-lg p-5">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{project.description}</p>

                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(project)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(project._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No projects found.
              </div>
            )}
          </div>
        )}

        {/* CREATE / EDIT DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Project" : "Add Project"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update the details of this project."
                  : "Add a new project to your portfolio."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {formFieldsConfig.map((field) => (
                <FormRow
                  key={field.id}
                  field={field}
                  onChange={(value) =>
                    handleFieldChange(field.id, value)
                  }
                />
              ))}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddProject} disabled={isSaving}>
                  {isSaving
                    ? "Saving..."
                    : editingId
                      ? "Update Project"
                      : "Save Project"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isLoading ? "Deleting..." : "Delete Project"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

const ProjectsAdminWrapper = () => (
  <FilterProvider>
    <ProjectsAdmin />
  </FilterProvider>
);

export default ProjectsAdminWrapper;
