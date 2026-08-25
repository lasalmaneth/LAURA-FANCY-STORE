-- LAURA FANCY STORE — Database Schema & Security Policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  product_code TEXT DEFAULT '',
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'coming_soon')),
  featured BOOLEAN DEFAULT false NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured_active ON public.products(featured, active);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public READ policies (anyone can read active categories, products, images)
CREATE POLICY "Public categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Active products are viewable by everyone" ON public.products
  FOR SELECT USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Product images are viewable by everyone" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Authenticated Admin WRITE policies (only logged in admin can insert/update/delete)
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert product images" ON public.product_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update product images" ON public.product_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete product images" ON public.product_images
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');
