"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { config as appConfig } from "../../utils/config";

export default function BackendStatus() {
  const [status, setStatus] = useState<
    "checking" | "online" | "offline" | "error"
  >("checking");
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      const backendUrl = appConfig.development.backendUrl;
      const response = await fetch(`${backendUrl}/health`);

      if (response.ok) {
        const data = await response.json();
        if (data.status === "OK") {
          setStatus("online");
        } else {
          setStatus("error");
        }
      } else if (response.status === 404) {
        // 404 means backend is running but health endpoint doesn't exist
        setStatus("offline");
      } else if (response.status === 500) {
        setStatus("error"); // Backend is running but has errors
      } else {
        setStatus("offline");
      }
    } catch (error) {
      console.warn("Backend status check failed:", error);
      setStatus("offline");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Only check if we're in development mode
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      checkBackendStatus();
      // Check every 2 minutes instead of 30 seconds to reduce spam
      const interval = setInterval(checkBackendStatus, 120000);
      return () => clearInterval(interval);
    }
  }, []);

  if (status === "checking") {
    return null; // Don't show anything while checking
  }

  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          icon: <Wifi size={16} />,
          text: "Backend Online",
          className: "bg-green-100 text-green-800 border border-green-200",
        };
      case "error":
        return {
          icon: <WifiOff size={16} />,
          text: "Backend Error (Demo Mode)",
          className: "bg-red-100 text-red-800 border border-red-200",
        };
      case "offline":
        return {
          icon: <WifiOff size={16} />,
          text: "Backend Offline (Demo Mode)",
          className: "bg-orange-100 text-orange-800 border border-orange-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium shadow-lg ${config.className}`}
      >
        {config.icon}
        <span>{config.text}</span>
        <button
          onClick={checkBackendStatus}
          disabled={isChecking}
          className="ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors disabled:opacity-50"
          title="Check backend status"
        >
          <RefreshCw size={12} className={isChecking ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}
