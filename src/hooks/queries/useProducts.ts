import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export const useProducts = (q: string = "", page: number = 1) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", q, page],
    queryFn: async () => {
      const limit = 10;
      const skip = (page - 1) * limit;
      
      const endpoint = q
        ? `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
        : `/products?limit=${limit}&skip=${skip}`;

      const data: ProductsResponse = await api.get(endpoint);

      return {
        products: data.products ?? [],
        total: data.total ?? 0,
        skip: data.skip ?? skip,
        limit: data.limit ?? limit,
      };
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};