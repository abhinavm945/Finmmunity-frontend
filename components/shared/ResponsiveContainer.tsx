"use client";

import { ReactNode } from "react";
import { useBreakpoint } from "../../hooks/useResponsive";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function ResponsiveContainer({
  children,
  className = "",
  maxWidth = "7xl",
  padding = "md",
}: ResponsiveContainerProps) {
  const { responsiveClasses } = useBreakpoint();

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-2 py-2",
    md: responsiveClasses.container,
    lg: "px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12",
  };

  return (
    <div
      className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
