import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export const useProducts = (q: string = "") => {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ["products", q],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 10;
      const endpoint = q
        ? `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${pageParam}`
        : `/products?limit=${limit}&skip=${pageParam}`;

        
      const data: ProductsResponse = await api.get(endpoint);

      return {
        products: data.products ?? [],
        total: data.total ?? 0,
        skip: data.skip ?? pageParam,
        limit: data.limit ?? limit,
      };
    },
    getNextPageParam: (lastPage) => {
      const next = lastPage.skip + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};
