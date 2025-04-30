import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiX,
  FiHome,
  FiList,
  FiCalendar,
  FiAward,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import useAuth from "@hooks/useAuth";
import classNames from "classnames";

/**
 * Navigation items for the sidebar
 */
const navigationItems = [
  { name: "Dashboard", to: "/dashboard", icon: FiHome },
  { name: "Routines", to: "/routines", icon: FiList },
  { name: "Progress", to: "/progress", icon: FiCalendar },
  { name: "Leaderboard", to: "/leaderboard", icon: FiAward },
  { name: "Settings", to: "/settings", icon: FiSettings },
];

/**
 * Sidebar navigation component
 */
const Sidebar = ({ isOpen = true, onClose, isMobile = false }) => {
  const { logout } = useAuth();

  // Dynamic classes based on props
  const sidebarClasses = classNames(
    "flex flex-col flex-grow bg-gradient-to-b from-primary-800 to-primary-900 overflow-y-auto",
    {
      "fixed inset-0 z-40 transition-transform transform ease-in-out duration-300":
        isMobile,
      "-translate-x-full": isMobile && !isOpen,
      "translate-x-0": isMobile && isOpen,
    }
  );

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center justify-between flex-shrink-0 px-4 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-white rounded-md">
            <FaFire className="h-6 w-6 text-primary-600" />
          </div>
          <div className="text-white font-bold text-lg">ScorchTrack</div>
        </div>

        {/* Mobile close button */}
        {isMobile && (
          <button
            className="rounded-md text-gray-300 hover:text-white focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <FiX className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col px-2 py-4">
        <nav className="flex-1 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  "group flex items-center px-2 py-2 text-sm rounded-md",
                  isActive
                    ? "bg-primary-700 text-white font-medium"
                    : "text-primary-100 hover:bg-primary-700 hover:text-white"
                )
              }
            >
              <item.icon
                className="mr-3 h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-primary-700">
        <button
          onClick={logout}
          className="flex items-center w-full px-2 py-2 text-sm rounded-md text-primary-100 hover:bg-primary-700 hover:text-white"
        >
          <FiLogOut className="mr-3 h-6 w-6 flex-shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
