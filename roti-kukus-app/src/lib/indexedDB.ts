import { openDB, DBSchema } from 'idb';
import { Sale } from '@/types';

interface RotiKukusDB extends DBSchema {
  offline_sales: {
    key: string;
    value: Sale & { queued_at: string };
  };
  cached_products: {
    key: string;
    value: unknown;
  };
  cached_ingredients: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'roti_kukus_pos_db';
const DB_VERSION = 1;

export async function getLocalDatabase() {
  return openDB<RotiKukusDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('offline_sales')) {
        db.createObjectStore('offline_sales', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cached_products')) {
        db.createObjectStore('cached_products', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cached_ingredients')) {
        db.createObjectStore('cached_ingredients', { keyPath: 'id' });
      }
    },
  });
}

export async function queueOfflineSale(sale: Sale): Promise<void> {
  const db = await getLocalDatabase();
  await db.put('offline_sales', {
    ...sale,
    status: 'pending_sync',
    queued_at: new Date().toISOString(),
  });
}

export async function getPendingOfflineSales(): Promise<Sale[]> {
  const db = await getLocalDatabase();
  return db.getAll('offline_sales');
}

export async function removePendingOfflineSale(id: string): Promise<void> {
  const db = await getLocalDatabase();
  await db.delete('offline_sales', id);
}
