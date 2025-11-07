"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/use-product";
import type { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Star, CheckCircle, Package, ShieldCheck, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { RootState } from "@/store";

export default function ProductDetailPage() {
  const params = useParams();
  let id: string | undefined = undefined;
  if (params && typeof params.id === "string") id = params.id;
  else if (params && Array.isArray(params.id)) id = params.id[0];

  const { data, isLoading, isError } = useProduct(id);
  const product = data as Product | undefined;

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  
  const productId = product?.id;
  const isFavorite = typeof productId === "number" ? Boolean(favorites[productId]) : false;


  const [mainImage, setMainImage] = useState<string | undefined>(undefined);


  const [reviewsCount] = useState<number>(() => Math.floor(Math.random() * 100) + 50);

  if (!id) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center text-red-500 bg-red-50 rounded-lg">
        <h2 className="text-2xl font-semibold">Product ID is missing.</h2>
        <p>Please check the URL and try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="w-full h-[450px] rounded-lg" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center text-red-500 bg-red-50 rounded-lg">
        <h2 className="text-2xl font-semibold">Product not found.</h2>
        <p>We couldn&apos;t find the product you&apos;re looking for.</p>
      </div>
    );
  }

  const handleThumbnailClick = (image: string) => setMainImage(image);

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <div className="flex flex-col gap-4">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
              <Image
                src={mainImage || product.thumbnail!}
                alt={product.title}
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`w-24 h-24 rounded-md cursor-pointer overflow-hidden border-2 ${
                      mainImage === img
                        ? "border-indigo-500"
                        : "border-transparent"
                    }`}
                    onClick={() => handleThumbnailClick(img)}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                {product.category}
              </p>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-1">
                {product.title}
              </h1>
              <div className="flex items-center mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const rating = Math.round(product?.rating ?? 0);
                    return (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                      />
                    );
                  })}
                </div>
                <p className="ml-2 text-sm text-gray-500">
                  {product?.rating ?? 0} ({reviewsCount} reviews)
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-gray-900">
                $
                {(
                  product!.price *
                  (1 - (product?.discountPercentage || 0) / 100)
                ).toFixed(2)}
              </p>
              {product.discountPercentage && (
                <>
                  <p className="text-xl text-gray-500 line-through">
                    ${product!.price.toFixed(2)}
                  </p>
                  <p className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-md">
                    {product.discountPercentage}% OFF
                  </p>
                </>
              )}
            </div>

            <p className="text-gray-600">{product?.description}</p>

            <div className="mt-6">
              <button
                onClick={() => dispatch(toggleFavorite(product!))}
                className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-300 text-lg ${
                  isFavorite
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-current text-white" : "text-white"
                  }`}
                />
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </button>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>In stock and ready to ship</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <ShieldCheck className="w-5 h-5 text-gray-500" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
