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

import FormRow, {
  FormFieldConfig,
} from "@/components/FormRow";

import { fetchTechStack } from "@/services/techstacks/techstack";

interface Skill {
  _id: string;
  userId?: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  category?: string;

  status: string;
  createdAt: string;
  updatedAt: string;
}

type ViewType = "table" | "grid";

const SkillsAdmin = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    category: "",
  
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
      },

      {
        id: "description",
        name: "description",
        type: "text",
        label: "Description",
        placeholder: "Frontend Library",
        value: formData.description,
      },

      {
        id: "category",
        name: "category",
        type: "select",
        label: "Category",
        placeholder: "Select Category",
        value: formData.category,

        options: [
          {
            label: "Frontend",
            value: "Frontend",
          },
          {
            label: "Backend",
            value: "Backend",
          },
          {
            label: "Database",
            value: "Database",
          },
          {
            label: "DevOps",
            value: "DevOps",
          },
        ],
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

  // ADD SKILL
  const handleAddSkill = () => {
    if (!formData.name) {
      alert("Skill name required");
      return;
    }

    const newSkill: Skill = {
      _id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
    
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setSkills((prev) =>
        prev.map((skill) =>
          skill._id === editingId
            ? {
                ...skill,
                ...newSkill,
              }
            : skill
        )
      );
    } else {
      setSkills((prev) => [
        newSkill,
        ...prev,
      ]);
    }

    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      category: "",
  
    });

    setOpen(false);
  };

  // DELETE
  const handleDelete = (id: string) => {
    const confirmDelete = confirm(
      "Delete this skill?"
    );

    if (!confirmDelete) return;

    setSkills((prev) =>
      prev.filter((skill) => skill._id !== id)
    );
  };

  // EDIT
  const handleEdit = (skill: Skill) => {
    setEditingId(skill._id);

    setFormData({
      name: skill.name || "",
      description:
        skill.description || "",
      category: skill.category || "",
  
    });

    setOpen(true);
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
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                isActive
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
              category: "",
            
            });

            setOpen(true);
          }}
        />

        {/* DIALOG */}
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogContent>
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
                className="w-full"
                onClick={handleAddSkill}
              >
                {editingId
                  ? "Update Skill"
                  : "Add Skill"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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

                // SEARCH
                search: true,
                searchPlaceholder:
                  "Search skills...",
                searchValue: search,
                onSearchChange:
                  setSearch,

                // VIEW
                viewType: viewType,
                onViewChange:
                  setViewType,

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