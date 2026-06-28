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
  Trash2,
  Edit,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import SectionHeader from "@/components/SectionHeader";
import DataTable, {
  DataTableColumn,
} from "@/components/DataTable";

import SkillCard from "@/components/SkillCard";
import TableToolbar from "@/components/TableToolbar";

import FormRow, {
  FormFieldConfig,
} from "@/components/FormRow";

import { toast } from "@/components/ui/use-toast";
import DynamicIcon from "@/components/DynamicIcon";
import { FilterProvider, useFilter } from "@/components/FilterContext";

import {
  createSkillStack,
  fetchTechStack,
  deleteSkillStack,
} from "@/services/techstacks/techstack";

interface Skill {
  _id: string;
  userId?: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

type ViewType = "table" | "grid";

const SkillsAdmin = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("table");

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
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    image: "",
    status: "active"
  });

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
      label: "Skill Name",
      placeholder: "React",
      value: formData.name,
      required: true,
      disabled: isSaving,
    },
    {
      id: "icon",
      name: "icon",
      type: "text",
      label: "Icon",
      placeholder: "Add Icon",
      value: formData.icon,
      disabled: isSaving,
    },
    {
      id: "image",
      name: "image",
      type: "text",
      label: "Image",
      placeholder: "Add Image URL",
      value: formData.image,
      disabled: isSaving,
    },
    {
      id: "description",
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Frontend Library",
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

  // FETCH SKILLS
  const fetchSkills = useCallback(
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

        const res = await fetchTechStack(payload as any);
        const skillsData = res?.data || [];
        setSkills(skillsData);

        if (res?.pagination) {
          setPagination(res.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // INITIAL LOAD
  useEffect(() => {
    fetchSkills(page, pageSize, search, activeFilters);
  }, []);

  // SEARCH / FILTER debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      fetchSkills(1, pageSize, search, activeFilters);
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
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value as string,
    }));
  };

  // ADD / EDIT SKILL
  const handleAddSkill = async () => {
    if (!formData.name) {
      toast({
        title: "Required Field Missing",
        description: "Skill name is required.",
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
      if (formData.icon !== undefined) {
        payload.icon = formData.icon.trim();
      }
      if (formData.image !== undefined) {
        payload.image = formData.image.trim();
      }

      const result = await createSkillStack(payload);
      console.log("Skill saved successfully:", result);

      toast({
        title: "Success",
        description: `Skill "${formData.name}" saved successfully!`,
      });

      // Reset form and close dialog
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        icon: "",
        image: "",
        status: "active"
      });
      setOpen(false);

      // Refresh the skills list from the API
      await fetchSkills(page, pageSize, search, activeFilters);
    } catch (error) {
      console.error("Failed to save skill:", error);
      toast({
        title: "Error Saving Skill",
        description: "Failed to save the skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE
  const handleDeleteClick = (id: string) => {
    setSkillToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!skillToDelete) return;

    try {
      setIsLoading(true);
      await deleteSkillStack(skillToDelete);
      console.log("Skill deleted successfully:", skillToDelete);
      toast({
        title: "Success",
        description: "Skill deleted successfully!",
      });
      await fetchSkills(page, pageSize, search, activeFilters);
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast({
        title: "Error Deleting Skill",
        description: "Failed to delete the skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setSkillToDelete(null);
    }
  };

  // EDIT - Synchronous and instant opening, avoiding the global list loader issue
  const handleEdit = (skill: Skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name || "",
      description: skill.description || "",
      icon: skill.icon || "",
      image: skill.image || "",
      status: skill.status || "active",
    });
    setOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchSkills(newPage, pageSize, search, activeFilters);
  };

  const handlePageSizeChange = (value: string) => {
    const size = parseInt(value, 10);
    setPageSize(size);
    setPage(1);
    fetchSkills(1, size, search, activeFilters);
  };

  // TABLE COLUMNS
  const tableColumns: DataTableColumn[] = [
    {
      key: "name",
      label: "Skill Name",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row?.icon && (
            <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded text-foreground flex items-center justify-center shrink-0">
              <DynamicIcon name={row.icon} className="w-4 h-4" />
            </div>
          )}
          <span className="font-medium">{row?.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (_, row) => {
        return (
          <span>
            {row?.description || "-"}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const isActive = value?.toLowerCase() === "active";
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              isActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "-",
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
          title="Skills Management"
          description="Add, edit, and manage your skills"
          button
          buttonLabel="Add Skill"
          onButtonClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              description: "",
              icon: "",
              image: "",
              status: "active"
            });
            setOpen(true);
          }}
        />

        {/* DIALOG */}
        <Dialog
          open={open}
          onOpenChange={(val) => {
            if (!isSaving) setOpen(val);
          }}
        >
          <DialogContent className={isSaving ? "pointer-events-none" : ""}>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Skill" : "Add Skill"}
              </DialogTitle>
              <DialogDescription>
                Fill skill details below
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {formFieldsConfig.map((field) => (
                <FormRow
                  key={field.id}
                  field={field}
                  onChange={(value) =>
                    handleFieldChange(field.id, value)
                  }
                />
              ))}

              <Button
                className="w-full gap-2 relative"
                onClick={handleAddSkill}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    {editingId ? "Updating Skill..." : "Adding Skill..."}
                  </>
                ) : (
                  editingId ? "Update Skill" : "Add Skill"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION DIALOG */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this skill.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  confirmDelete();
                }}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* TOOLBAR */}
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewChange={setViewType}
          searchPlaceholder="Search skills..."
        />

        {/* TABLE VIEW */}
        {viewType === "table" && (
          <>
            <DataTable
              data={skills || []}
              config={{
                columns: tableColumns,
                columnOrder: [
                  "name",
                  "description",
                  "status",
                  "createdAt",
                ],
                isLoading: isLoading,
                emptyMessage: "No skills found",
                actions: "Actions",
                actionRender: (skill: Skill) => (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(skill)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(skill._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ),
              }}
            />

            {/* PAGINATION */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="text-sm">Page Size</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>

                {pageNumbers.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

        {/* GRID VIEW */}
        {viewType === "grid" && (
          <>
            {isLoading ? (
              <div className="text-center py-10">
                Loading skills...
              </div>
            ) : skills.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill) => (
                    <SkillCard
                      key={skill._id}
                      skill={skill}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </Button>

                  {pageNumbers.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                No skills found
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

const SkillsAdminWithFilter = () => (
  <FilterProvider>
    <SkillsAdmin />
  </FilterProvider>
);

export default SkillsAdminWithFilter;