import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

import {
  createSkillStack,
  fetchTechStack,
  getSkillStackById,
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

  const [viewType, setViewType] =
    useState<ViewType>("table");

  // Pagination
  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  // Search
  const [search, setSearch] = useState("");

  const debounceTimer =
    useRef<NodeJS.Timeout | null>(null);

  // Dialog
  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    image: ""

  });

  // FORM CONFIG
  const formFieldsConfig: FormFieldConfig[] =
    [
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
      }

      ,
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


    ];

  // FETCH SKILLS
  const fetchSkills = useCallback(
    async (
      currentPage = 1,
      currentPageSize = 10,
      searchQuery = ""
    ) => {
      try {
        setIsLoading(true);

        const payload = {
          search: searchQuery,
          page: currentPage,
          limit: currentPageSize,
        };

        const res = await fetchTechStack(
          payload as any
        );

        console.log("FULL API RESPONSE", res);

        // IMPORTANT FIX
        const skillsData = res?.data || [];

        console.log(
          "SKILLS DATA",
          skillsData
        );

        setSkills(skillsData);

        if (res?.pagination) {
          setPagination(res.pagination);
        }
      } catch (error) {
        console.error(
          "Failed to fetch skills",
          error
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // INITIAL LOAD
  useEffect(() => {
    fetchSkills(page, pageSize, search);
  }, []);

  // SEARCH
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setPage(1);

      fetchSkills(1, pageSize, search);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [search]);

  // FIELD CHANGE
  const handleFieldChange = (
    fieldId: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
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
        status: "active",
      };

      if (formData.description && formData.description.trim() !== "") {
        payload.description = formData.description.trim();
      }
      if (formData.icon && formData.icon.trim() !== "") {
        payload.icon = formData.icon.trim();
      }
      if (formData.image && formData.image.trim() !== "") {
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
      });
      setOpen(false);

      // Refresh the skills list from the API
      await fetchSkills(page, pageSize, search);
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
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Delete this skill?"
    );

    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      await deleteSkillStack(id);
      console.log("Skill deleted successfully:", id);
      toast({
        title: "Success",
        description: "Skill deleted successfully!",
      });
      await fetchSkills(page, pageSize, search);
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast({
        title: "Error Deleting Skill",
        description: "Failed to delete the skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // EDIT
  const handleEdit = async (skill: Skill) => {
    try {
      setIsLoading(true);
      const detailedSkill = await getSkillStackById(skill._id);
      
      setEditingId(detailedSkill._id);
      setFormData({
        name: detailedSkill.name || "",
        description: detailedSkill.description || "",
        icon: detailedSkill.icon || "",
        image: detailedSkill.image || "",
      });
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch skill details:", error);
      toast({
        title: "Error Loading Details",
        description: "Failed to load skill details from backend. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // PAGINATION
  const handlePageChange = (
    newPage: number
  ) => {
    setPage(newPage);

    fetchSkills(newPage, pageSize, search);
  };

  const handlePageSizeChange = (
    value: string
  ) => {
    const size = parseInt(value);

    setPageSize(size);

    fetchSkills(1, size, search);
  };

  // TABLE COLUMNS
  const tableColumns: DataTableColumn[] =
    [
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
          console.log("row", row);
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
          const isActive =
            value?.toLowerCase() ===
            "active";

          return (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${isActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                }`}
            >
              {isActive
                ? "Active"
                : "Inactive"}
            </span>
          );
        },
      },

      {
        key: "createdAt",
        label: "Created",

        render: (value) =>
          value
            ? new Date(
              value
            ).toLocaleDateString()
            : "-",
      },
    ];

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
                {editingId
                  ? "Edit Skill"
                  : "Add Skill"}
              </DialogTitle>

              <DialogDescription>
                Fill skill details below
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {formFieldsConfig.map(
                (field) => (
                  <FormRow
                    key={field.id}
                    field={field}
                    onChange={(value) =>
                      handleFieldChange(
                        field.id,
                        value
                      )
                    }
                  />
                )
              )}

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

                emptyMessage:
                  "No skills found",

                actions: "Actions",

                actionRender: (
                  skill: Skill
                ) => (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleEdit(skill)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDelete(
                          skill._id
                        )
                      }
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ),
              }}
            />

            {/* PAGINATION */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Page Size
                </span>

                <Select
                  value={pageSize.toString()}
                  onValueChange={
                    handlePageSizeChange
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="5">
                      5
                    </SelectItem>

                    <SelectItem value="10">
                      10
                    </SelectItem>

                    <SelectItem value="20">
                      20
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    !pagination.hasPreviousPage
                  }
                  onClick={() =>
                    handlePageChange(
                      page - 1
                    )
                  }
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={() =>
                    handlePageChange(
                      page + 1
                    )
                  }
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
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
export default SkillsAdmin;