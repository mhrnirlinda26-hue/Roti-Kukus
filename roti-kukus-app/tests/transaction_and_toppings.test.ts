import { calculateUnitPrice, getUniqueToppingCount } from '../src/utils/pricing';
import { getJakartaDateString } from '../src/utils/formatters';
import { storageService } from '../src/services/storageService';
import { Sale } from '../src/types';

describe('Transaction Count & New Toppings Tests', () => {
  beforeEach(() => {
    storageService.clearStorage();
  });

  // Test 1: Database kosong -> Buat 1 transaksi -> expected transactionCount = 1 (Bukan 0)
  test('Test 1: Buat 1 transaksi pada database kosong -> transactionCount = 1 (bukan 0)', () => {
    const sale: Sale = {
      id: 'test-sale-1',
      invoice_number: 'INV-TEST-001',
      sold_at: new Date().toISOString(),
      subtotal: 3000,
      discount: 0,
      total: 3000,
      payment_method: 'Tunai',
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: 'item-1',
          sale_id: 'test-sale-1',
          product_id: 'prod-roti',
          quantity: 1,
          unique_topping_count: 1,
          calculated_unit_price: 3000,
          subtotal: 3000,
          created_at: new Date().toISOString(),
        },
      ],
    };

    const result = storageService.createSale(sale);
    expect(result.success).toBe(true);
    expect(result.transactionCount).toBe(1);
    expect(result.transactionCount).not.toBe(0);
  });

  // Test 2: Sudah ada 5 transaksi hari ini -> Buat 1 transaksi baru -> expected transactionCount = 6
  test('Test 2: Sudah ada 5 transaksi hari ini -> Buat 1 transaksi baru -> transactionCount = 6', () => {
    // Seed 5 transaksi sebelumnya
    for (let i = 1; i <= 5; i++) {
      storageService.createSale({
        id: `test-sale-${i}`,
        invoice_number: `INV-TEST-00${i}`,
        sold_at: new Date().toISOString(),
        subtotal: 3000,
        discount: 0,
        total: 3000,
        payment_method: 'Tunai',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [],
      });
    }

    const newSale: Sale = {
      id: 'test-sale-6',
      invoice_number: 'INV-TEST-006',
      sold_at: new Date().toISOString(),
      subtotal: 5000,
      discount: 0,
      total: 5000,
      payment_method: 'Tunai',
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [],
    };

    const result = storageService.createSale(newSale);
    expect(result.transactionCount).toBe(6);
  });

  // Test 3: Buat 1 transaksi dengan 5 unit -> expected transactionCount = 1, unitsSold = 5
  test('Test 3: 1 transaksi dengan 5 unit -> transactionCount = 1, unitsSold = 5 (bukan 5 transaksi)', () => {
    const sale: Sale = {
      id: 'test-sale-units',
      invoice_number: 'INV-TEST-UNITS',
      sold_at: new Date().toISOString(),
      subtotal: 15000,
      discount: 0,
      total: 15000,
      payment_method: 'Tunai',
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: 'item-1',
          sale_id: 'test-sale-units',
          product_id: 'prod-roti',
          quantity: 5, // 5 unit
          unique_topping_count: 1,
          calculated_unit_price: 3000,
          subtotal: 15000,
          created_at: new Date().toISOString(),
        },
      ],
    };

    const result = storageService.createSale(sale);
    expect(result.transactionCount).toBe(1);
    expect(result.itemQuantity).toBe(5);
  });

  // Test 4: Buat 3 item berbeda dalam satu checkout -> expected transactionCount = 1
  test('Test 4: 3 item berbeda dalam satu checkout -> transactionCount = 1', () => {
    const sale: Sale = {
      id: 'test-sale-multi-items',
      invoice_number: 'INV-TEST-MULTI',
      sold_at: new Date().toISOString(),
      subtotal: 11000,
      discount: 0,
      total: 11000,
      payment_method: 'Tunai',
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        { id: 'i1', sale_id: '', product_id: 'p', quantity: 1, unique_topping_count: 1, calculated_unit_price: 3000, subtotal: 3000, created_at: '' },
        { id: 'i2', sale_id: '', product_id: 'p', quantity: 1, unique_topping_count: 1, calculated_unit_price: 3000, subtotal: 3000, created_at: '' },
        { id: 'i3', sale_id: '', product_id: 'p', quantity: 1, unique_topping_count: 2, calculated_unit_price: 5000, subtotal: 5000, created_at: '' },
      ],
    };

    const result = storageService.createSale(sale);
    expect(result.transactionCount).toBe(1);
    expect(result.itemQuantity).toBe(3);
  });

  // Test 5: Buat 3 transaksi terpisah -> expected transactionCount = 3
  test('Test 5: 3 transaksi terpisah -> transactionCount = 3', () => {
    for (let i = 1; i <= 3; i++) {
      storageService.createSale({
        id: `sep-${i}`,
        invoice_number: `INV-SEP-${i}`,
        sold_at: new Date().toISOString(),
        subtotal: 3000,
        discount: 0,
        total: 3000,
        payment_method: 'Tunai',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [],
      });
    }

    const todayCount = storageService.getTodayTransactionCount();
    expect(todayCount).toBe(3);
  });

  // Test 6: Transaksi tanggal 25 September 2026 pukul 23:50 WIB -> masuk 25 September 2026
  test('Test 6: Transaksi 25 September 2026 pukul 23:50 WIB -> masuk tanggal 25 September 2026 Asia/Jakarta', () => {
    // 2026-09-25 23:50:00 WIB = 2026-09-25T16:50:00.000Z UTC
    const wibTimestamp = '2026-09-25T16:50:00.000Z';
    const jakartaDate = getJakartaDateString(wibTimestamp);

    expect(jakartaDate).toBe('2026-09-25');
  });

  // Test 7: Roti + Susu -> expected uniqueToppingCount = 1, price = 3000
  test('Test 7: Roti + Susu -> uniqueToppingCount = 1, price = 3000', () => {
    const count = getUniqueToppingCount(['ing-susu']);
    expect(count).toBe(1);

    const pricing = calculateUnitPrice(count);
    expect(pricing.price).toBe(3000);
    expect(pricing.ruleName).toBe('1 Topping');
  });

  // Test 8: Roti + Kacang -> expected uniqueToppingCount = 1, price = 3000
  test('Test 8: Roti + Kacang -> uniqueToppingCount = 1, price = 3000', () => {
    const count = getUniqueToppingCount(['ing-kacang']);
    expect(count).toBe(1);

    const pricing = calculateUnitPrice(count);
    expect(pricing.price).toBe(3000);
    expect(pricing.ruleName).toBe('1 Topping');
  });

  // Test 9: Roti + Susu + Kacang -> expected uniqueToppingCount = 2, price = 5000
  test('Test 9: Roti + Susu + Kacang -> uniqueToppingCount = 2, price = 5000', () => {
    const count = getUniqueToppingCount(['ing-susu', 'ing-kacang']);
    expect(count).toBe(2);

    const pricing = calculateUnitPrice(count);
    expect(pricing.price).toBe(5000);
    expect(pricing.ruleName).toBe('Mixed Topping');
  });

  // Test 10: Roti + Cokelat + Susu -> expected uniqueToppingCount = 2, price = 5000
  test('Test 10: Roti + Cokelat + Susu -> uniqueToppingCount = 2, price = 5000', () => {
    const count = getUniqueToppingCount(['ing-cokelat', 'ing-susu']);
    expect(count).toBe(2);

    const pricing = calculateUnitPrice(count);
    expect(pricing.price).toBe(5000);
    expect(pricing.ruleName).toBe('Mixed Topping');
  });
});
