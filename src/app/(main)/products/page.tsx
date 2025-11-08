"use client";

import { useState } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { useProducts } from "@/hooks/queries/useProducts";
import { useCreateProduct } from "@/hooks/use-create-product";
import type { Product } from "@/types/product";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsList() {
  const dark = useSelector((state: RootState) => state.theme.dark);

  const [query, setQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [deletedProductIds, setDeletedProductIds] = useState<number[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: "",
    description: "",
    category: "",
    price: 0,
    rating: 0,
    thumbnail: "",
  });
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data, fetchNextPage, hasNextPage, isError, isLoading } = useProducts(query);
  const createProductMutation = useCreateProduct();

  const allProducts: Product[] = data?.pages.flatMap((page) => page.products) || [];
  const displayedProducts = [
    ...localProducts,
    ...allProducts.filter((p) => !deletedProductIds.includes(p.id ?? 0)),
  ];

  const handleCreateProduct = async () => {
    if (!newProduct.title || !newProduct.description || !newProduct.category || !newProduct.price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const createdProduct = await createProductMutation.mutateAsync(newProduct as Product);
      const productWithId: Product = {
        ...createdProduct,
        id: typeof createdProduct.id === "number" ? createdProduct.id : Date.now(),
      };
      toast.success("Product added successfully!");
      setLocalProducts((prev) => [productWithId, ...prev]);
      setOpenDialog(false);
      setNewProduct({ title: "", description: "", category: "", price: 0, rating: 0, thumbnail: "" });
    } catch (error) {
      toast.error("Failed to add product.");
      console.error(error);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (localProducts.find((p) => p.id === product.id)) {
      setLocalProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setDeletedProductIds((prev) => [...prev, product.id!]);
    }
    toast.success(`Deleted "${product.title}"`);
    setProductToDelete(null);
  };


  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, id) => (
      <Card key={id} className={`overflow-hidden flex flex-col h-full animate-pulse ${dark ? "bg-neutral-900" : "bg-gray-100"}`}>
        <CardHeader className="p-0">
          <Skeleton className="h-40 w-full" />
        </CardHeader>
        <div className="p-6 flex-1 flex flex-col">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <CardContent className="p-0 pt-4 flex-grow">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
          <CardFooter className="p-0 pt-4 flex justify-between items-center mt-auto">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-5 w-12" />
          </CardFooter>
        </div>
      </Card>
    ));
  };

  return (
    <div
      className={`min-h-screen ${
        dark ? "bg-black text-white" : "bg-white text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full sm:max-w-md p-2 rounded-md ${
              dark
                ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-blue-500"
                : ""
            }`}
          />

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`sm:max-w-lg ${
                dark ? "bg-neutral-900 text-white border border-gray-700" : ""
              }`}
            >
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {["title", "description", "category", "price", "thumbnail"].map(
                  (field) => (
                    <div className="flex flex-col gap-1" key={field}>
                      <Label className={dark ? "text-gray-300" : ""}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        type={
                          field === "price" || field === "rating"
                            ? "number"
                            : "text"
                        }
                        value={newProduct[field as keyof Partial<Product>] || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            [field]:
                              field === "price"
                                ? Number(e.target.value)
                                : e.target.value,
                          })
                        }
                        className={
                          dark
                            ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                            : ""
                        }
                      />
                    </div>
                  )
                )}
              </div>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className={
                    dark
                      ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                      : ""
                  }
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProduct}
                  className="bg-green-600 text-white hover:bg-green-700"
                  disabled={createProductMutation.isPending}
                >
                  {createProductMutation.isPending ? "Adding..." : "Add Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isError ? (
          <div
            className={`flex items-center justify-center text-center py-20 rounded-lg ${
              dark ? "bg-neutral-900 text-gray-300" : "bg-gray-50 text-gray-700"
            }`}
          >
            <p>⚠️ Failed to load products. Try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {renderSkeletons(8)}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div
            className={`flex items-center justify-center text-center py-20 rounded-lg ${
              dark ? "bg-neutral-900 text-gray-300" : "bg-gray-50 text-gray-700"
            }`}
          >
            <p>No products found.</p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={displayedProducts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {renderSkeletons(4)}
              </div>
            }
            endMessage={
              <p className="text-center py-4 text-gray-500">
                No more products
              </p>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="relative group">

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="absolute top-2 left-2 z-10 bg-white rounded-full p-1 shadow-md opacity-80 group-hover:opacity-100 transition-opacity dark:bg-neutral-700 cursor-pointer"
                        onClick={() => setProductToDelete(product)}
                      >
                        <Trash className="w-4 h-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    {productToDelete?.id === product.id && (
                      <AlertDialogContent
                        className={
                          dark
                            ? "bg-neutral-900 text-white border border-gray-700"
                            : ""
                        }
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                          <p>
                            Are you sure you want to delete &quot;
                            {product.title}&quot;?
                          </p>
                        </AlertDialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <AlertDialogCancel
                            className={ `cursor-pointer
                              dark
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "" `
                            }
                            onClick={() => setProductToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(product)}
                            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                          >
                            Delete
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    )}
                  </AlertDialog>

                  <Link href={`/products/${product.id}`} passHref>
                    <Card
                      className={`overflow-hidden flex flex-col h-full transition-shadow duration-300 ${
                        dark
                          ? "bg-neutral-900 text-white hover:shadow-lg"
                          : "bg-white hover:shadow-md"
                      }`}
                    >
                      <CardHeader className="p-0">
                        <div className="relative h-40 w-full">
                          <Image
                            src={product.thumbnail!}
                            width={400}
                            height={400}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-t-md"
                          />
                        </div>
                      </CardHeader>
                      <div className="p-6 flex-1 flex flex-col">
                        <CardTitle className="line-clamp-1">
                          {product.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {product.category}
                        </CardDescription>
                        <CardContent className="p-0 pt-4 flex-grow">
                          <p className="text-sm line-clamp-2">
                            {product.description}
                          </p>
                        </CardContent>
                        <CardFooter className="p-0 pt-4 flex justify-between items-center mt-auto">
                          <p className="font-semibold text-lg">
                            ${product.price}
                          </p>
                          <div className="flex items-center text-sm text-yellow-500">
                            <span>⭐ {product.rating}</span>
                          </div>
                        </CardFooter>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
