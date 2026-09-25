-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Products table (Base Item: Roti Kukus Thailand)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Pricing Rules Table (Revisi Aturan Bisnis Ibu Ai: 1 Topping = Rp3.000, Mixed Topping = Rp5.000)
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  min_unique_toppings INTEGER NOT NULL CHECK (min_unique_toppings >= 1),
  max_unique_toppings INTEGER CHECK (max_unique_toppings IS NULL OR max_unique_toppings >= min_unique_toppings),
  selling_price NUMERIC(12, 2) NOT NULL CHECK (selling_price >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Ingredients / raw materials & toppings
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Bahan Utama', 'Topping', 'Saus', 'Kemasan', 'Operasional')),
  base_unit TEXT NOT NULL,
  minimum_stock NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Ingredient costs tracking
CREATE TABLE IF NOT EXISTS ingredient_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  purchase_unit TEXT NOT NULL,
  purchase_quantity NUMERIC(12, 2) NOT NULL CHECK (purchase_quantity > 0),
  purchase_price NUMERIC(12, 2) NOT NULL CHECK (purchase_price >= 0),
  unit_cost NUMERIC(12, 4) NOT NULL CHECK (unit_cost >= 0),
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source_purchase_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Inventory Balances
CREATE TABLE IF NOT EXISTS inventory_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID NOT NULL UNIQUE REFERENCES ingredients(id) ON DELETE CASCADE,
  current_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Inventory Movements
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase', 'sale_consumption', 'adjustment_in', 'adjustment_out', 'waste', 'return', 'correction')),
  quantity NUMERIC(12, 2) NOT NULL,
  unit TEXT NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Sales
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL UNIQUE,
  sold_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL DEFAULT 'Tunai',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled', 'corrected', 'pending_sync')),
  note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Sale items (Menyimpan unique_topping_count & calculated_unit_price)
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unique_topping_count INTEGER NOT NULL CHECK (unique_topping_count >= 1),
  calculated_unit_price NUMERIC(12, 2) NOT NULL CHECK (calculated_unit_price >= 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  recorded_hpp NUMERIC(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Sale item toppings (Relasi daftar topping per porsi penjualan)
CREATE TABLE IF NOT EXISTS sale_item_toppings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_item_id UUID NOT NULL REFERENCES sale_items(id) ON DELETE CASCADE,
  topping_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  note TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_number TEXT NOT NULL UNIQUE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  purchased_at DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'unpaid')),
  note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Purchase Items
CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN ('Bahan', 'Kemasan', 'Gas/LPG', 'Transportasi', 'Operasional', 'Peralatan', 'Lainnya')),
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL DEFAULT 'Tunai',
  note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'correction')),
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON sales(sold_at);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_sale_item_toppings_sale_item_id ON sale_item_toppings(sale_item_id);
CREATE INDEX IF NOT EXISTS idx_sale_item_toppings_topping_id ON sale_item_toppings(topping_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_ingredient_id ON inventory_movements(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_purchases_purchased_at ON purchases(purchased_at);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_item_toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('CREATE POLICY "Allow authenticated access %s" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;
