import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Product) => {
      const { data } = await api.post<Product>("/products/add", payload);
      return data;
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
