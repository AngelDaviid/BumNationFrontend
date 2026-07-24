export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  brand: string;
  categoryId: number;
  category: Category;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
}

export type UpdateProductData = Partial<CreateProductData>;