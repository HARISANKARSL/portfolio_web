import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Wrench, FolderKanban, BarChart3, Mail, LogIn } from "lucide-react";
import { authService } from "@/services/authService";

const navItems = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/about", label: "About", icon: User },
  { path: "/skills", label: "Skills", icon: Wrench },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/contact", label: "Contact", icon: Mail },
];

const MobileNav = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  return (
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
        <Link
          to={isAuthenticated ? "/admin/skills" : "/login"}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
            location.pathname.startsWith("/admin") || location.pathname === "/login"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <div className={`p-1 rounded-lg transition-all duration-200 ${
            location.pathname.startsWith("/admin") || location.pathname === "/login" ? "bg-primary/10" : ""
          }`}>
            <LogIn className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">
            {isAuthenticated ? "Admin" : "Login"}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
