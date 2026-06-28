import { ReactNode } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { FilterProvider, useFilter } from "./FilterContext";

const LayoutContent = ({ children }: { children: ReactNode }) => {
  const { showFilterButton } = useFilter();
  return (
    <div className="min-h-screen overflow-hidden">
      <DesktopNav />
      <main className={`pt-0 ${showFilterButton ? "pt-14 md:pt-16" : "md:pt-16"} pb-20 md:pb-0`}>
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <FilterProvider>
      <LayoutContent>{children}</LayoutContent>
    </FilterProvider>
  );
};

export default Layout;
