import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Terminal, Filter } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useFilter } from "./FilterContext";
import DynamicFilter from "./DynamicFilter";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/common/authService";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/about", label: "About" },
  { path: "/skills", label: "Skills" },
  { path: "/projects", label: "Projects" },
  { path: "/analytics", label: "Analytics" },
  { path: "/contact", label: "Contact" },
];

const DesktopNav = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { showFilterButton, activeFilters } = useFilter();
  const [filterOpen, setFilterOpen] = useState(false);
  const isAuthenticated = authService.isAuthenticated();
  console.log(" isAuthenticated:", isAuthenticated);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border hidden md:block">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <Terminal className="w-5 h-5 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-mono text-sm font-semibold text-foreground">
            HARISANKAR<span className="text-primary">()</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="ml-3 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {showFilterButton && (
            <div className="relative ml-1">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`p-2 rounded-md transition-all duration-200 relative ${
                  filterOpen || Object.keys(activeFilters).length > 0
                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
          )}

          {/* {isAuthenticated ? (
            <Link to="/admin/skills">
              <Button variant="default" size="sm" className="ml-2">
                Admin Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="ml-2">
                Login
              </Button>
            </Link>
          )} */}
        </div>
      </nav>
    </header>
  );
};

export default DesktopNav;
