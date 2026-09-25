-- Seed Base Product (Roti Kukus Thailand)
INSERT INTO products (id, name, description, sku, is_active)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Roti Kukus Thailand', 'Roti kukus lembut khas Thailand dengan aneka topping pilihan', 'RKT-BASE', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Pricing Rules (1 Topping = Rp3.000, Mixed Topping = Rp5.000)
INSERT INTO pricing_rules (id, name, min_unique_toppings, max_unique_toppings, selling_price, is_active)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '1 Topping', 1, 1, 3000.00, true),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Mixed Topping', 2, NULL, 5000.00, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Ingredients (Termasuk Susu & Kacang)
INSERT INTO ingredients (id, name, category, base_unit, minimum_stock, is_active)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'Roti', 'Bahan Utama', 'pcs', 20, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'Mika plastik', 'Kemasan', 'pcs', 50, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', 'Cokelat', 'Topping', 'gram', 250, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', 'Green Tea', 'Topping', 'gram', 200, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05', 'Tiramisu', 'Topping', 'gram', 200, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b06', 'Blueberry', 'Topping', 'gram', 200, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b07', 'Strawberry', 'Topping', 'gram', 200, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b08', 'Red Velvet', 'Topping', 'gram', 200, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b09', 'Sosis', 'Topping', 'pcs', 15, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b10', 'Baso', 'Topping', 'pcs', 15, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'Mentega', 'Bahan Utama', 'gram', 250, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'Keju', 'Topping', 'gram', 150, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'Jagung', 'Topping', 'gram', 200, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'Saus sambal', 'Saus', 'gram', 100, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'Saus tomat', 'Saus', 'gram', 100, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b16', 'Gas LPG', 'Operasional', 'tabung', 1, true),
  -- 2 Topping Baru
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b17', 'Susu', 'Topping', 'gram', 150, true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b18', 'Kacang', 'Topping', 'gram', 150, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Balances with 0 stock
INSERT INTO inventory_balances (ingredient_id, current_quantity)
SELECT id, 0 FROM ingredients
ON CONFLICT (ingredient_id) DO NOTHING;
