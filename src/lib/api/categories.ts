import { apiClient } from './client';
import { Category } from '@/types';

export const categoriesApi = {
  getAll: () =>
    apiClient<Category[]>('/category', {
      tags: ['category'],
      revalidate: 300,
    }),

  getById: (id: number) =>
    apiClient<Category>(`/category/${id}`),

  create: (name: string) =>
    apiClient<Category>('/category', {
      method: 'POST',
      body: { name },
    }),

  update: (id: number, name: string) =>
    apiClient<Category>(`/category/${id}`, {
      method: 'PATCH',
      body: { name },
    }),

  delete: (id: number) =>
    apiClient<void>(`/category/${id}`, { method: 'DELETE' }),
};