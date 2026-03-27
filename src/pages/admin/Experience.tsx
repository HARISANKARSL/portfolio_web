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
import { Trash2, Edit } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentRole: boolean;
}

const ExperienceAdmin = () => {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "Tech Company Inc",
      position: "Senior Developer",
      startDate: "2022-01",
      endDate: "Present",
      description: "Led development of web applications",
      isCurrentRole: true,
    },
  ]);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrentRole: false,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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

  const handleAddExperience = () => {
    if (
      !formData.company ||
      !formData.position ||
      !formData.startDate ||
      !formData.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      setExperiences(
        experiences.map((exp) =>
          exp.id === editingId
            ? { ...exp, ...formData }
            : exp
        )
      );
      setEditingId(null);
    } else {
      setExperiences([
        ...experiences,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
    }

    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrentRole: false,
    });
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description,
      isCurrentRole: experience.isCurrentRole,
    });
    setEditingId(experience.id);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Experience Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Add, edit, and manage your work experience
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    isCurrentRole: false,
                  });
                }}
              >
                + Add Experience
              </Button>
            </DialogTrigger>
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
                <div>
                  <Label htmlFor="company">Company name *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Developer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="month"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="month"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      disabled={formData.isCurrentRole}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCurrentRole"
                    name="isCurrentRole"
                    checked={formData.isCurrentRole}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <Label htmlFor="isCurrentRole" className="cursor-pointer">
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

                <Button onClick={handleAddExperience} className="w-full">
                  {editingId ? "Update Experience" : "Add Experience"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">{exp.company}</TableCell>
                    <TableCell>{exp.position}</TableCell>
                    <TableCell>
                      {exp.startDate} to {exp.endDate || "Present"}
                    </TableCell>
                    <TableCell>
                      {exp.isCurrentRole ? (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                          Current
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                          Previous
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
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
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No experience yet. Add one to get started!
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

export default ExperienceAdmin;
