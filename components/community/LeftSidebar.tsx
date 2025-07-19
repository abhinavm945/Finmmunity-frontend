"use client";

import { useState, useRef, useEffect } from "react";
import {
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  Heart,
  User,
  TrendingUp,
  Bookmark,
  BarChart2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Avatar from "../shared/Avatar";
import CreatePostDialog from "./CreatePostDialog";
import CreateBlogDialog from "./CreateBlogDialog";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import React from "react";

export default function LeftSidebar() {
  const [openCreate, setOpenCreate] = useState(false);
  const [createType, setCreateType] = useState<"post" | "blog" | null>(null);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();

  // Get the real user from Redux
  const user = useSelector((state: RootState) => state.user.user);

  const sidebarItems = [
    {
      text: "Home",
      icon: <Home />,
      path: `/community${userId ? `?id=${userId}` : ""}`,
    },
    {
      text: "Discover",
      icon: <Search />,
      path: `/community/discover${userId ? `?id=${userId}` : ""}`,
    },
    {
      text: "Trending",
      icon: <TrendingUp />,
      path: `/community/trending${userId ? `?id=${userId}` : ""}`,
    },
    {
      text: "Markets",
      icon: <BarChart2 />,
      path: `/community/markets${userId ? `?id=${userId}` : ""}`,
    },
    { text: "Create", icon: <PlusSquare /> },
    {
      text: "Messages",
      icon: <MessageCircle />,
      path: `/community/messages${userId ? `?id=${userId}` : ""}`,
    },
    {
      text: "Notifications",
      icon: <Heart />,
      path: `/community/notifications${userId ? `?id=${userId}` : ""}`,
    },
    {
      text: "Profile",
      icon: user?.profilePicture ? (
        <Avatar size="xs" image={user.profilePicture} />
      ) : (
        <User size={24} />
      ),
      path:
        user && user.id
          ? `/community/profile?id=${user.id}`
          : "/community/profile",
    },
    {
      text: "Logout",
      icon: <LogOut />,
      path: `/logout${userId ? `?id=${userId}` : ""}`,
    },
  ];

  const mobileItems = [
    sidebarItems.find((item) => item.text === "Home"),
    sidebarItems.find((item) => item.text === "Discover"),
    sidebarItems.find((item) => item.text === "Create"),
    sidebarItems.find((item) => item.text === "Messages"),
    sidebarItems.find((item) => item.text === "Notifications"),
    sidebarItems.find((item) => item.text === "Profile"),
  ].filter(Boolean) as typeof sidebarItems;

  // Helper to get only the path part (without query string)
  const getPath = (url: string) => url.split("?")[0];

  // For mobile indicator: only use tabs with a path
  const mobileNavItems = mobileItems.filter((item) => !!item.path);
  // Find the active tab index for mobile (navigation tabs only)
  const activeMobileIndex = mobileNavItems.findIndex(
    (item) => getPath(pathname) === getPath(item?.path ?? "")
  );

  // Refs for sliding indicator (mobile navigation tabs only)
  const mobileTabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mobileIndicatorStyle, setMobileIndicatorStyle] = useState({
    left: "0px",
    width: "0px",
    opacity: 0,
  });

  useEffect(() => {
    if (activeMobileIndex !== -1 && mobileTabRefs.current[activeMobileIndex]) {
      const el = mobileTabRefs.current[activeMobileIndex];
      const rect = el?.getBoundingClientRect();
      const parentRect = el?.parentElement?.getBoundingClientRect();
      if (rect && parentRect) {
        let width = rect.width * 0.75;
        if (!width || width < 10) width = 32; // fallback min width
        const left = rect.left - parentRect.left + rect.width / 2;
        console.log("Indicator style:", { left, width });
        setMobileIndicatorStyle({
          left: `${left}px`,
          width: `${width}px`,
          opacity: 1,
        });
      }
    } else {
      setMobileIndicatorStyle({ left: "0px", width: "0px", opacity: 0 });
    }
  }, [activeMobileIndex, mobileNavItems.length]);

  // For desktop indicator: only use tabs with a path
  const desktopNavItems = sidebarItems.filter((item) => !!item.path);
  // Find the active tab index for desktop (navigation tabs only)
  const activeDesktopIndex = desktopNavItems.findIndex(
    (item) => getPath(pathname) === getPath(item?.path ?? "")
  );

  // Refs for sliding indicator (desktop)
  const desktopTabRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen flex-col w-64">
        <div className="bg-white h-[72px] w-full border-r border-gray-300"></div>
        <div className="sticky top-[72px] w-full h-[calc(100vh-72px)] bg-white border-r border-gray-300 overflow-y-auto">
          <div className="flex flex-col px-4 relative">
            <h1 className="font-bold my-6 pr-1 text-3xl lg:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">
              FINMUNITY
            </h1>
            <div>
              {sidebarItems.map((item, index) => {
                if (item.path) {
                  // Navigation tab: assign ref for indicator
                  const navIndex = desktopNavItems.findIndex(
                    (navItem) => navItem.text === item.text
                  );
                  return (
                    <div key={index}>
                      <Link href={item.path} className="block">
                        <div
                          ref={(el) => {
                            desktopTabRefs.current[navIndex] = el;
                          }}
                          className={`relative flex items-center gap-3 lg:gap-4 text-black hover:bg-gray-100 cursor-pointer rounded-lg p-2 lg:p-3 my-1 transition-all duration-300 z-0
                              ${
                                getPath(pathname) === getPath(item.path ?? "")
                                  ? "bg-white"
                                  : ""
                              }
                            `}
                        >
                          {/* Icon */}
                          <span className="relative flex items-center justify-center">
                            {item.icon}
                          </span>
                          {/* Text (desktop) */}
                          <span className="hidden md:inline-block flex-1">
                            {item.text}
                          </span>
                          {/* Static blue indicator for active tab (right side) */}
                          {getPath(pathname) === getPath(item.path ?? "") && (
                            <span className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 h-8 w-2 rounded-full bg-blue-500 z-10" />
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                } else if (item.text === "Create") {
                  // Expand/collapse for Create
                  return (
                    <React.Fragment key={index}>
                      <div
                        className={`relative flex items-center gap-3 lg:gap-4 text-black hover:bg-gray-100 cursor-pointer rounded-lg p-2 lg:p-3 my-1 transition-all duration-300 z-0`}
                        onClick={() => setShowCreateOptions((prev) => !prev)}
                      >
                        <span className="relative flex items-center justify-center">
                          {item.icon}
                        </span>
                        <span className="hidden md:inline-block flex-1">
                          {item.text}
                        </span>
                        {/* Chevron indicator */}
                        <span
                          className={`ml-auto transition-transform ${
                            showCreateOptions ? "rotate-90" : "rotate-0"
                          }`}
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M9 18l6-6-6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                      {showCreateOptions && (
                        <div className="flex flex-col ml-8">
                          <button
                            key="create-post"
                            className="flex items-center gap-2 text-black hover:bg-gray-100 rounded-lg p-2 my-1 text-left transition-all duration-200"
                            onClick={() => {
                              setCreateType("post");
                              setShowCreateOptions(false);
                            }}
                          >
                            <PlusSquare size={18} />
                            <span>Create Post</span>
                          </button>
                          <button
                            key="share-analysis"
                            className="flex items-center gap-2 text-black hover:bg-gray-100 rounded-lg p-2 my-1 text-left transition-all duration-200"
                            onClick={() => {
                              setCreateType("blog");
                              setShowCreateOptions(false);
                            }}
                          >
                            <BarChart2 size={18} />
                            <span>Share Analysis</span>
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  );
                } else {
                  // Other non-navigation tabs (e.g., Logout)
                  return (
                    <div
                      key={index}
                      className={`relative flex items-center gap-3 lg:gap-4 text-black hover:bg-gray-100 cursor-pointer rounded-lg p-2 lg:p-3 my-1 transition-all duration-300 z-0`}
                      onClick={() => {
                        if (item.text === "Logout") {
                          router.push("/logout");
                          return;
                        }
                      }}
                    >
                      <span className="relative flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="hidden md:inline-block flex-1">
                        {item.text}
                      </span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="flex justify-between items-center px-2 sm:px-4 py-2 max-w-7xl mx-auto relative">
          <div className="flex justify-around flex-grow relative bg-white">
            {/* Sliding blue indicator for mobile */}
            <span
              className="absolute bottom-0 h-1 rounded-full bg-blue-500 transition-all duration-300 z-10"
              style={{
                left:
                  mobileIndicatorStyle.left !== "0px" &&
                  mobileIndicatorStyle.width !== "0px"
                    ? mobileIndicatorStyle.left
                    : "16%", // fallback: under first tab (roughly)
                width:
                  mobileIndicatorStyle.width !== "0px"
                    ? mobileIndicatorStyle.width
                    : "32px", // fallback width
                opacity:
                  mobileIndicatorStyle.opacity !== 0
                    ? mobileIndicatorStyle.opacity
                    : 1,
                transition:
                  "left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s, opacity 0.2s",
                transform: "translateX(-50%)",
              }}
            />
            {/* DEBUG: If you still don't see the indicator, check if the parent has relative positioning and the indicator is not hidden by overflow or z-index. */}
            {mobileItems.map((item, index) => {
              if (item.path) {
                // Navigation tab: assign ref for indicator
                const navIndex = mobileNavItems.findIndex(
                  (navItem) => navItem.text === item.text
                );
                return (
                  <div
                    ref={(el) => {
                      mobileTabRefs.current[navIndex] = el;
                    }}
                    key={index}
                    onClick={() => {
                      if (item?.text === "Create") {
                        setOpenCreate(!openCreate);
                      }
                    }}
                    className={`relative flex items-center justify-center p-2 rounded-lg transition-all duration-200 z-0
                      ${
                        getPath(pathname) === getPath(item?.path ?? "")
                          ? "bg-white"
                          : ""
                      }
                    `}
                  >
                    <Link
                      href={item.path}
                      aria-label={item.text}
                      className="flex items-center justify-center w-full"
                    >
                      {item.icon}
                    </Link>
                  </div>
                );
              } else {
                // Non-navigation tab (e.g., Create)
                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (item?.text === "Create") {
                        setOpenCreate(!openCreate);
                      }
                    }}
                    className="relative flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
                  >
                    {item.icon}
                    {item?.text === "Create" && openCreate && (
                      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg border border-gray-200 p-2 w-32 z-50">
                        <button
                          onClick={() => {
                            setCreateType("post");
                            setOpenCreate(false);
                          }}
                          className="w-full text-left p-2 hover:bg-gray-100 text-xs"
                        >
                          Create Post
                        </button>
                        <button
                          onClick={() => {
                            setCreateType("blog");
                            setOpenCreate(false);
                          }}
                          className="w-full text-left p-2 hover:bg-gray-100 text-xs"
                        >
                          Share Analysis
                        </button>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      {createType === "post" && (
        <CreatePostDialog
          open={!!createType}
          setOpen={() => setCreateType(null)}
        />
      )}
      {createType === "blog" && (
        <CreateBlogDialog
          open={!!createType}
          setOpen={() => setCreateType(null)}
        />
      )}
    </>
  );
}
