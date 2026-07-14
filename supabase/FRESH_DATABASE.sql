-- =============================================================================
-- CODEHAAT — FRESH DATABASE SETUP
-- =============================================================================
-- Run this in Supabase SQL Editor for a clean start.
-- This will DELETE ALL data and recreate everything.
-- =============================================================================

-- STEP 1: DROP EVERYTHING
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_product_category_change ON products;
DROP TRIGGER IF EXISTS on_order_status_change ON orders;
DROP TRIGGER IF EXISTS on_review_change ON reviews;

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_category_product_count() CASCADE;
DROP FUNCTION IF EXISTS update_product_sales_count() CASCADE;
DROP FUNCTION IF EXISTS update_product_rating() CASCADE;

DROP TABLE IF EXISTS disputes CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS escrow CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- STEP 2: CREATE EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 3: CREATE TABLES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'developer', 'admin')),
  bio TEXT,
  avatar_url TEXT,
  github_username TEXT,
  github_access_token TEXT,
  website TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  product_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  price_paise INTEGER NOT NULL CHECK (price_paise >= 4900),
  original_price_paise INTEGER,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  github_repo_url TEXT,
  github_repo_id INTEGER,
  preview_url TEXT,
  image_url TEXT,
  demo_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  sales_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallets (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  balance_paise INTEGER NOT NULL DEFAULT 0 CHECK (balance_paise >= 0),
  pending_paise INTEGER NOT NULL DEFAULT 0 CHECK (pending_paise >= 0),
  total_earned_paise INTEGER NOT NULL DEFAULT 0,
  total_spent_paise INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_user_id UUID NOT NULL REFERENCES wallets(user_id),
  type TEXT NOT NULL CHECK (type IN ('topup', 'purchase', 'sale', 'withdrawal', 'refund', 'adjustment', 'commission')),
  amount_paise INTEGER NOT NULL,
  balance_after_paise INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  product_id UUID NOT NULL REFERENCES products(id),
  amount_paise INTEGER NOT NULL,
  platform_fee_paise INTEGER NOT NULL,
  seller_amount_paise INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'refunded', 'disputed', 'cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  github_repo_url TEXT,
  github_transfer_status TEXT CHECK (github_transfer_status IN ('pending', 'transferring', 'completed', 'failed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  disputed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);

CREATE TABLE escrow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) UNIQUE,
  amount_paise INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'released', 'refunded', 'disputed')),
  held_until TIMESTAMPTZ NOT NULL,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  raised_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  resolution TEXT,
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- STEP 4: CREATE INDEXES
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_wallet_tx_user ON wallet_transactions(wallet_user_id);
CREATE INDEX idx_wallet_tx_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_tx_created ON wallet_transactions(created_at);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_escrow_status ON escrow(status);
CREATE INDEX idx_escrow_held_until ON escrow(held_until);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- STEP 5: CREATE FUNCTIONS
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  INSERT INTO public.wallets (user_id, balance_paise)
  VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE categories SET product_count = product_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE categories SET product_count = product_count - 1 WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
    UPDATE categories SET product_count = product_count - 1 WHERE id = OLD.category_id;
    UPDATE categories SET product_count = product_count + 1 WHERE id = NEW.category_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_product_sales_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE products SET sales_count = sales_count + 1 WHERE id = NEW.product_id;
  ELSIF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    UPDATE products SET sales_count = sales_count - 1 WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 6: CREATE TRIGGERS
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_product_category_change
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_product_sales_count();

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- STEP 7: SEED CATEGORIES
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Web Templates', 'web-templates', 'layout', 1),
  ('Mobile Apps', 'mobile-apps', 'smartphone', 2),
  ('UI Kits', 'ui-kits', 'palette', 3),
  ('B.Tech Projects', 'btech-projects', 'graduation-cap', 4),
  ('Boilerplates', 'boilerplates', 'terminal', 5),
  ('API Templates', 'api-templates', 'code', 6);

-- STEP 8: ENABLE RLS ON ALL TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- STEP 9: CREATE RLS POLICIES
-- PROFILES
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE USING (auth.uid() = id);

-- CATEGORIES
CREATE POLICY "categories_select" ON categories FOR SELECT USING (true);

-- PRODUCTS
CREATE POLICY "products_select_active" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "products_select_own" ON products FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "products_manage_own" ON products FOR ALL USING (auth.uid() = seller_id);

-- WALLETS
CREATE POLICY "wallets_manage_own" ON wallets FOR ALL USING (auth.uid() = user_id);

-- WALLET TRANSACTIONS
CREATE POLICY "wallet_tx_manage_own" ON wallet_transactions FOR ALL USING (
  wallet_user_id IN (SELECT user_id FROM wallets WHERE user_id = auth.uid())
);

-- ORDERS
CREATE POLICY "orders_select_buyer" ON orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "orders_select_seller" ON orders FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ESCROW
CREATE POLICY "escrow_select" ON escrow FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid() OR seller_id = auth.uid())
);

-- REVIEWS
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE POLICY "notifications_manage_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- DISPUTES
CREATE POLICY "disputes_select" ON disputes FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid() OR seller_id = auth.uid())
);
CREATE POLICY "disputes_insert" ON disputes FOR INSERT WITH CHECK (auth.uid() = raised_by);

-- DONE!
-- All tables created, RLS policies set, triggers working.
-- You need to re-register your account after running this.
