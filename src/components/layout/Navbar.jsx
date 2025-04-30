import React from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiBell, FiUser } from "react-icons/fi";
import useAuth from "@hooks/useAuth";

/**
 * Application navbar component
 */
const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open menu</span>
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <span className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
                  S
                </span>
                <span className="font-bold text-xl text-gray-900">
                  ScorchTrack
                </span>
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <FiBell className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.points || 0} points
                  </span>
                </div>

                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <FiUser className="h-5 w-5" />
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md w-48 border border-gray-200 hidden">
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
