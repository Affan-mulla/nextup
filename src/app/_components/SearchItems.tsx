import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
}
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  },
} as const;
const SearchItems = ({ action, result, activeIndex, handleActionClick , }: { action: Action, activeIndex: number, handleActionClick: (action: Action) => void  } : { action: Action }) => {
  return (
    <motion.li
      key={action.id}
      id={`action-${action.id}`}
      className={`px-3 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-zinc-900 cursor-pointer rounded-md ${
        activeIndex === result.actions.indexOf(action)
          ? "bg-gray-100 dark:bg-zinc-800"
          : ""
      }`}
      variants={ANIMATION_VARIANTS.item}
      layout
      onClick={() => handleActionClick(action)}
      role="option"
      aria-selected={activeIndex === result.actions.indexOf(action)}
    >
      <Link
        href={
          action.description === "company"
            ? `/c/${action.label}`
            : `/u/${action.label}`
        }
        className="w-full"
      >
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500" aria-hidden="true">
              {action.icon}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {action.label}
            </span>
            {action.description && (
              <span className="text-xs text-gray-400">
                {action.description}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.li>
  );
};

export default SearchItems;
