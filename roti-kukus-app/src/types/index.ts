export type Role = 'owner' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  min_unique_toppings: number;
  max_unique_toppings?: number | null;
  selling_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type IngredientCategory = 'Bahan Utama' | 'Topping' | 'Saus' | 'Kemasan' | 'Operasional';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  base_unit: string;
  minimum_stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IngredientCost {
  id: string;
  ingredient_id: string;
  purchase_unit: string;
  purchase_quantity: number;
  purchase_price: number;
  unit_cost: number;
  effective_date: string;
  source_purchase_id?: string | null;
  created_at: string;
}

export interface InventoryBalance {
  id: string;
  ingredient_id: string;
  current_quantity: number;
  updated_at: string;
  ingredient?: Ingredient;
}

export type MovementType =
  | 'purchase'
  | 'sale_consumption'
  | 'adjustment_in'
  | 'adjustment_out'
  | 'waste'
  | 'return'
  | 'correction';

export interface InventoryMovement {
  id: string;
  ingredient_id: string;
  movement_type: MovementType;
  quantity: number;
  unit: string;
  reference_type?: string | null;
  reference_id?: string | null;
  note?: string | null;
  created_at: string;
  created_by?: string | null;
  ingredient?: Ingredient;
}

export type PaymentMethod = 'Tunai' | 'QRIS' | 'Transfer' | 'Lainnya';
export type SaleStatus = 'completed' | 'cancelled' | 'corrected' | 'pending_sync';

export interface SaleItemTopping {
  id: string;
  sale_item_id: string;
  topping_id: string;
  quantity: number;
  created_at: string;
  topping?: Ingredient;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unique_topping_count: number;
  calculated_unit_price: number;
  subtotal: number;
  recorded_hpp?: number | null;
  created_at: string;
  product?: Product;
  toppings?: SaleItemTopping[];
}

export interface Sale {
  id: string;
  invoice_number: string;
  sold_at: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  status: SaleStatus;
  note?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  items?: SaleItem[];
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string | null;
  note?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  purchase_number: string;
  supplier_id?: string | null;
  purchased_at: string;
  subtotal: number;
  total: number;
  payment_status: 'paid' | 'unpaid';
  note?: string | null;
  created_by?: string | null;
  created_at: string;
  supplier?: Supplier;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
  created_at: string;
  ingredient?: Ingredient;
}

export type ExpenseCategory =
  | 'Bahan'
  | 'Kemasan'
  | 'Gas/LPG'
  | 'Transportasi'
  | 'Operasional'
  | 'Peralatan'
  | 'Lainnya';

export interface Expense {
  id: string;
  expense_date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  payment_method: PaymentMethod;
  note?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'correction';
  before_data?: Record<string, unknown> | null;
  after_data?: Record<string, unknown> | null;
  created_at: string;
}
