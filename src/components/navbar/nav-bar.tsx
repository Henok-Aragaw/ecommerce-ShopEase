"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ShoppingBag, Search, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SheetClose,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchDropdown } from "./search-dropdown";
import { MobileMenu } from "./mobile-menu";
import { Product } from "@/types/product";

export default function Navbar() {
  const dark = useSelector((state: RootState) => state.theme.dark);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // toggle search
  const handleSearchToggle = () => setSearchOpen(prev => !prev);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? dark
            ? "bg-black/95 backdrop-blur-xl border-b border-gray-800 shadow-lg shadow-black/20"
            : "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg shadow-gray-200/50"
          : dark
          ? "bg-black/80 backdrop-blur-md border-b border-gray-800/50"
          : "bg-white/80 backdrop-blur-md border-b border-gray-200/50"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              dark
                ? "bg-gradient-to-br from-blue-500 to-purple-600"
                : "bg-gradient-to-br from-blue-600 to-purple-700"
            }`}
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <h1
            className={`text-2xl font-bold ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            ShopEase
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className={`text-sm font-medium transition-colors ${
              dark
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Products
          </Link>

          {/* Search Icon */}
          <Button
            ref={searchButtonRef}
            variant="ghost"
            onClick={handleSearchToggle}
            className={`p-2 rounded-lg ${
              dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Favorites Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={`relative p-2 rounded-lg ${
                  dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <Heart className="w-5 h-5 text-red-500" />
                {Object.keys(favorites).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {Object.keys(favorites).length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">
                  Your Favorites
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 overflow-y-auto max-h-[75vh]">
                {Object.values(favorites).length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">
                    No favorites yet ❤️
                  </p>
                ) : (
                  Object.values(favorites).map((item: Product) => (
                    <SheetClose asChild key={item.id}>
                      <Link
                        href={`/products/${item.id}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition group"
                      >
                        <Image
                          src={item.thumbnail!}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500">${item.price}</p>
                        </div>
                      </Link>
                    </SheetClose>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Sign In */}
          <Link href="/login">
            <Button
              className={`font-medium ${
                dark
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger & Search */}
        <div className="flex md:hidden items-center gap-2">
          {/* Search Icon */}
          <Button
            ref={searchButtonRef}
            variant="ghost"
            onClick={handleSearchToggle}
            className={`p-2 rounded-lg ${
              dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Hamburger */}
          <Button
            variant="ghost"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`p-2 rounded-lg ${
              dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu dark={dark} menuOpen={menuOpen} />

      {/* Search Dropdown */}
      {searchOpen && (
        <div
          ref={searchRef}
          className="absolute right-0 w-full px-4 md:px-0 md:w-auto md:right-20"
        >
          <SearchDropdown searchOpen dark={dark} />
        </div>
      )}
    </nav>
  );
}
