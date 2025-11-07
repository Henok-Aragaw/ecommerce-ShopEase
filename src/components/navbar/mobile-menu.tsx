import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  dark: boolean;
  menuOpen: boolean;
}

export const MobileMenu: React.FC<Props> = ({ dark, menuOpen }) => {
  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ${
        menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      } ${dark ? "bg-black/95 border-t border-gray-800" : "bg-white/95 border-t border-gray-200"}`}
    >
      <div className="px-4 py-4 space-y-3">
        <Link
          href="/products"
          className={`block text-sm font-medium transition-colors duration-300 py-2 px-3 rounded-lg ${
            dark
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Products
        </Link>
        <Button
          variant="default"
          className={`w-full text-sm px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            dark
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              : "bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800"
          }`}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};
