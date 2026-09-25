import {
  Product,
  Ingredient,
  InventoryBalance,
  Sale,
  Purchase,
  Expense,
  PricingRule,
} from '@/types';
import { DEFAULT_PRICING_RULES } from '@/utils/pricing';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-roti-kukus',
    name: 'Roti Kukus Thailand',
    description: 'Roti kukus lembut khas Thailand dengan aneka topping pilihan',
    sku: 'RKT-BASE',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_PRICING_RULES: PricingRule[] = DEFAULT_PRICING_RULES;

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ing-1', name: 'Roti', category: 'Bahan Utama', base_unit: 'pcs', minimum_stock: 20, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-2', name: 'Mika plastik', category: 'Kemasan', base_unit: 'pcs', minimum_stock: 50, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-3', name: 'Cokelat', category: 'Topping', base_unit: 'gram', minimum_stock: 250, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-4', name: 'Green Tea', category: 'Topping', base_unit: 'gram', minimum_stock: 200, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-5', name: 'Tiramisu', category: 'Topping', base_unit: 'gram', minimum_stock: 200, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-6', name: 'Blueberry', category: 'Topping', base_unit: 'gram', minimum_stock: 200, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-7', name: 'Strawberry', category: 'Topping', base_unit: 'gram', minimum_stock: 200, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-8', name: 'Red Velvet', category: 'Topping', base_unit: 'gram', minimum_stock: 200, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-9', name: 'Sosis', category: 'Topping', base_unit: 'pcs', minimum_stock: 15, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-10', name: 'Baso', category: 'Topping', base_unit: 'pcs', minimum_stock: 15, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-11', name: 'Mentega', category: 'Bahan Utama', base_unit: 'gram', minimum_stock: 250, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-12', name: 'Keju', category: 'Topping', base_unit: 'gram', minimum_stock: 150, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-13', name: 'Jagung', category: 'Topping', base_unit: 'gram', minimum_stock: 200, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-14', name: 'Saus sambal', category: 'Saus', base_unit: 'gram', minimum_stock: 100, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-15', name: 'Saus tomat', category: 'Saus', base_unit: 'gram', minimum_stock: 100, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-16', name: 'Gas LPG', category: 'Operasional', base_unit: 'tabung', minimum_stock: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // 2 Topping Baru sesuai Instruksi Bisnis Owner
  { id: 'ing-17', name: 'Susu', category: 'Topping', base_unit: 'gram', minimum_stock: 150, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ing-18', name: 'Kacang', category: 'Topping', base_unit: 'gram', minimum_stock: 150, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_INVENTORY_BALANCES: InventoryBalance[] = INITIAL_INGREDIENTS.map((ing) => ({
  id: `bal-${ing.id}`,
  ingredient_id: ing.id,
  current_quantity: 0,
  updated_at: new Date().toISOString(),
  ingredient: ing,
}));

export const INITIAL_SALES: Sale[] = [];
export const INITIAL_PURCHASES: Purchase[] = [];
export const INITIAL_EXPENSES: Expense[] = [];
