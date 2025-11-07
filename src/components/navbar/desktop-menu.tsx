import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface Props {
  dark: boolean;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchRef: React.RefObject<HTMLDivElement | null>;
}

export const DesktopMenu: React.FC<Props> = ({ dark, setSearchOpen, searchRef }) => {
  return (
    <div className="hidden md:flex items-center gap-6 relative">
      {/* Products Link */}
      <Link
        href="/products"
        className={`text-sm font-medium transition-all duration-300 relative group ${
          dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
        }`}
      >
        Products
        <span
          className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
            dark ? "bg-blue-400" : "bg-blue-600"
          }`}
        />
      </Link>

      {/* Sign In Button */}
      <Button
        variant="default"
        className={`text-sm px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
          dark
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
            : "bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800 shadow-lg shadow-blue-600/30"
        }`}
      >
        Sign In
      </Button>

      {/* Theme Toggle */}
      <ThemeToggle dark={dark} />

      {/* Search Button */}
      <div ref={searchRef} className="relative">
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setSearchOpen((prev) => !prev);
          }}
          className={`p-2.5 rounded-lg ${
            dark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
