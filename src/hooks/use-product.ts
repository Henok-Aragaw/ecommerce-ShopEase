import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

export const useProduct = (id?: string | number, localProducts: Product[] = []) => {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product> => {
      if (!id) throw new Error("Product ID is required");

      const localProduct = localProducts.find((p) => p.id?.toString() === id?.toString());
      if (localProduct) return localProduct;

      const res = await api.get(`/products/${id}`);
      return res as unknown as Product;
    },
    enabled: !!id,
  });
};
