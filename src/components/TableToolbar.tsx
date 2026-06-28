import { useState } from "react";
import { Grid, List, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFilter } from "./FilterContext";
import DynamicFilter from "./DynamicFilter";

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
  const { activeFilters } = useFilter();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 max-w-sm flex items-center gap-3">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            className="w-full"
          />

          <div className="relative">
            <Button
              variant={filterOpen || Object.keys(activeFilters).length > 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterOpen(!filterOpen)}
              className="gap-2 relative"
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#a855f7]" />
              )}
            </Button>
            {filterOpen && (
              <DynamicFilter onClose={() => setFilterOpen(false)} />
            )}
          </div>
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
    </div>
  );
};

export default TableToolbar;