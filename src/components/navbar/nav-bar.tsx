"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { ShoppingBag, Search, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose, Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SearchDropdown } from "./search-dropdown";
import { MobileMenu } from "./mobile-menu";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const auth = useSelector((state: RootState) => state.auth);

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

  const handleSearchToggle = () => setSearchOpen((prev) => !prev);
  const handleLogout = () => {
    dispatch(logout());
    router.push("/sign-in");
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? dark
            ? "bg-black/95 backdrop-blur-xl border-b border-neutral-700 shadow-lg shadow-black/20"
            : "bg-white/95 backdrop-blur-xl border-b border-neutral-300 shadow-lg shadow-gray-200/50"
          : dark
          ? "bg-black/80 backdrop-blur-md border-b border-neutral-700/50"
          : "bg-white/80 backdrop-blur-md border-b border-neutral-300/50"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              dark ? "bg-neutral-800" : "bg-gray-200"
            }`}
          >
            <ShoppingBag className={`w-5 h-5 ${dark ? "text-white" : "text-gray-900"}`} />
          </div>
          <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>ShopEase</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className={`text-sm font-medium ${
              dark ? "text-neutral-300 hover:text-white" : "text-gray-700 hover:text-black"
            }`}
          >
            Products
          </Link>

          {/* Search */}
          <Button
            ref={searchButtonRef}
            variant="ghost"
            onClick={handleSearchToggle}
            className={`p-2 rounded-lg cursor-pointer ${
              dark ? "text-white hover:bg-neutral-800" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Search className="w-5 h-5" stroke={dark ? "white" : "currentColor"} />
          </Button>

          <ThemeToggle dark={dark} />

          {/* Favorites */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className={`relative p-2 rounded-lg cursor-pointer ${
                  dark ? "text-white hover:bg-neutral-800" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart className="w-5 h-5" stroke="#EF4444" />
                {Object.keys(favorites).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {Object.keys(favorites).length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`${dark ? "bg-neutral-900 text-white" : ""} w-80 sm:w-96`}>
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">Your Favorites</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 overflow-y-auto max-h-[75vh]">
                {Object.values(favorites).length === 0 ? (
                  <p className={`${dark ? "text-neutral-400" : "text-gray-500"} text-center mt-10`}>
                    No favorites yet
                  </p>
                ) : (
                  Object.values(favorites).map((item: Product) => (
                    <SheetClose asChild key={item.id}>
                      <Link
                        href={`/products/${item.id}`}
                        className={`flex items-center gap-3 p-2 rounded-md hover:${
                          dark ? "bg-neutral-800" : "bg-gray-100"
                        } transition`}
                      >
                        <Image
                          src={item.thumbnail!}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className={`${dark ? "text-white" : "text-gray-900"} font-semibold`}>
                            {item.title}
                          </p>
                          <p className={`${dark ? "text-neutral-400" : "text-gray-500"} text-sm`}>
                            ${item.price}
                          </p>
                        </div>
                      </Link>
                    </SheetClose>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Auth */}
          {auth.token ? (
            <div className="flex items-center gap-2">
              <span className={`${dark ? "text-neutral-300" : "text-gray-700"} text-sm font-medium`}>
                Hi, {auth.user?.name || "User"}
              </span>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-1 cursor-pointer">
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                className={`font-medium cursor-pointer ${
                  dark ? "bg-neutral-100 text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            ref={searchButtonRef}
            variant="ghost"
            onClick={handleSearchToggle}
            className={`p-2 rounded-lg ${dark ? "text-white hover:bg-neutral-800" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <Search className="w-5 h-5" stroke={dark ? "white" : "currentColor"} />
          </Button>

          <Button
            variant="ghost"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`p-2 rounded-lg ${dark ? "text-white hover:bg-neutral-800" : "text-gray-700 hover:bg-gray-100"}`}
          >
            {menuOpen ? (
              <X className="w-5 h-5" stroke={dark ? "white" : "currentColor"} />
            ) : (
              <Menu className="w-5 h-5" stroke={dark ? "white" : "currentColor"} />
            )}
          </Button>
        </div>
      </div>

      <MobileMenu setMenuOpen={setMenuOpen} dark={dark} menuOpen={menuOpen} />

      {/* Search Dropdown */}
      {searchOpen && (
        <div ref={searchRef} className="absolute right-0 w-full px-4 md:px-0 md:w-auto md:right-20 z-50">
          <SearchDropdown searchOpen dark={dark} searchRef={searchRef} />
        </div>
      )}
    </nav>
  );
}
