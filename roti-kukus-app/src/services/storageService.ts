import {
  Product,
  Ingredient,
  InventoryBalance,
  InventoryMovement,
  Sale,
  Purchase,
  Expense,
  PricingRule,
  AuditLog,
} from '@/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_PRICING_RULES,
  INITIAL_INGREDIENTS,
  INITIAL_INVENTORY_BALANCES,
} from './mockData';
import { getJakartaDateString } from '@/utils/formatters';

export interface CreateSaleResult {
  success: boolean;
  saleId: string;
  invoiceNumber: string;
  total: number;
  itemQuantity: number;
  transactionCount: number; // Jumlah record transaksi aktual hari ini
}

class StorageService {
  private inMemoryFallback: Record<string, string> = {};

  public clearStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    this.inMemoryFallback = {};
  }

  private getStorage<T>(key: string, defaultValue: T): T {
    let data: string | null = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      data = window.localStorage.getItem(key);
    } else {
      data = this.inMemoryFallback[key] || null;
    }

    if (!data) {
      this.setStorage(key, defaultValue);
      return defaultValue;
    }
    try {
      const parsed = JSON.parse(data);
      if (key === 'rkt_ingredients' && Array.isArray(parsed)) {
        let hasNew = false;
        const currentList: Ingredient[] = [...parsed];
        for (const initIng of INITIAL_INGREDIENTS) {
          if (!currentList.some((x) => x.name.toLowerCase() === initIng.name.toLowerCase())) {
            currentList.push(initIng);
            hasNew = true;
          }
        }
        if (hasNew) {
          this.setStorage(key, currentList);
          return currentList as unknown as T;
        }
      }
      return parsed;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
    } else {
      this.inMemoryFallback[key] = serialized;
    }
  }

  getProducts(): Product[] {
    return this.getStorage<Product[]>('rkt_products', INITIAL_PRODUCTS);
  }

  getPricingRules(): PricingRule[] {
    return this.getStorage<PricingRule[]>('rkt_pricing_rules', INITIAL_PRICING_RULES);
  }

  getIngredients(): Ingredient[] {
    return this.getStorage<Ingredient[]>('rkt_ingredients', INITIAL_INGREDIENTS);
  }

  saveIngredient(ingredient: Ingredient): void {
    const list = this.getIngredients();
    const idx = list.findIndex((i) => i.id === ingredient.id);
    if (idx >= 0) {
      list[idx] = ingredient;
    } else {
      list.push(ingredient);
    }
    this.setStorage('rkt_ingredients', list);
  }

  getInventoryBalances(): InventoryBalance[] {
    const balances = this.getStorage<InventoryBalance[]>(
      'rkt_inventory_balances',
      INITIAL_INVENTORY_BALANCES
    );
    const ingredients = this.getIngredients();
    return balances.map((b) => ({
      ...b,
      ingredient: ingredients.find((i) => i.id === b.ingredient_id),
    }));
  }

  getMovements(): InventoryMovement[] {
    return this.getStorage<InventoryMovement[]>('rkt_inventory_movements', []);
  }

  addMovement(movement: Omit<InventoryMovement, 'id' | 'created_at'>): void {
    const movements = this.getMovements();
    const newMovement: InventoryMovement = {
      ...movement,
      id: 'mov-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
    };
    movements.unshift(newMovement);
    this.setStorage('rkt_inventory_movements', movements);

    // Update balance
    const balances = this.getInventoryBalances();
    const balIdx = balances.findIndex((b) => b.ingredient_id === movement.ingredient_id);
    if (balIdx >= 0) {
      balances[balIdx].current_quantity += movement.quantity;
      balances[balIdx].updated_at = new Date().toISOString();
      this.setStorage('rkt_inventory_balances', balances);
    } else {
      balances.push({
        id: 'bal-' + movement.ingredient_id,
        ingredient_id: movement.ingredient_id,
        current_quantity: movement.quantity,
        updated_at: new Date().toISOString(),
      });
      this.setStorage('rkt_inventory_balances', balances);
    }
  }

  getSales(): Sale[] {
    return this.getStorage<Sale[]>('rkt_sales', []);
  }

  getTodayTransactionCount(targetDate: string = getJakartaDateString()): number {
    const sales = this.getSales();
    return sales.filter((s) => s.status !== 'cancelled' && getJakartaDateString(s.sold_at) === targetDate).length;
  }

  createSale(sale: Sale): CreateSaleResult {
    const sales = this.getSales();
    sales.unshift(sale);
    this.setStorage('rkt_sales', sales);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('rkt_sales_updated'));
    }

    const rotiIng = this.getIngredients().find((i) => i.name.toLowerCase().includes('roti'));
    const mikaIng = this.getIngredients().find((i) => i.name.toLowerCase().includes('mika'));

    let totalItemQuantity = 0;

    if (sale.items) {
      for (const item of sale.items) {
        totalItemQuantity += item.quantity;

        if (rotiIng) {
          this.addMovement({
            ingredient_id: rotiIng.id,
            movement_type: 'sale_consumption',
            quantity: -item.quantity,
            unit: rotiIng.base_unit,
            reference_type: 'sale',
            reference_id: sale.id,
            note: `Penjualan ${sale.invoice_number} (Roti)`,
          });
        }

        if (mikaIng) {
          this.addMovement({
            ingredient_id: mikaIng.id,
            movement_type: 'sale_consumption',
            quantity: -item.quantity,
            unit: mikaIng.base_unit,
            reference_type: 'sale',
            reference_id: sale.id,
            note: `Penjualan ${sale.invoice_number} (Kemasan Mika)`,
          });
        }

        if (item.toppings) {
          for (const top of item.toppings) {
            this.addMovement({
              ingredient_id: top.topping_id,
              movement_type: 'sale_consumption',
              quantity: -item.quantity,
              unit: top.topping?.base_unit || 'gram',
              reference_type: 'sale',
              reference_id: sale.id,
              note: `Penjualan ${sale.invoice_number} (Topping: ${top.topping?.name || 'Topping'})`,
            });
          }
        }
      }
    }

    const todayDateStr = getJakartaDateString(sale.sold_at);
    const updatedTransactionCount = sales.filter(
      (s) => s.status !== 'cancelled' && getJakartaDateString(s.sold_at) === todayDateStr
    ).length;

    return {
      success: true,
      saleId: sale.id,
      invoiceNumber: sale.invoice_number,
      total: sale.total,
      itemQuantity: totalItemQuantity,
      transactionCount: updatedTransactionCount,
    };
  }

  getPurchases(): Purchase[] {
    return this.getStorage<Purchase[]>('rkt_purchases', []);
  }

  createPurchase(purchase: Purchase): void {
    const purchases = this.getPurchases();
    purchases.unshift(purchase);
    this.setStorage('rkt_purchases', purchases);

    if (purchase.items) {
      for (const pItem of purchase.items) {
        this.addMovement({
          ingredient_id: pItem.ingredient_id,
          movement_type: 'purchase',
          quantity: pItem.quantity,
          unit: pItem.unit,
          reference_type: 'purchase',
          reference_id: purchase.id,
          note: `Pembelian ${purchase.purchase_number}`,
        });
      }
    }
  }

  getExpenses(): Expense[] {
    return this.getStorage<Expense[]>('rkt_expenses', []);
  }

  createExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    expenses.unshift(expense);
    this.setStorage('rkt_expenses', expenses);
  }

  getAuditLogs(): AuditLog[] {
    return this.getStorage<AuditLog[]>('rkt_audit_logs', []);
  }

  addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      ...log,
      id: 'log-' + Date.now(),
      created_at: new Date().toISOString(),
    });
    this.setStorage('rkt_audit_logs', logs);
  }
}

export const storageService = new StorageService();
