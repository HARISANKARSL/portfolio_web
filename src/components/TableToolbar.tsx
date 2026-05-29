import { Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;

  viewType: "table" | "grid";
  onViewChange: (view: "table" | "grid") => void;

  searchPlaceholder?: string;
}

const TableToolbar = ({
  searchValue,
  onSearchChange,
  viewType,
  onViewChange,
  searchPlaceholder = "Search...",
}: TableToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="max-w-sm w-full">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant={
            viewType === "table"
              ? "default"
              : "outline"
          }
          size="sm"
          onClick={() => onViewChange("table")}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={
            viewType === "grid"
              ? "default"
              : "outline"
          }
          size="sm"
          onClick={() => onViewChange("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TableToolbar;