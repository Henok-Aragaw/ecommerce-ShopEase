import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product"; 

interface UpdateArgs {
  id: number;
  payload: Partial<Product>;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateArgs) => {
      const res = await api.patch(`/products/${id}`, payload);
      return res; 
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Failed to update product:", error);
    },
  });
};
