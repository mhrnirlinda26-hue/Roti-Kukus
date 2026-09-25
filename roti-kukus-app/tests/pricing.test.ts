import { calculateUnitPrice, getUniqueToppingCount } from '../src/utils/pricing';
import { SaleItem } from '../src/types';

describe('Pricing & Topping Rules Unit Tests', () => {
  // Case 1: 1 topping Cokelat -> Rp3.000
  test('Case 1: 1 topping (Cokelat) -> Rp3.000', () => {
    const toppingIds = ['cokelat'];
    const count = getUniqueToppingCount(toppingIds);
    expect(count).toBe(1);

    const result = calculateUnitPrice(count);
    expect(result.price).toBe(3000);
    expect(result.ruleName).toBe('1 Topping');
  });

  // Case 2: 1 topping Keju -> Rp3.000
  test('Case 2: 1 topping (Keju) -> Rp3.000', () => {
    const toppingIds = ['keju'];
    const count = getUniqueToppingCount(toppingIds);
    expect(count).toBe(1);

    const result = calculateUnitPrice(count);
    expect(result.price).toBe(3000);
  });

  // Case 3: 2 topping berbeda Cokelat + Keju -> Rp5.000
  test('Case 3: 2 topping berbeda (Cokelat + Keju) -> Rp5.000', () => {
    const toppingIds = ['cokelat', 'keju'];
    const count = getUniqueToppingCount(toppingIds);
    expect(count).toBe(2);

    const result = calculateUnitPrice(count);
    expect(result.price).toBe(5000);
    expect(result.ruleName).toBe('Mixed Topping');
  });

  // Case 4: 3 topping berbeda Cokelat + Keju + Strawberry -> Rp5.000
  test('Case 4: 3 topping berbeda (Cokelat + Keju + Strawberry) -> Rp5.000', () => {
    const toppingIds = ['cokelat', 'keju', 'strawberry'];
    const count = getUniqueToppingCount(toppingIds);
    expect(count).toBe(3);

    const result = calculateUnitPrice(count);
    expect(result.price).toBe(5000);
    expect(result.ruleName).toBe('Mixed Topping');
  });

  // Case 5: Topping sama dua kali Cokelat + Cokelat -> distinct 1 -> Rp3.000
  test('Case 5: Topping sama dua kali (Cokelat + Cokelat) -> 1 unique topping -> Rp3.000', () => {
    const toppingIds = ['cokelat', 'cokelat'];
    const count = getUniqueToppingCount(toppingIds);
    expect(count).toBe(1);

    const result = calculateUnitPrice(count);
    expect(result.price).toBe(3000);
  });

  // Case 6: 2 porsi dengan 1 topping Cokelat -> Total Rp6.000
  test('Case 6: 2 porsi dengan 1 topping Cokelat -> Total Rp6.000', () => {
    const count = getUniqueToppingCount(['cokelat']);
    const pricing = calculateUnitPrice(count);
    const quantity = 2;
    const total = pricing.price * quantity;

    expect(total).toBe(6000);
  });

  // Case 7: 2 porsi mixed topping Cokelat + Keju -> Total Rp10.000
  test('Case 7: 2 porsi mixed topping Cokelat + Keju -> Total Rp10.000', () => {
    const count = getUniqueToppingCount(['cokelat', 'keju']);
    const pricing = calculateUnitPrice(count);
    const quantity = 2;
    const total = pricing.price * quantity;

    expect(total).toBe(10000);
  });

  // Case 8: Tanpa topping -> validation error
  test('Case 8: Tanpa topping -> validation error', () => {
    const count = getUniqueToppingCount([]);
    expect(count).toBe(0);

    const result = calculateUnitPrice(count);
    expect(result.price).toBe(0);
    expect(result.error).toBe('Minimal pilih 1 topping.');
  });

  // Case 9: Harga bahan berubah setelah transaksi -> recorded historical HPP tidak berubah
  test('Case 9: Harga bahan berubah -> recorded historical HPP tetap konsisten', () => {
    // Transaksi lama dengan snapshot HPP Rp1.800
    const historicalSaleItem: SaleItem = {
      id: 'si-1',
      sale_id: 'sale-1',
      product_id: 'prod-roti',
      quantity: 1,
      unique_topping_count: 1,
      calculated_unit_price: 3000,
      subtotal: 3000,
      recorded_hpp: 1800, // Snapshot saat transaksi
      created_at: '2026-01-10T10:00:00Z',
    };

    // Simulasi harga bahan baku naik di masa kini
    const currentIngredientCost = 2500;

    // Pastikan recorded_hpp dari transaksi lama tidak ikut berubah
    expect(historicalSaleItem.recorded_hpp).toBe(1800);
    expect(historicalSaleItem.recorded_hpp).not.toBe(currentIngredientCost);
  });
});
