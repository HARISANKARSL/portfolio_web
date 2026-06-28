import React, { useState, useEffect, useMemo } from "react";
import { 
  Type, 
  Calendar, 
  CircleDot, 
  User, 
  Paperclip, 
  AlertTriangle, 
  Search, 
  X, 
  Plus, 
  RefreshCw 
} from "lucide-react";
import { useFilter } from "./FilterContext";

const iconMap: Record<string, React.ComponentType<any>> = {
  text: Type,
  calendar: Calendar,
  status: CircleDot,
  user: User,
  file: Paperclip,
  priority: AlertTriangle,
};

interface DynamicFilterProps {
  onClose: () => void;
}

const DynamicFilter: React.FC<DynamicFilterProps> = ({ onClose }) => {
  const { filterConfig, activeFilters, setActiveFilters, clearFilters } = useFilter();
  
  // Search query for filtering available filters
  const [searchQuery, setSearchQuery] = useState("");
  
  // Track which filters are locally activated/added
  const [activatedIds, setActivatedIds] = useState<Set<string>>(new Set());
  
  // Local values of the inputs
  const [localValues, setLocalValues] = useState<Record<string, any>>({});

  // Sync with context on mount/change
  useEffect(() => {
    const initialValues = activeFilters || {};
    setLocalValues(initialValues);

    const activeIds = new Set<string>();
    Object.keys(initialValues).forEach((key) => {
      if (initialValues[key] !== undefined && initialValues[key] !== null && initialValues[key] !== "") {
        activeIds.add(key);
      }
    });
    
    // Always keep at least the first filter active by default if nothing is active
    if (activeIds.size === 0 && filterConfig.length > 0) {
      activeIds.add(filterConfig[0].id);
    }

    setActivatedIds(activeIds);
  }, [activeFilters, filterConfig]);

  const handleInputChange = (id: string, value: any) => {
    setLocalValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleActivateFilter = (id: string) => {
    setActivatedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setSearchQuery(""); // Clear search to show the added filter
  };

  const handleDeactivateFilter = (id: string) => {
    setActivatedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setLocalValues((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedFilters: Record<string, any> = {};
    activatedIds.forEach((id) => {
      const val = localValues[id];
      if (val !== undefined && val !== null && val !== "") {
        cleanedFilters[id] = val;
      }
    });
    setActiveFilters(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setActivatedIds(new Set(filterConfig.length > 0 ? [filterConfig[0].id] : []));
    setLocalValues({});
    clearFilters();
    onClose();
  };

  // Group filterConfig into active (activated) and available (not activated)
  const activeFields = useMemo(() => {
    return filterConfig.filter((field) => activatedIds.has(field.id));
  }, [filterConfig, activatedIds]);

  const availableFields = useMemo(() => {
    return filterConfig.filter(
      (field) => 
        !activatedIds.has(field.id) && 
        field.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filterConfig, activatedIds, searchQuery]);

  return (
    <div className="absolute right-0 mt-3 w-80 z-[100] border border-[#2b2d31] rounded-xl bg-[#18191b] shadow-[0_12px_40px_rgba(0,0,0,0.65)] overflow-hidden transition-all duration-300">
      
      {/* Search Bar - Filter By... */}
      <div className="relative border-b border-[#2b2d31] p-3">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Filter by..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111214] border border-[#2b2d31] focus:border-primary/60 text-foreground text-sm rounded-lg pl-9 pr-8 py-2 outline-none transition-colors placeholder:text-muted-foreground/35"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-h-[300px] overflow-y-auto p-3 space-y-4">
        
        {/* Active Filters Section */}
        {activeFields.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-mono text-[0.65rem] tracking-wider text-muted-foreground/50 uppercase px-1">
              Active Filters
            </h4>
            <div className="space-y-2.5">
              {activeFields.map((field) => {
                const IconComponent = iconMap[field.iconType] || Type;
                return (
                  <div key={field.id} className="p-2.5 rounded-lg bg-[#202225]/50 border border-[#2b2d31]/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <IconComponent className="w-3.5 h-3.5 text-primary/80" />
                        <span>{field.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeactivateFilter(field.id)}
                        className="text-muted-foreground/40 hover:text-rose-400 p-0.5 rounded transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {field.type === "text" && (
                      <input
                        type="text"
                        placeholder={field.placeholder || "Enter value..."}
                        value={localValues[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full bg-[#111214] border border-[#2b2d31] focus:border-primary/50 text-foreground text-xs rounded-md px-2.5 py-1.5 outline-none transition-colors placeholder:text-muted-foreground/20"
                      />
                    )}

                    {field.type === "date" && (
                      <input
                        type="date"
                        value={localValues[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full bg-[#111214] border border-[#2b2d31] focus:border-primary/50 text-foreground text-xs rounded-md px-2.5 py-1.5 outline-none transition-colors"
                      />
                    )}

                    {field.type === "select" && (
                      <select
                        value={localValues[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full bg-[#111214] border border-[#2b2d31] focus:border-primary/50 text-foreground text-xs rounded-md px-2.5 py-1.5 outline-none transition-colors cursor-pointer"
                      >
                        <option value="" className="bg-[#18191b] text-muted-foreground/60">
                          Select option...
                        </option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#18191b] text-foreground">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Filters Section */}
        {availableFields.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-mono text-[0.65rem] tracking-wider text-muted-foreground/50 uppercase px-1">
              Available Properties
            </h4>
            <div className="space-y-0.5">
              {availableFields.map((field) => {
                const IconComponent = iconMap[field.iconType] || Type;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => handleActivateFilter(field.id)}
                    className="w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-350 hover:bg-[#202225] hover:text-foreground transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">{field.label}</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground/50 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* If no properties left */}
        {availableFields.length === 0 && activeFields.length === filterConfig.length && (
          <div className="text-center py-2 text-xs font-mono text-muted-foreground/40">
            All filters active
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center gap-2 p-3 border-t border-[#2b2d31] bg-[#111214]/40">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-[#2b2d31] hover:border-rose-500/20 text-xs font-mono tracking-wide text-muted-foreground hover:text-rose-400 rounded-lg bg-transparent hover:bg-rose-500/5 transition-all duration-200"
        >
          <RefreshCw className="w-3 h-3" />
          RESET
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-2 w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-mono tracking-wide font-bold rounded-lg transition-colors shadow-md"
        >
          APPLY_FILTERS
        </button>
      </div>
    </div>
  );
};

export default DynamicFilter;
