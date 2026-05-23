import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface SkillCardProps {
  skill: {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    image?: string;
    status: string;
  };
  onEdit: (skill: any) => void;
  onDelete: (id: string) => void;
}

const SkillCard = ({ skill, onEdit, onDelete }: SkillCardProps) => {
  return (
    <Card className="p-4 space-y-3 hover:shadow-lg transition-shadow">
      {skill.image && (
        <img
          src={skill.image}
          alt={skill.name}
          className="w-full h-32 object-cover rounded"
        />
      )}
      <div>
        <h3 className="font-bold text-lg">{skill.name}</h3>
        {skill.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {skill.description}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            skill.status === "active"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}
        >
          {skill.status}
        </span>
        <div className="space-x-2 flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(skill)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(skill._id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SkillCard;
