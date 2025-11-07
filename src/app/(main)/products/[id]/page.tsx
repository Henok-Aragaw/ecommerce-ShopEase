"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/use-product";
import type { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Star, Heart, Edit, Home, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { RootState } from "@/store";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

interface ProductDetailPageProps {
  localProducts?: Product[];
}

export default function ProductDetailPage({ localProducts = [] }: ProductDetailPageProps) {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const dark = useSelector((state: RootState) => state.theme.dark);
  const { data: productFromHook, isLoading, isError } = useProduct(id, localProducts);
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const [product, setProduct] = useState<Product | undefined>();
  const [mainImage, setMainImage] = useState<string>();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (productFromHook) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProduct(productFromHook);
      setMainImage(productFromHook.thumbnail);
      setFormData({
        title: productFromHook.title,
        price: productFromHook.price,
        discountPercentage: productFromHook.discountPercentage,
        description: productFromHook.description,
        category: productFromHook.category,
        brand: productFromHook.brand,
        stock: productFromHook.stock,
        thumbnail: productFromHook.thumbnail,
      });
      setReviewsCount(productFromHook.reviews?.length ?? 0);
    }
  }, [productFromHook]);

  if (!id) {
    return (
      <div
        className={`max-w-6xl mx-auto p-8 text-center rounded-lg ${
          dark ? "bg-neutral-900 text-white" : "bg-red-50 text-red-500"
        }`}
      >
        <h2 className="text-2xl font-semibold">Product ID is missing.</h2>
        <p>Please check the URL and try again.</p>
      </div>
    );
  }

  // Skeleton loading
  if (isLoading || !product) {
    return (
      <div
        className={`max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 ${
          dark ? "bg-neutral-900" : ""
        }`}
      >
        <Skeleton className="w-full h-[450px] rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-1/3 rounded" />
          <Skeleton className="h-10 w-3/4 rounded" />
          <Skeleton className="h-6 w-1/2 rounded" />
          <Skeleton className="h-8 w-1/3 rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-12 w-full rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`max-w-6xl mx-auto p-8 text-center rounded-lg ${
          dark ? "bg-neutral-900 text-white" : "bg-red-50 text-red-500"
        }`}
      >
        <h2 className="text-2xl font-semibold">Product not found.</h2>
        <p>We couldn&apos;t find the product you&apos;re looking for.</p>
      </div>
    );
  }

  const isFavorite = product.id ? Boolean(favorites[product.id]) : false;
  const handleThumbnailClick = (image: string) => setMainImage(image);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "discountPercentage" ||
        name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleUpdate = () => {
    if (!product) return;

    const updatedProduct: Product = {
      ...product,
      title: formData.title ?? product.title,
      price: Number(formData.price ?? product.price),
      discountPercentage: Number(
        formData.discountPercentage ?? product.discountPercentage
      ),
      description: formData.description ?? product.description,
      category: formData.category ?? product.category,
      brand: formData.brand ?? product.brand,
      stock: Number(formData.stock ?? product.stock),
      thumbnail: formData.thumbnail ?? product.thumbnail,
      images: product.images ?? [],
      rating: product.rating ?? 0,
    };

    setProduct(updatedProduct);
    setMainImage(updatedProduct.thumbnail);
    setOpen(false);
    toast.success("Product updated successfully!");
  };

  const displayPrice = product.price;
  const discount = product.discountPercentage ?? 0;
  const finalPrice = displayPrice * (1 - discount / 100);

  return (
    <div className={`${dark ? "bg-black text-white" : "bg-white text-gray-900"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
        <nav
          className="flex items-center text-sm flex-wrap gap-2"
          aria-label="Breadcrumb"
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className={`flex items-center gap-1 transition-colors ${
                dark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <ChevronRight
            className={`w-4 h-4 ${dark ? "text-gray-500" : "text-gray-400"}`}
          />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/products/`}
              className={`transition-colors capitalize ${
                dark
                  ? "text-gray-300 hover:text-white"
                  : "hover:text-neutral-600"
              }`}
            >
              {product?.category ?? "Category"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <ChevronRight
            className={`w-4 h-4 ${dark ? "text-gray-500" : "text-gray-400"}`}
          />
          <BreadcrumbItem>
            <span
              className={`font-medium truncate max-w-xs ${
                dark ? "text-gray-200" : "text-gray-700"
              }`}
              title={product?.title}
            >
              {product?.title}
            </span>
          </BreadcrumbItem>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-end mb-4 pt-12">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 border ${
                  dark
                    ? "border-gray-600 bg-neutral-800 text-white hover:bg-neutral-700"
                    : "border-gray-300 text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Edit className="w-4 h-4" /> Edit Product
              </Button>
            </DialogTrigger>

            <DialogContent
              className={`sm:max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl border p-6 ${
                dark
                  ? "bg-neutral-900 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {[
                  "title",
                  "brand",
                  "category",
                  "price",
                  "discountPercentage",
                  "stock",
                  "thumbnail",
                ].map((field) => (
                  <div key={field} className="grid gap-1">
                    <Label htmlFor={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      type={
                        ["price", "discountPercentage", "stock"].includes(field)
                          ? "number"
                          : "text"
                      }
                      value={formData[field as keyof Product] ?? ""}
                      onChange={handleChange}
                      className={`rounded-md ${
                        dark
                          ? "bg-neutral-800 border-gray-700 text-white placeholder-gray-400 focus:ring-gray-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                      }`}
                    />
                  </div>
                ))}

                <div className="grid gap-1">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description ?? ""}
                    onChange={handleChange}
                    className={`border rounded-md p-2 w-full resize-none ${
                      dark
                        ? "bg-neutral-800 border-gray-700 text-white placeholder-gray-400 focus:ring-gray-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-4 py-2 ${
                    dark
                      ? "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  className={`rounded-md px-4 py-2 font-semibold transition ${
                    dark
                      ? "bg-green-700 hover:bg-green-600 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
              <Image
                src={mainImage ?? product.thumbnail ?? "/placeholder.png"}
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
                        ? "border-neutral-500"
                        : dark
                        ? "border-gray-700"
                        : "border-gray-200"
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

          <div className="flex flex-col gap-6">
            <div>
              <p
                className={`text-sm font-medium uppercase tracking-wider ${
                  dark ? "text-neutral-400" : "text-gray-500"
                }`}
              >
                {product.category} • {product.brand}
              </p>
              <h1
                className={`text-4xl font-extrabold mt-1 ${
                  dark ? "text-white" : "text-gray-900"
                }`}
              >
                {product.title}
              </h1>

              <div className="flex items-center mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const rating = Math.round(product.rating ?? 0);
                    return (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < rating
                            ? "text-yellow-400"
                            : dark
                            ? "text-gray-600"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                      />
                    );
                  })}
                </div>
                <p
                  className={`ml-2 text-sm ${
                    dark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {product.rating?.toFixed(1)} ({reviewsCount} reviews)
                </p>
              </div>

              <div className="flex items-baseline gap-3 mt-2">
                <p
                  className={`text-4xl font-bold ${
                    dark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${finalPrice.toFixed(2)}
                </p>
                {discount > 0 && (
                  <>
                    <p
                      className={`text-xl line-through ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ${displayPrice.toFixed(2)}
                    </p>
                    <p className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-md">
                      {discount}% OFF
                    </p>
                  </>
                )}
                <p
                  className={`ml-auto font-medium ${
                    dark ? "text-neutral-300" : "text-gray-700"
                  }`}
                >
                  Stock: {product.stock}
                </p>
              </div>

              <p
                className={`mt-2 ${
                  dark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {product.description}
              </p>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => dispatch(toggleFavorite(product))}
                className={`w-full flex items-center justify-center gap-2 font-bold p-6 cursor-pointer rounded-lg shadow-md transition-colors duration-300 text-lg ${
                  isFavorite
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : dark
                    ? "bg-neutral-700 text-white hover:neutral-600"
                    : "bg-neutral-600 text-white hover:bg-neutral-700"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-current text-white" : "text-white"
                  }`}
                />
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
