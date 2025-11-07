import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'


export const useProduct = (id?: number | string) => {
return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`),
    enabled: !!id,
  })
}