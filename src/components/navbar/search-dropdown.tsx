"use client";

import React, { useState } from "react";
import { useProducts } from "@/hooks/queries/useProducts";
import { Search, X, TrendingUp } from "lucide-react";
import Link from "next/link";
import debounce from "lodash.debounce";

interface Props {
  dark: boolean;
  searchOpen: boolean;
  searchRef?: React.RefObject<HTMLDivElement | null>;
}

export const SearchDropdown: React.FC<Props> = ({ dark, searchOpen, searchRef }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleSearch = debounce((q: string) => {
    setDebouncedQuery(q);
    setPage(1); // Reset to page 1 on new search
  }, 300);

  const { data, isLoading } = useProducts(debouncedQuery, page);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (!searchOpen) return null;

  const products = data?.products || [];
  const hasMore = data ? (data.skip + data.limit) < data.total : false;

  return (
    <div
      ref={searchRef}
      onClick={(e) => e.stopPropagation()}
      className={`absolute right-0 top-full mt-2 w-full md:w-96 rounded-xl shadow-2xl overflow-hidden transition-all duration-300
        ${dark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"}`}
    >
      
      <div className={`relative p-3 border-b ${dark ? "border-gray-800" : "border-gray-200"}`}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            stroke={dark ? "white" : "currentColor"}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={onChange}
            placeholder="Search products..."
            autoFocus
            className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition-all duration-300 focus:outline-none
              ${dark
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"}`
            }
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                ${dark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"}`}
            >
              <X className="w-4 h-4" stroke={dark ? "white" : "currentColor"} />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading && page === 1 ? (
          <div className="px-4 py-8 text-center">
            <div className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Searching...
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={`flex items-center gap-3 px-4 py-3 border-b transition-colors
                  ${dark ? "border-gray-800 hover:bg-gray-800 text-gray-100" : "border-gray-100 hover:bg-gray-50 text-gray-900"}`}
              >
                <TrendingUp
                  className="w-4 h-4"
                  stroke={dark ? "#60A5FA" : "#2563EB"} 
                />
                <span className="text-sm font-medium">{product.title}</span>
              </Link>
            ))}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className={`w-full py-3 text-sm font-medium
                  ${dark ? "text-blue-400 hover:bg-gray-800 disabled:text-gray-600" : "text-blue-600 hover:bg-gray-50 disabled:text-gray-400"}`}
              >
                {isLoading ? "Loading..." : "Load more results"}
              </button>
            )}
          </>
        ) : searchQuery ? (
          <div className="px-4 py-8 text-center">
            <div className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              No products found for &quot;{searchQuery}&quot;
            </div>
          </div>
        ) : (
          <div className="px-4 py-8 text-center">
            <div className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Start typing to search products...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};