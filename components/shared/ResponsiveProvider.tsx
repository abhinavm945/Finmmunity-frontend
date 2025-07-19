"use client";

import { ReactNode, useState, useEffect } from "react";
import { useResponsive } from "../../hooks/useResponsive";

interface ResponsiveProviderProps {
  children: ReactNode;
}

export default function ResponsiveProvider({
  children,
}: ResponsiveProviderProps) {
  const responsive = useResponsive();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Optionally, render a loading spinner or just a div with min-height
    return <div style={{ minHeight: "100vh" }} />;
  }

  return (
    <div
      className={`responsive-provider ${
        responsive.isMobile ? "mobile" : "desktop"
      }`}
    >
      {children}
    </div>
  );
}
