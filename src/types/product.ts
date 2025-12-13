export interface Product {
  id: number;
  name: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  rating: number;
  image: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  image?: string;
}