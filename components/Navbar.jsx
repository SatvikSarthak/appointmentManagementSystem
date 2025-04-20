"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/mujlogo.png"
                  alt="MUJLogo"
                  width={40}
                  height={40}
                  className="h-14 w-full "
                />
                <span className="text-xl font-bold whitespace-nowrap text-gray-800 hover:text-indigo-600 transition-colors">
Appointment Management System
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={
                    user.role === "student"
                      ? "/student/dashboard"
                      : "/teacher/dashboard"
                  }
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </Link>
                {user.role === "student" && (
                  <Link
                    href="/student/book"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                  >
                    Book Appointment
                  </Link>
                )}
                <div className="flex items-center space-x-2 ml-2">
                  <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100 flex items-center">
                    <User size={16} className="inline mr-1" />
                    {user.name} ({user.role})
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-white hover:bg-indigo-600 transition-colors flex items-center gap-1 border border-gray-300 hover:border-indigo-600"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register/student"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                >
                  Student Register
                </Link>
                <Link
                  href="/register/teacher"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                >
                  Teacher Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={
                    user.role === "student"
                      ? "/student/dashboard"
                      : "/teacher/dashboard"
                  }
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                {user.role === "student" && (
                  <Link
                    href="/student/book"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                    onClick={toggleMenu}
                  >
                    Book Appointment
                  </Link>
                )}
                <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-200">
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={() => {
                    toggleMenu();
                    logout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-600 transition-colors border border-gray-300 hover:border-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register/student"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                  onClick={toggleMenu}
                >
                  Student Register
                </Link>
                <Link
                  href="/register/teacher"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                  onClick={toggleMenu}
                >
                  Teacher Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}