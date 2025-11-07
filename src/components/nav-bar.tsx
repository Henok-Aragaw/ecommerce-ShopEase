"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Sun, Moon, Search, X, Menu, ShoppingBag, TrendingUp } from "lucide-react";
import { useProducts } from "@/hooks/queries/useProducts";
import debounce from "lodash.debounce";

export default function Navbar() {
  const dispatch = useDispatch();
  const dark = useSelector((state: RootState) => state.theme.dark);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = debounce((q: string) => {
    setDebouncedQuery(q);
  }, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts(debouncedQuery);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const closeSearch = () => {
    setSearchOpen(false);
    clearSearch();
  };

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
        {/* Logo with icon */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              dark
                ? "bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-lg group-hover:shadow-blue-500/50"
                : "bg-gradient-to-br from-blue-600 to-purple-700 group-hover:shadow-lg group-hover:shadow-blue-600/30"
            }`}
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <h1
            className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            ShopEase
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className={`text-sm font-medium transition-all duration-300 relative group ${
              dark
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Products
            <span
              className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                dark ? "bg-blue-400" : "bg-blue-600"
              }`}
            />
          </Link>

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

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <Button
              variant="ghost"
              onClick={() => setSearchOpen((prev) => !prev)}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                searchOpen
                  ? dark
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                  : dark
                  ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Search Dropdown */}
            {searchOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-96 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                  dark
                    ? "bg-gray-900 border border-gray-800"
                    : "bg-white border border-gray-200"
                }`}
              >
                {/* Search Input */}
                <div className="relative p-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={onChange}
                      placeholder="Search products..."
                      autoFocus
                      className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition-all duration-300 focus:outline-none ${
                        dark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      }`}
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                          dark
                            ? "text-gray-400 hover:text-white hover:bg-gray-700"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {data && data.pages.flatMap((page) => page.products).length > 0 ? (
                    <>
                      {data.pages.flatMap((page) =>
                        page.products.map((product, index) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            onClick={closeSearch}
                            className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 border-b last:border-b-0 ${
                              dark
                                ? "border-gray-800 hover:bg-gray-800 text-gray-100"
                                : "border-gray-100 hover:bg-gray-50 text-gray-900"
                            }`}
                            style={{
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            <TrendingUp
                              className={`w-4 h-4 flex-shrink-0 ${
                                dark ? "text-blue-400" : "text-blue-600"
                              }`}
                            />
                            <span className="text-sm font-medium truncate">
                              {product.title}
                            </span>
                          </Link>
                        ))
                      )}
                      {hasNextPage && (
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className={`w-full py-3 text-sm font-medium transition-colors ${
                            dark
                              ? "text-blue-400 hover:bg-gray-800 disabled:text-gray-600"
                              : "text-blue-600 hover:bg-gray-50 disabled:text-gray-400"
                          }`}
                        >
                          {isFetchingNextPage ? "Loading..." : "Load more results"}
                        </button>
                      )}
                    </>
                  ) : searchQuery ? (
                    <div className="px-4 py-8 text-center">
                      <div
                        className={`text-sm ${
                          dark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No products found for &quot;{searchQuery}&quot;
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div
                        className={`text-sm ${
                          dark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Start typing to search products...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            onClick={() => dispatch(toggleTheme())}
            className={`p-2.5 rounded-lg transition-all duration-300 ${
              dark
                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <div className="relative w-5 h-5">
              <Sun
                className={`absolute inset-0 transition-all duration-300 ${
                  dark
                    ? "opacity-0 rotate-90 scale-0"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <Moon
                className={`absolute inset-0 transition-all duration-300 ${
                  dark
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-0"
                }`}
              />
            </div>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setSearchOpen((prev) => !prev)}
            className={`p-2 rounded-lg ${
              dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`p-2 rounded-lg ${
              dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`absolute inset-0 transition-all duration-300 ${
                  menuOpen
                    ? "opacity-0 rotate-90 scale-0"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`absolute inset-0 transition-all duration-300 ${
                  menuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-0"
                }`}
              />
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } ${
          dark
            ? "bg-black/95 border-t border-gray-800"
            : "bg-white/95 border-t border-gray-200"
        }`}
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

          <Button
            variant="ghost"
            onClick={() => dispatch(toggleTheme())}
            className={`w-full p-2.5 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
              dark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {dark ? (
              <>
                <Sun className="w-5 h-5" />
                <span className="text-sm font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span className="text-sm font-medium">Dark Mode</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="md:hidden">
          <div
            className={`px-4 py-3 border-t ${
              dark
                ? "bg-black/95 border-gray-800"
                : "bg-white/95 border-gray-200"
            }`}
          >
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={onChange}
                placeholder="Search products..."
                autoFocus
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition-all duration-300 focus:outline-none ${
                  dark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                    dark
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Results */}
          {data && (
            <div
              className={`max-h-64 overflow-y-auto border-t ${
                dark
                  ? "bg-black/95 border-gray-800"
                  : "bg-white/95 border-gray-200"
              }`}
            >
              {data.pages.flatMap((page) => page.products).length > 0 ? (
                <>
                  {data.pages.flatMap((page) =>
                    page.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={closeSearch}
                        className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
                          dark
                            ? "border-gray-800 hover:bg-gray-800 text-gray-100"
                            : "border-gray-100 hover:bg-gray-50 text-gray-900"
                        }`}
                      >
                        <TrendingUp
                          className={`w-4 h-4 ${
                            dark ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <span className="text-sm font-medium">{product.title}</span>
                      </Link>
                    ))
                  )}
                  {hasNextPage && (
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className={`w-full py-3 text-sm font-medium ${
                        dark
                          ? "text-blue-400 hover:bg-gray-800"
                          : "text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      {isFetchingNextPage ? "Loading..." : "Load more"}
                    </button>
                  )}
                </>
              ) : searchQuery ? (
                <div className="px-4 py-6 text-center">
                  <div
                    className={`text-sm ${
                      dark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No products found
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}