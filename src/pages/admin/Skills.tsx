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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchTechStack } from "@/services/techstacks/techstack";
import { useEffect } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
}

const SkillsAdmin = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setIsLoading(true);
        const res = await fetchTechStack({ limit: 100 });
        setSkills(res.data);
      } catch (error) {
        console.error("Failed to load skills:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSkills();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    proficiency: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (!formData.name || !formData.category || !formData.proficiency) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      setSkills(
        skills.map((skill) =>
          skill.id === editingId
            ? { ...skill, ...formData }
            : skill
        )
      );
      setEditingId(null);
    } else {
      setSkills([
        ...skills,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
    }

    setFormData({ name: "", category: "", proficiency: "" });
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      setSkills(skills.filter((skill) => skill.id !== id));
    }
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });
    setEditingId(skill.id);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Skills Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Add, edit, and manage your skills
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", category: "", proficiency: "" });
                }}
              >
                + Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Skill" : "Add New Skill"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update the skill details below"
                    : "Fill in the skill details to add a new skill"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Skill Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., React"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Language">Language</SelectItem>
                      <SelectItem value="Tool">Tool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="proficiency">Proficiency Level</Label>
                  <Select
                    value={formData.proficiency}
                    onValueChange={(value) =>
                      handleSelectChange("proficiency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddSkill} className="w-full">
                  {editingId ? "Update Skill" : "Add Skill"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading skills...
                  </TableCell>
                </TableRow>
              ) : skills.length > 0 ? (
                skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>{skill.category}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {skill.proficiency}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
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
                        onClick={() => handleDelete(skill.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No skills yet. Add one to get started!
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

export default SkillsAdmin;
