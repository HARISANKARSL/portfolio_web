import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Wrench, FolderKanban, BarChart3, Mail, Filter } from "lucide-react";
import { authService } from "@/services/common/authService";
import { useFilter } from "./FilterContext";
import DynamicFilter from "./DynamicFilter";

const navItems = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/about", label: "About", icon: User },
  { path: "/skills", label: "Skills", icon: Wrench },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  // { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/contact", label: "Contact", icon: Mail },
];

const MobileNav = () => {
  const location = useLocation();
  const { showFilterButton, activeFilters } = useFilter();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      {showFilterButton && (
        <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border h-14 flex items-center justify-between px-6 md:hidden">
          <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            // Filter Options
          </span>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`p-2 rounded-md transition-all duration-200 relative ${
                filterOpen || Object.keys(activeFilters).length > 0
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              }`}
              aria-label="Open filters"
            >
              <Filter className="w-4 h-4" />
              {Object.keys(activeFilters).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#a855f7]" />
              )}
            </button>
            {filterOpen && (
              <DynamicFilter onClose={() => setFilterOpen(false)} />
            )}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)] overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div className={`p-1 rounded-lg transition-all duration-200 ${isActive ? "bg-primary/10" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
