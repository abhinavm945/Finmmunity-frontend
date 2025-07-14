"use client";

import { ReactNode } from "react";
import { useResponsive } from "../../hooks/useResponsive";

interface ResponsiveProviderProps {
  children: ReactNode;
}

export default function ResponsiveProvider({
  children,
}: ResponsiveProviderProps) {
  const responsive = useResponsive();

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
