"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LeftSidebar from "./community/LeftSidebar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);

  // Define routes where LeftSidebar should be visible
  const sidebarRoutes = [
    "/discover",
    "/trending",
    "/markets",
    "/messages",
    "/saved",
    "/notifications",
    "/logout",
  ];

  useEffect(() => {
    // Update showSidebar state after mount to avoid SSR mismatch
    setShowSidebar(
      pathname.startsWith("/community") || sidebarRoutes.includes(pathname)
    );
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {showSidebar && <LeftSidebar />}
      <div
        className={`flex-1 ${
          showSidebar ? "md:ml-64" : ""
        } pt-20 md:pt-24 pb-20 md:pb-6 px-3 sm:px-4 md:px-6 lg:px-8`}
      >
        {children}
      </div>
    </div>
  );
}
