import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

// Pass localProducts so we can check locally added products first
export const useProduct = (id?: string | number, localProducts: Product[] = []) => {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product> => {
      if (!id) throw new Error("Product ID is required");

      // Check localProducts first
      const localProduct = localProducts.find((p) => p.id?.toString() === id?.toString());
      if (localProduct) return localProduct;

      // Otherwise fetch from DummyJSON
      const res = await api.get(`/products/${id}`);
      return res as unknown as Product;
    },
    enabled: !!id,
  });
};
