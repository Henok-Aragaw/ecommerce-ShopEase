import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Product } from '@/types/product';

export const useProduct = (id?: string | number) => {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      if (!id) throw new Error('Product ID is required');

      // api interceptor returns res.data, so the call resolves to the product object
      const res = await api.get(`/products/${id}`);
      return res as unknown as Product;
    },
    enabled: !!id,
  });
};
