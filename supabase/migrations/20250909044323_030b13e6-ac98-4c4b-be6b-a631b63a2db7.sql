-- Make migration idempotent and compatible across Postgres versions
create extension if not exists pgcrypto with schema public;

-- Enums (create only if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'food_category') THEN
    CREATE TYPE public.food_category AS ENUM ('veg','non-veg');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM ('pending','confirmed','preparing','delivered','cancelled');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE public.payment_status AS ENUM ('created','authorized','captured','failed','refunded');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE public.payment_method AS ENUM ('upi','card','netbanking','wallet','emi','cash');
  END IF;
END $$;

-- Helper: auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles (per auth user)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Replace policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can upsert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can upsert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Menu Items (publicly readable)
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  category public.food_category not null,
  rating numeric(2,1),
  cooking_time_min integer,
  is_popular boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe trigger creation for menu_items
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_menu_items_updated_at'
  ) THEN
    CREATE TRIGGER trg_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

alter table public.menu_items enable row level security;
DROP POLICY IF EXISTS "Anyone can read menu items" ON public.menu_items;
CREATE POLICY "Anyone can read menu items" ON public.menu_items
FOR SELECT USING (true);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total numeric(10,2) not null,
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe trigger creation for orders
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_orders_updated_at'
  ) THEN
    CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

alter table public.orders enable row level security;
DROP POLICY IF EXISTS "Users can manage own orders (select)" ON public.orders;
DROP POLICY IF EXISTS "Users can manage own orders (insert)" ON public.orders;
DROP POLICY IF EXISTS "Users can manage own orders (update)" ON public.orders;
DROP POLICY IF EXISTS "Users can manage own orders (delete)" ON public.orders;

CREATE POLICY "Users can manage own orders (select)" ON public.orders
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own orders (insert)" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own orders (update)" ON public.orders
FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own orders (delete)" ON public.orders
FOR DELETE USING (auth.uid() = user_id);

-- Order Items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) generated always as (quantity * unit_price) stored
);

alter table public.order_items enable row level security;
DROP POLICY IF EXISTS "Users can read own order_items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert own order_items" ON public.order_items;
DROP POLICY IF EXISTS "Users can update own order_items" ON public.order_items;
DROP POLICY IF EXISTS "Users can delete own order_items" ON public.order_items;

CREATE POLICY "Users can read own order_items" ON public.order_items
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order_items" ON public.order_items
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Users can update own order_items" ON public.order_items
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Users can delete own order_items" ON public.order_items
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- Payments (one per order)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  provider text not null default 'razorpay',
  payment_status public.payment_status not null default 'created',
  method public.payment_method,
  amount numeric(10,2) not null,
  currency text not null default 'INR',
  payment_reference text unique,
  receipt_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;
DROP POLICY IF EXISTS "Users can read own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can update own payments" ON public.payments;

CREATE POLICY "Users can read own payments" ON public.payments
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Users can insert own payments" ON public.payments
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Users can update own payments" ON public.payments
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- Seed: Menu Items (from current UI data)
insert into public.menu_items (name, description, price, image_url, category, rating, cooking_time_min, is_popular) values
('Paneer Butter Masala','Rich and creamy paneer curry with aromatic spices and butter',280,'https://images.unsplash.com/photo-1631292784640-8b0dc3246186?w=400','veg',4.8,25,true),
('Vegetable Biryani','Fragrant basmati rice with mixed vegetables and traditional spices',250,'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400','veg',4.6,35,false),
('Dal Makhani','Slow-cooked black lentils in rich tomato and cream sauce',220,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400','veg',4.7,20,false),
('Palak Paneer','Fresh spinach curry with soft paneer cubes and aromatic spices',260,'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400','veg',4.5,22,false),
('Veg Hakka Noodles','Stir-fried noodles with fresh vegetables and Indo-Chinese flavors',180,'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400','veg',4.4,15,false),
('Margherita Pizza','Classic pizza with fresh tomatoes, mozzarella, and basil',320,'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400','veg',4.6,18,false),
('Butter Chicken','Tender chicken in rich tomato-based curry with cream and butter',350,'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400','non-veg',4.9,30,true),
('Chicken Biryani','Aromatic basmati rice with succulent chicken pieces and spices',380,'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400','non-veg',4.8,40,false),
('Fish Curry','Fresh fish cooked in coconut-based curry with traditional spices',420,'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400','non-veg',4.7,25,false),
('Chicken Tikka','Marinated chicken grilled to perfection with aromatic spices',320,'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400','non-veg',4.6,28,false),
('Mutton Curry','Tender mutton pieces in rich and spicy traditional curry',450,'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400','non-veg',4.8,45,false),
('Chicken Shawarma','Grilled chicken wrapped in pita bread with fresh vegetables',180,'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400','non-veg',4.5,12,false)
ON CONFLICT DO NOTHING;