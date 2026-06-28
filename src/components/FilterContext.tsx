import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FilterField {
  id: string;
  label: string;
  type: "text" | "select" | "date";
  iconType: "text" | "calendar" | "status" | "user" | "file" | "priority";
  placeholder?: string;
  options?: { label: string; value: any }[];
}

interface FilterContextType {
  showFilterButton: boolean;
  setShowFilterButton: (show: boolean) => void;
  filterConfig: FilterField[];
  setFilterConfig: (config: FilterField[]) => void;
  activeFilters: Record<string, any>;
  setActiveFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [filterConfig, setFilterConfig] = useState<FilterField[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const clearFilters = () => {
    setActiveFilters({});
  };

  return (
    <FilterContext.Provider
      value={{
        showFilterButton,
        setShowFilterButton,
        filterConfig,
        setFilterConfig,
        activeFilters,
        setActiveFilters,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
