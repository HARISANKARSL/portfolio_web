import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, BarChart3, Briefcase, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { authService } from "@/services/authService";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      label: "Skills",
      href: "/admin/skills",
      icon: <Award className="w-5 h-5" />,
    },
    {
      label: "Experience",
      href: "/admin/experience",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: "Team",
      href: "/admin/team",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Admin
        </h2>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === item.href
                ? "bg-purple-600 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t">
        <Button
          onClick={() => {
            authService.logout();
          }}
          variant="destructive"
          className="w-full gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="w-full">
              <SidebarContent />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="pt-4 md:pt-0 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
