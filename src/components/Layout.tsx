import { ReactNode } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen overflow-hidden">
      <DesktopNav />
      <main className="pt-0 md:pt-16 pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export default Layout;
