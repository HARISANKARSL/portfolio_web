import { useState, useEffect, useCallback, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "@/components/ui/use-toast";

import {
  fetchExperiences,
  saveExperience,
  deleteExperience,
  getExperienceById,
  ExperienceItem,
} from "@/services/experience/experience";
import {
  fetchCompanies,
  createCompany,
  deleteCompany,
  Company,
} from "@/services/company/company";
import {
  fetchTitles,
  createTitle,
  deleteTitle,
  Title,
} from "@/services/title/title";
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
import SectionHeader from "@/components/SectionHeader";
import DataTable, { DataTableColumn } from "@/components/DataTable";
import TableToolbar from "@/components/TableToolbar";
import ExperienceCard from "@/components/ExperienceCard";
import { FilterProvider, useFilter } from "@/components/FilterContext";

type ViewType = "table" | "grid";

const ExperienceAdmin = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isSavingExperience, setIsSavingExperience] = useState(false);
  const [isFetchingExperience, setIsFetchingExperience] = useState(false);

  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
  });
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  const [deleteCompanyDialogOpen, setDeleteCompanyDialogOpen] = useState(false);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  const [titleOpen, setTitleOpen] = useState(false);
  const [titleData, setTitleData] = useState({
    name: "",
    description: "",
  });
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  const [deleteTitleDialogOpen, setDeleteTitleDialogOpen] = useState(false);
  const [isDeletingTitle, setIsDeletingTitle] = useState(false);
  const [titleToDelete, setTitleToDelete] = useState<string | null>(null);

  // Pagination & View
  const [viewType, setViewType] = useState<ViewType>("table");
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

  // Search & Filters
  const [search, setSearch] = useState("");
  const { setFilterConfig, activeFilters } = useFilter();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Delete Experience Confirmation
  const [deleteExperienceDialogOpen, setDeleteExperienceDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);

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
        ],
      }
    ]);
  }, [setFilterConfig]);

  const loadData = useCallback(
    async (
      currentPage = 1,
      currentPageSize = 10,
      searchQuery = "",
      appliedFilters = {}
    ) => {
      try {
        setIsLoading(true);

        const cleanedFilters = Object.entries(appliedFilters).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
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

        const [expRes, compRes, titleRes] = await Promise.all([
          fetchExperiences(payload),
          fetchCompanies(),
          fetchTitles(),
        ]);

        setExperiences(expRes.data);
        if (expRes.pagination) {
          setPagination(expRes.pagination);
        }
        setCompanies(compRes.data);
        setTitles(titleRes.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData(page, pageSize, search, activeFilters);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(1);
      loadData(1, pageSize, search, activeFilters);
    }, 500);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search, activeFilters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadData(newPage, pageSize, search, activeFilters);
  };

  const handlePageSizeChange = (value: string) => {
    const size = parseInt(value, 10);
    setPageSize(size);
    setPage(1);
    loadData(1, size, search, activeFilters);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExperience = async () => {
    if (
      !formData.company ||
      !formData.title ||
      !formData.startDate ||
      !formData.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setIsSavingExperience(true);
      const payload: Partial<ExperienceItem> = {
        ...formData,
      };
      if (editingId) {
        payload._id = editingId;
        (payload as any).id = editingId;
      }

      await saveExperience(payload);
      toast({
        title: "Success",
        description: `Experience ${editingId ? "updated" : "added"} successfully!`,
      });

      setFormData({
        company: "",
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
      setEditingId(null);
      setOpen(false);
      loadData(page, pageSize, search, activeFilters);
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive",
      });
    } finally {
      setIsSavingExperience(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setExperienceToDelete(id);
    setDeleteExperienceDialogOpen(true);
  };

  const confirmDeleteExperience = async () => {
    if (!experienceToDelete) return;
    try {
      await deleteExperience(experienceToDelete);
      toast({
        title: "Success",
        description: "Experience deleted successfully!",
      });
      loadData(page, pageSize, search, activeFilters);
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    } finally {
      setDeleteExperienceDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const handleEdit = async (experienceRow: ExperienceItem) => {
    try {
      console.log("Edit clicked for row:", experienceRow);
      const targetId = experienceRow._id || (experienceRow as any).id;
      if (!targetId) {
        console.error("No ID found for experience row:", experienceRow);
        return;
      }

      console.log("Fetching experience by ID:", targetId);
      setIsFetchingExperience(true);
      const experience = await getExperienceById(targetId);
      console.log("Fetched experience details:", experience);

      let companyId = experience.company;
      if (companyId && typeof companyId === 'object') {
        companyId = (companyId as any).code || (companyId as any)._id || (companyId as any).id;
      }

      let titleId = experience.title || experience.position;
      if (titleId && typeof titleId === 'object') {
        titleId = (titleId as any).code || (titleId as any)._id || (titleId as any).id;
      }

      setFormData({
        company: companyId as string,
        title: (titleId as string) || "",
        location: experience.location || "",
        startDate: experience.startDate ? experience.startDate.substring(0, 10) : "",
        endDate: experience.endDate ? experience.endDate.substring(0, 10) : "",
        description: experience.description || "",
        currentlyWorking: experience.currentlyWorking || false,
      });
      setEditingId(targetId);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch experience details:", error);
      toast({
        title: "Error",
        description: "Failed to load experience details",
        variant: "destructive",
      });
    } finally {
      setIsFetchingExperience(false);
    }
  };

  const handleDeleteCompanyClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      setCompanyToDelete(id);
      setDeleteCompanyDialogOpen(true);
    }
  };

  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    try {
      setIsDeletingCompany(true);
      await deleteCompany(companyToDelete);
      toast({
        title: "Success",
        description: "Company deleted successfully!",
      });
      const compRes = await fetchCompanies();
      setCompanies(compRes.data);
      if (formData.company === companyToDelete) {
        setFormData((prev) => ({ ...prev, company: "" }));
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive",
      });
    } finally {
      setIsDeletingCompany(false);
      setDeleteCompanyDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleCreateCompany = async () => {
    if (!companyData.name) {
      alert("Please enter a company name");
      return;
    }
    try {
      setIsSavingCompany(true);
      const newCompany = await createCompany(companyData);
      toast({
        title: "Success",
        description: "Company created successfully!",
      });
      setCompanyOpen(false);
      setCompanyData({ name: "", description: "" });
      const compRes = await fetchCompanies();
      setCompanies(compRes.data);
      if (newCompany) {
        const newId = newCompany.code || newCompany._id || (newCompany as any).id;
        if (newId) {
          setFormData((prev) => ({ ...prev, company: newId }));
        }
      }
    } catch (error) {
      console.error("Error creating company:", error);
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive",
      });
    } finally {
      setIsSavingCompany(false);
    }
  };

  const handleDeleteTitleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      setTitleToDelete(id);
      setDeleteTitleDialogOpen(true);
    }
  };

  const confirmDeleteTitle = async () => {
    if (!titleToDelete) return;
    try {
      setIsDeletingTitle(true);
      await deleteTitle(titleToDelete);
      toast({
        title: "Success",
        description: "Title deleted successfully!",
      });
      const titleRes = await fetchTitles();
      setTitles(titleRes.data);
      if (formData.title === titleToDelete) {
        setFormData((prev) => ({ ...prev, title: "" }));
      }
    } catch (error) {
      console.error("Error deleting title:", error);
      toast({
        title: "Error",
        description: "Failed to delete title",
        variant: "destructive",
      });
    } finally {
      setIsDeletingTitle(false);
      setDeleteTitleDialogOpen(false);
      setTitleToDelete(null);
    }
  };

  const handleCreateTitle = async () => {
    if (!titleData.name) {
      alert("Please enter a title name");
      return;
    }
    try {
      setIsSavingTitle(true);
      const newTitle = await createTitle(titleData);
      toast({
        title: "Success",
        description: "Title created successfully!",
      });
      setTitleOpen(false);
      setTitleData({ name: "", description: "" });
      const titleRes = await fetchTitles();
      setTitles(titleRes.data);
      if (newTitle) {
        const newId = newTitle.code || newTitle._id || (newTitle as any).id;
        if (newId) {
          setFormData((prev) => ({ ...prev, title: newId }));
        }
      }
    } catch (error) {
      console.error("Error creating title:", error);
      toast({
        title: "Error",
        description: "Failed to create title",
        variant: "destructive",
      });
    } finally {
      setIsSavingTitle(false);
    }
  };

  const getCompanyName = (companyData: any) => {
    if (companyData && typeof companyData === 'object') {
      return companyData.name || '';
    }
    const comp = companies.find((c) => (c.code || c._id || (c as any).id) === companyData);
    return comp ? comp.name : companyData;
  };

  const getTitleName = (titleData: any) => {
    if (titleData && typeof titleData === 'object') {
      return titleData.name || '';
    }
    const t = titles.find((c) => (c.code || c._id || (c as any).id) === titleData);
    return t ? t.name : titleData;
  };

  const tableColumns: DataTableColumn[] = [
    {
      key: "company",
      label: "Company",
      render: (_, row: ExperienceItem) => (
        <span className="font-medium">{getCompanyName(row.company)}</span>
      ),
    },
    {
      key: "title",
      label: "Position",
      render: (_, row: ExperienceItem) => {
        const titleStr = getTitleName(row.title);
        const posStr = getTitleName(row.position);
        return titleStr || posStr;
      },
    },
    {
      key: "location",
      label: "Location",
      render: (_, row: ExperienceItem) => row.location || "-",
    },
    {
      key: "duration",
      label: "Duration",
      render: (_, row: ExperienceItem) => {
        const formatDate = (dateStr?: string) => {
          if (!dateStr) return "Present";
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return dateStr;
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = String(d.getFullYear()).slice(-2);
          return `${day}-${month}-${year}`;
        };
        const dateRange = `${formatDate(row.startDate)} to ${formatDate(row.endDate)}`;
        return row.duration ? `${row.duration} (${dateRange})` : dateRange;
      },
    },
    {
      key: "currentlyWorking",
      label: "Status",
      render: (_, row: ExperienceItem) => (
        row.currentlyWorking ? (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
            Current Role
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-xs font-semibold">
            Previous Role
          </span>
        )
      ),
    }
  ];

  const pageNumbers = Array.from(
    { length: Math.max(pagination.totalPages, 1) },
    (_, index) => index + 1
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Experience Management"
          description="Add, edit, and manage your experience"
          button
          buttonLabel="Add Experience"
          onButtonClick={() => {
            setEditingId(null);
            setFormData({
              company: "",
              title: "",
              location: "",
              startDate: "",
              endDate: "",
              description: "",
              currentlyWorking: false
            });
            setOpen(true);
          }}
        />

        {/* EXPERIENCE FORM DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update your experience details below"
                  : "Fill in your work experience details"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="company">Company *</Label>
                <div className="flex gap-2 items-center">
                  <Select
                    value={formData.company}
                    onValueChange={(val) => handleSelectChange("company", val)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.length === 0 ? (
                        <div className="p-4 text-center flex flex-col items-center gap-3">
                          <p className="text-sm text-muted-foreground">No companies to list.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCompanyOpen(true);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-2" />
                            Create One
                          </Button>
                        </div>
                      ) : (
                        companies.map((comp) => {
                          const id = comp.code || comp._id || (comp as any).id;
                          if (!id) return null;
                          return (
                            <div key={id} className="flex items-center justify-between relative group pr-2">
                              <SelectItem value={id} className="flex-1 pr-10">
                                {comp.name}
                              </SelectItem>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-red-500 opacity-50 hover:opacity-100 hover:bg-red-100 z-50 rounded-md"
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                }}
                                onClick={(e) => handleDeleteCompanyClick(e, id)}
                                title="Delete company"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>

                  <Dialog open={companyOpen} onOpenChange={setCompanyOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" type="button" title="Create new company">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Company</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="companyName">Name *</Label>
                          <Input
                            id="companyName"
                            value={companyData.name}
                            onChange={(e) =>
                              setCompanyData({ ...companyData, name: e.target.value })
                            }
                            placeholder="e.g. Infosys2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyDesc">Description</Label>
                          <Textarea
                            id="companyDesc"
                            value={companyData.description}
                            onChange={(e) =>
                              setCompanyData({
                                ...companyData,
                                description: e.target.value,
                              })
                            }
                            placeholder="e.g. Consulting company"
                          />
                        </div>
                        <Button
                          onClick={handleCreateCompany}
                          disabled={isSavingCompany}
                          className="w-full"
                        >
                          {isSavingCompany ? "Creating..." : "Create"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={deleteCompanyDialogOpen} onOpenChange={setDeleteCompanyDialogOpen}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the selected company. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingCompany}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.preventDefault();
                            confirmDeleteCompany();
                          }}
                          disabled={isDeletingCompany}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isDeletingCompany ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Position / Title *</Label>
                <div className="flex gap-2 items-center">
                  <Select
                    value={formData.title}
                    onValueChange={(val) => handleSelectChange("title", val)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                    <SelectContent>
                      {titles.length === 0 ? (
                        <div className="p-4 text-center flex flex-col items-center gap-3">
                          <p className="text-sm text-muted-foreground">No titles to list.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setTitleOpen(true);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-2" />
                            Create One
                          </Button>
                        </div>
                      ) : (
                        titles.map((t) => {
                          const id = t.code || t._id || (t as any).id;
                          if (!id) return null;
                          return (
                            <div key={id} className="flex items-center justify-between relative group pr-2">
                              <SelectItem value={id} className="flex-1 pr-10">
                                {t.name}
                              </SelectItem>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-red-500 opacity-50 hover:opacity-100 hover:bg-red-100 z-50 rounded-md"
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                }}
                                onClick={(e) => handleDeleteTitleClick(e, id)}
                                title="Delete title"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>

                  <Dialog open={titleOpen} onOpenChange={setTitleOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" type="button" title="Create new title">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Title</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="titleName">Name *</Label>
                          <Input
                            id="titleName"
                            value={titleData.name}
                            onChange={(e) =>
                              setTitleData({ ...titleData, name: e.target.value })
                            }
                            placeholder="e.g. Senior Developer"
                          />
                        </div>
                        <div>
                          <Label htmlFor="titleDesc">Description</Label>
                          <Textarea
                            id="titleDesc"
                            value={titleData.description}
                            onChange={(e) =>
                              setTitleData({
                                ...titleData,
                                description: e.target.value,
                              })
                            }
                            placeholder="e.g. Lead role"
                          />
                        </div>
                        <Button
                          onClick={handleCreateTitle}
                          disabled={isSavingTitle}
                          className="w-full"
                        >
                          {isSavingTitle ? "Creating..." : "Create"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={deleteTitleDialogOpen} onOpenChange={setDeleteTitleDialogOpen}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the selected title. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingTitle}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.preventDefault();
                            confirmDeleteTitle();
                          }}
                          disabled={isDeletingTitle}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isDeletingTitle ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Bangalore"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    disabled={formData.currentlyWorking}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="currentlyWorking"
                  name="currentlyWorking"
                  checked={formData.currentlyWorking}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="currentlyWorking" className="cursor-pointer">
                  This is my current role
                </Label>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your responsibilities and achievements"
                  rows={4}
                />
              </div>

              <Button onClick={handleAddExperience} className="w-full" disabled={isSavingExperience}>
                {isSavingExperience ? "Saving..." : editingId ? "Update Experience" : "Add Experience"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION DIALOG FOR EXPERIENCE */}
        <AlertDialog open={deleteExperienceDialogOpen} onOpenChange={setDeleteExperienceDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this experience.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  confirmDeleteExperience();
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
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
          searchPlaceholder="Search experience..."
        />

        {/* TABLE VIEW */}
        {viewType === "table" && (
          <>
            <DataTable
              data={experiences || []}
              config={{
                columns: tableColumns,
                columnOrder: [
                  "company",
                  "title",
                  "location",
                  "duration",
                  "currentlyWorking",
                ],
                isLoading: isLoading,
                emptyMessage: "No experience found",
                actions: "Actions",
                actionRender: (exp: ExperienceItem) => (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(exp)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const id = exp._id || (exp as any).id;
                        if (id) handleDeleteClick(id);
                      }}
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
                Loading experiences...
              </div>
            ) : experiences.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {experiences.map((exp) => (
                    <ExperienceCard
                      key={exp._id || Math.random().toString()}
                      experience={exp}
                      companyName={getCompanyName(exp.company)}
                      titleName={getTitleName(exp.title) || getTitleName(exp.position)}
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
                No experiences found
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

const ExperienceAdminWithFilter = () => (
  <FilterProvider>
    <ExperienceAdmin />
  </FilterProvider>
);

export default ExperienceAdminWithFilter;
