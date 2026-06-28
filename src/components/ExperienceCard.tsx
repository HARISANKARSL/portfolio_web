import { Building2, Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExperienceItem } from "@/services/experience/experience";

interface ExperienceCardProps {
  experience: ExperienceItem;
  companyName: string;
  titleName: string;
  onEdit: (exp: ExperienceItem) => void;
  onDelete: (id: string) => void;
}

const ExperienceCard = ({
  experience,
  companyName,
  titleName,
  onEdit,
  onDelete,
}: ExperienceCardProps) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-all hover:shadow-md h-full">
      <div className="absolute top-4 right-4 flex opacity-0 transition-opacity group-hover:opacity-100 gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 shadow-sm"
          onClick={() => onEdit(experience)}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 shadow-sm"
          onClick={() => {
            const targetId = experience._id || (experience as any).id;
            if (targetId) {
              onDelete(targetId);
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Building2 className="h-4 w-4" />
            <span className="font-medium text-sm text-foreground">
              {companyName}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-none tracking-tight">
            {titleName}
          </h3>
        </div>

        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-muted-foreground">
          {experience.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{experience.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {(() => {
                const formatDate = (dateStr?: string) => {
                  if (!dateStr) return "Present";
                  const d = new Date(dateStr);
                  if (isNaN(d.getTime())) return dateStr;
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  const year = String(d.getFullYear()).slice(-2);
                  return `${day}-${month}-${year}`;
                };
                const dateRange = `${formatDate(experience.startDate)} to ${formatDate(experience.endDate)}`;
                return experience.duration ? `${experience.duration} (${dateRange})` : dateRange;
              })()}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {experience.description || "No description provided."}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        {experience.currentlyWorking ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Current Role
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-400">
            Past Role
          </span>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;
