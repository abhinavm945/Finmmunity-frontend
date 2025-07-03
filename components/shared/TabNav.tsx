'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaNewspaper, FaUser, FaRegCommentDots } from 'react-icons/fa';

export default function TabNav() {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const pathname = usePathname();

  const tabs = [
    { label: 'NEWZ', icon: <FaNewspaper size={25} />, path: '/' },
    { label: 'COMMUNITY', icon: <FaUser size={25} />, path: '/community' },
    { label: 'ASK', icon: <FaRegCommentDots size={25} />, path: '/ask' },
  ];

  const activeTab = () => {
    if (pathname === '/community') return 'COMMUNITY';
    if (pathname === '/ask') return 'ASK';
    return 'NEWZ';
  };

  return (
    <div className="flex justify-center space-x-14 py-2">
      {tabs.map((tab) => (
        <motion.div
          key={tab.label}
          onHoverStart={() => setIsHovering(tab.label)}
          onHoverEnd={() => setIsHovering(null)}
          className={`flex flex-col items-center cursor-pointer ${
            activeTab() === tab.label
              ? 'text-blue-600 font-bold'
              : 'text-gray-500 hover:text-gray-700'
          } transition-colors duration-200`}
        >
          <Link href={tab.path}>
            <div className="flex items-center space-x-2 text-xl">
              <motion.span
                animate={{
                  rotate: isHovering === tab.label ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {tab.icon}
              </motion.span>
              <span>{tab.label}</span>
            </div>
            <motion.div
              className={`h-1 w-10 mt-1 ${
                activeTab() === tab.label ? 'bg-blue-600' : 'bg-transparent'
              } rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: activeTab() === tab.label ? 40 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}