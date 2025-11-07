"use client";

import React, { useState } from "react";
import Link from "next/link"; // Import the Link component
import InfiniteScroll from "react-infinite-scroll-component";
import { useProducts } from "@/hooks/queries/useProducts";
import type { Product } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProductsList() {
  const [query, setQuery] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts(query);

  const allProducts: Product[] =
    data?.pages.flatMap((page) => page.products) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <div className="mb-6 mt-4">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <InfiniteScroll
        dataLength={allProducts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<p className="text-center py-4">Loading more products...</p>}
        endMessage={
          <p className="text-center py-4 text-gray-500">No more products</p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            // Wrap the Card component with the Link component
            <Link key={product.id} href={`/products/${product.id}`} passHref>
              <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-40 w-full">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-t-md"
                    />
                  </div>
                </CardHeader>
                <div className="p-6 flex-1 flex flex-col">
                  <CardTitle className="line-clamp-1" title={product.title}>
                    {product.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {product.category}
                  </CardDescription>
                  <CardContent className="p-0 pt-4 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-0 pt-4 flex justify-between items-center mt-auto">
                    <p className="font-semibold text-lg">${product.price}</p>
                    <div className="flex items-center text-sm text-yellow-500">
                      <span>⭐ {product.rating}</span>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </InfiniteScroll>

      {isFetchingNextPage && allProducts.length === 0 && (
        <p className="text-center py-4">Loading products...</p>
      )}
    </div>
  );
}