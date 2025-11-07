import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Product>({
    mutationFn: async (payload: Product) => {
      try {
       
        const response = await api.post("/products/add", payload);

        return {
          ...payload,
          id: response?.data?.id,
        } as Product;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
