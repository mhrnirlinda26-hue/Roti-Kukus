import { PricingRule } from '@/types';

export const DEFAULT_PRICING_RULES: PricingRule[] = [
  {
    id: 'rule-single',
    name: '1 Topping',
    min_unique_toppings: 1,
    max_unique_toppings: 1,
    selling_price: 3000,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rule-mixed',
    name: 'Mixed Topping',
    min_unique_toppings: 2,
    max_unique_toppings: null,
    selling_price: 5000,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Menghitung jumlah jenis topping unik dari daftar topping ID
 */
export function getUniqueToppingCount(toppingIds: string[]): number {
  const uniqueSet = new Set(toppingIds.filter((id) => Boolean(id)));
  return uniqueSet.size;
}

/**
 * Menentukan harga jual per porsi berdasarkan jumlah jenis topping unik
 * Aturan Bisnis Ibu Ai Salamah:
 * - 0 topping -> Error / 0
 * - 1 topping unik -> Rp3.000
 * - >= 2 topping unik -> Rp5.000
 */
export function calculateUnitPrice(
  uniqueToppingCount: number,
  rules: PricingRule[] = DEFAULT_PRICING_RULES
): { price: number; ruleName: string; error?: string } {
  if (uniqueToppingCount < 1) {
    return {
      price: 0,
      ruleName: '',
      error: 'Minimal pilih 1 topping.',
    };
  }

  // Cari matching rule
  const matchedRule = rules.find((r) => {
    if (!r.is_active) return false;
    if (r.max_unique_toppings !== null && r.max_unique_toppings !== undefined) {
      return (
        uniqueToppingCount >= r.min_unique_toppings &&
        uniqueToppingCount <= r.max_unique_toppings
      );
    }
    return uniqueToppingCount >= r.min_unique_toppings;
  });

  if (matchedRule) {
    return {
      price: matchedRule.selling_price,
      ruleName: matchedRule.name,
    };
  }

  // Fallback default jika tidak ada rule
  if (uniqueToppingCount === 1) {
    return { price: 3000, ruleName: '1 Topping' };
  }
  return { price: 5000, ruleName: 'Mixed Topping' };
}
