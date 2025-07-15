"use client";

import { useState } from "react";
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
import { usePathname, useSearchParams } from "next/navigation";

export default function LeftSidebar() {
  const [openCreate, setOpenCreate] = useState(false);
  const [createType, setCreateType] = useState<"post" | "blog" | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const user = {
    _id: "user1",
    username: "MarketAnalyst",
    profilePicture: "/images/default-avatar.png",
  };

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
      text: "Saved",
      icon: <Bookmark />,
      path: `/community/saved${userId ? `?id=${userId}` : ""}`,
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
      path: `/community/profile${userId ? `?id=${userId}` : ""}`,
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen flex-col w-64">
        <div className="bg-white h-[72px] w-full border-r border-gray-300"></div>
        <div className="sticky top-[72px] w-full h-[calc(100vh-72px)] bg-white border-r border-gray-300 overflow-y-auto">
          <div className="flex flex-col px-4">
            <h1 className="font-bold my-6 pr-1 text-3xl lg:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">
              FINMUNITY
            </h1>
            <div>
              {sidebarItems.map((item, index) => (
                <div key={index}>
                  <div
                    onClick={() => {
                      if (item.text === "Create") {
                        setOpenCreate(!openCreate);
                      }
                    }}
                    className={`relative flex items-center gap-3 lg:gap-4 text-black hover:bg-gray-100 cursor-pointer rounded-lg p-2 lg:p-3 my-1 ${
                      pathname === item.path ? "bg-gray-100" : ""
                    }`}
                  >
                    {item.path ? (
                      <Link
                        href={item.path}
                        className="flex items-center gap-3 lg:gap-4 w-full"
                      >
                        {item.icon}
                        <span className="text-sm lg:text-base">
                          {item.text}
                        </span>
                      </Link>
                    ) : (
                      <>
                        {item.icon}
                        <span className="text-sm lg:text-base">
                          {item.text}
                        </span>
                      </>
                    )}
                  </div>
                  {item.text === "Create" && openCreate && (
                    <div className="ml-10 border-l-2 border-gray-200 pl-2">
                      <button
                        onClick={() => {
                          setCreateType("post");
                          setOpenCreate(false);
                        }}
                        className="w-full text-left p-2 hover:bg-gray-100 text-xs lg:text-sm"
                      >
                        Create Post
                      </button>
                      <button
                        onClick={() => {
                          setCreateType("blog");
                          setOpenCreate(false);
                        }}
                        className="w-full text-left p-2 hover:bg-gray-100 text-xs lg:text-sm"
                      >
                        Share Analysis
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="flex justify-between items-center px-2 sm:px-4 py-2 max-w-7xl mx-auto">
          <div className="flex justify-around flex-grow">
            {mobileItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  if (item?.text === "Create") {
                    setOpenCreate(!openCreate);
                  }
                }}
                className={`relative flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg ${
                  pathname === item?.path ? "bg-gray-100" : ""
                }`}
              >
                {item?.path ? (
                  <Link
                    href={item.path}
                    aria-label={item.text}
                    className="flex items-center justify-center w-full"
                  >
                    {item.icon}
                  </Link>
                ) : (
                  item?.icon
                )}
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
            ))}
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
