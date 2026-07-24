import { apiClient } from './client';
import { Category } from '@/types';

export const categoriesApi = {
  getAll: () =>
    apiClient<Category[]>('/category', {
      tags: ['category'],
    }),

  getById: (id: number) =>
    apiClient<Category>(`/category/${id}`),

  create: (name: string, token: string) =>
    apiClient<Category>('/category', {
      method: 'POST',
      body: { name },
      token,
    }),

  update: (id: number, name: string, token: string) =>
    apiClient<Category>(`/category/${id}`, {
      method: 'PATCH',
      body: { name },
      token,
    }),

  delete: (id: number, token: string) =>
    apiClient<void>(`/category/${id}`, {
      method: 'DELETE',
      token,
    }),
};