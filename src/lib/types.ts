export type StockStatus = 'in_stock' | 'out_of_stock' | 'coming_soon';

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  category_id: string;
  product_code: string;
  stock_status: StockStatus;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}
