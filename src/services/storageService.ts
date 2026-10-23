/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Capa de Persistencia Local Offline-First (LocalStorage / IndexedDB Ready)
 * y Gestión Centralizada de Catálogo, Categorías, Precios y Seguridad Admin.
 */

import { Product, CategoryItem, StoreSettings, AdminAuth } from '../types/product';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/catalog';

const STORAGE_KEY = 'ferrefast_catalog_v2';
const CATEGORIES_KEY = 'ferrefast_categories_v2';
const SETTINGS_KEY = 'ferrefast_settings_v2';
const AUTH_KEY = 'ferrefast_auth_v2';
const INFLATION_LOG_KEY = 'ferrefast_inflation_logs_v2';

export interface InflationLog {
  id: string;
  timestamp: string;
  percentage: number;
  scope: 'global' | 'category' | 'supplier';
  targetName?: string;
  itemsAffected: number;
  user: string;
}

// ----------------- CATALOG PERSISTENCE -----------------

export function loadCatalog(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCatalog(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Error loading catalog from storage, fallback to seeds:', err);
  }
  return INITIAL_PRODUCTS;
}

export function saveCatalog(catalog: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    window.dispatchEvent(new CustomEvent('ferrefast_catalog_updated', { detail: { catalog } }));
  } catch (err) {
    console.error('Error saving catalog to storage:', err);
  }
}

export function resetCatalogToFactory(): Product[] {
  saveCatalog(INITIAL_PRODUCTS);
  saveCategories(INITIAL_CATEGORIES);
  return INITIAL_PRODUCTS;
}

export function addProductToCatalog(product: Product): Product[] {
  const current = loadCatalog();
  const updated = [product, ...current];
  saveCatalog(updated);
  return updated;
}

export function updateProductInCatalog(product: Product): Product[] {
  const current = loadCatalog();
  const updated = current.map(p => (p.id === product.id ? product : p));
  saveCatalog(updated);
  return updated;
}

export function deleteProductFromCatalog(productId: string): Product[] {
  const current = loadCatalog();
  const updated = current.filter(p => p.id !== productId);
  saveCatalog(updated);
  return updated;
}

// ----------------- CATEGORIES PERSISTENCE -----------------

export function loadCategories(): CategoryItem[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  saveCategories(INITIAL_CATEGORIES);
  return INITIAL_CATEGORIES;
}

export function saveCategories(categories: CategoryItem[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('ferrefast_categories_updated', { detail: { categories } }));
  } catch (e) {
    console.error(e);
  }
}

export function addCategory(category: CategoryItem): CategoryItem[] {
  const cats = loadCategories();
  const updated = [...cats, category];
  saveCategories(updated);
  return updated;
}

export function updateCategory(category: CategoryItem): CategoryItem[] {
  const cats = loadCategories();
  const updated = cats.map(c => (c.id === category.id ? category : c));
  saveCategories(updated);
  return updated;
}

export function deleteCategory(categoryId: string): CategoryItem[] {
  const cats = loadCategories();
  const updated = cats.filter(c => c.id !== categoryId);
  saveCategories(updated);
  return updated;
}

// ----------------- STORE SETTINGS PERSISTENCE -----------------

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Ferretería Industrial La Central S.A.',
  taxId: 'CUIT: 30-71489201-9',
  address: 'Av. Industrial 4850, Parque Industrial Oeste',
  phone: '+54 11 4820-9900',
  email: 'ventas@ferreterialacentral.com',
  defaultVatRate: 0.21,
  ticketFooter: 'Gracias por su compra. Cambios con este comprobante dentro de los 30 días.'
};

export function loadSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('ferrefast_settings_updated', { detail: { settings } }));
  } catch (e) {
    console.error(e);
  }
}

// ----------------- ADMIN SECURITY CREDENTIALS -----------------

export const DEFAULT_ADMIN_AUTH: AdminAuth = {
  username: 'Admin',
  password: 'admin123'
};

export function loadAdminAuth(): AdminAuth {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_ADMIN_AUTH;
}

export function saveAdminAuth(auth: AdminAuth): void {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } catch (e) {
    console.error(e);
  }
}

export function validateAdminLogin(u: string, p: string): boolean {
  const auth = loadAdminAuth();
  return u.trim() === auth.username.trim() && p.trim() === auth.password.trim();
}

// ----------------- INFLATION & PRICE AUDIT -----------------

export function loadInflationLogs(): InflationLog[] {
  try {
    const raw = localStorage.getItem(INFLATION_LOG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [
    {
      id: 'inf-001',
      timestamp: '2026-10-01 08:30',
      percentage: 12.5,
      scope: 'category',
      targetName: 'Tornillería y Fijaciones',
      itemsAffected: 6,
      user: 'Admin Central'
    }
  ];
}

export function recordInflationLog(log: Omit<InflationLog, 'id' | 'timestamp'>): void {
  const existing = loadInflationLogs();
  const newEntry: InflationLog = {
    id: 'inf-' + Date.now(),
    timestamp: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
    ...log
  };
  const updated = [newEntry, ...existing];
  localStorage.setItem(INFLATION_LOG_KEY, JSON.stringify(updated));
}

export function applyMassivePriceIncrease(
  catalog: Product[],
  percentage: number,
  scope: 'global' | 'category' | 'supplier',
  targetValue?: string,
  user: string = 'Administrador'
): { updatedCatalog: Product[]; affectedCount: number } {
  const factor = 1 + percentage / 100;
  let affectedCount = 0;

  const updatedCatalog = catalog.map(prod => {
    let matches = false;
    if (scope === 'global') matches = true;
    else if (scope === 'category' && prod.category === targetValue) matches = true;
    else if (scope === 'supplier' && prod.traceability.supplierName === targetValue) matches = true;

    if (!matches) return prod;

    affectedCount++;
    const newUnitPrice = Math.round(prod.pricing.unitPrice * factor * 100) / 100;
    const newCostPrice = Math.round(prod.pricing.costPrice * factor * 100) / 100;
    const newPack100 = prod.pricing.pack100Price ? Math.round(prod.pricing.pack100Price * factor * 100) / 100 : undefined;
    const newPack1000 = prod.pricing.pack1000Price ? Math.round(prod.pricing.pack1000Price * factor * 100) / 100 : undefined;
    const newPerKilo = prod.pricing.perKiloPrice ? Math.round(prod.pricing.perKiloPrice * factor * 100) / 100 : undefined;

    return {
      ...prod,
      pricing: {
        ...prod.pricing,
        unitPrice: newUnitPrice,
        costPrice: newCostPrice,
        pack100Price: newPack100,
        pack1000Price: newPack1000,
        perKiloPrice: newPerKilo
      }
    };
  });

  saveCatalog(updatedCatalog);

  recordInflationLog({
    percentage,
    scope,
    targetName: targetValue || 'Todo el Catálogo',
    itemsAffected: affectedCount,
    user
  });

  return { updatedCatalog, affectedCount };
}

export function importPricesFromCsvText(
  catalog: Product[],
  csvText: string,
  user: string = 'Administrador'
): { updatedCatalog: Product[]; updatedCount: number; errors: string[] } {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  const skuPriceMap = new Map<string, number>();
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length < 2) return;

    const sku = parts[0];
    const priceStr = parts[1].replace('$', '').replace(',', '.');
    const priceNum = parseFloat(priceStr);

    if (isNaN(priceNum) || priceNum <= 0) {
      if (index > 0 && !sku.toUpperCase().includes('SKU')) {
        errors.push(`Línea ${index + 1}: Precio inválido '${parts[1]}' para SKU '${sku}'`);
      }
      return;
    }
    skuPriceMap.set(sku.toUpperCase(), priceNum);
  });

  let updatedCount = 0;
  const updatedCatalog = catalog.map(prod => {
    const newPrice = skuPriceMap.get(prod.sku.toUpperCase());
    if (newPrice !== undefined) {
      updatedCount++;
      return {
        ...prod,
        pricing: {
          ...prod.pricing,
          unitPrice: newPrice,
          pack100Price: prod.pricing.pack100Price ? Math.round(newPrice * 90) : undefined,
          pack1000Price: prod.pricing.pack1000Price ? Math.round(newPrice * 800) : undefined
        }
      };
    }
    return prod;
  });

  if (updatedCount > 0) {
    saveCatalog(updatedCatalog);
    recordInflationLog({
      percentage: 0,
      scope: 'global',
      targetName: `Importación CSV (${updatedCount} ítems)`,
      itemsAffected: updatedCount,
      user
    });
  }

  return { updatedCatalog, updatedCount, errors };
}

/**
 * Importación masiva de Catálogo Completo (para miles de productos)
 * Columnas esperadas:
 * SKU;NOMBRE;CATEGORIA;SUBCATEGORIA;MEDIDAS;UBICACION;STOCK;PRECIO_COSTO;MARGEN;PRECIO_VENTA
 */
export function importFullCatalogCsv(
  currentCatalog: Product[],
  csvText: string,
  user: string = 'Administrador'
): { updatedCatalog: Product[]; createdCount: number; updatedCount: number; errors: string[] } {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  const errors: string[] = [];
  let createdCount = 0;
  let updatedCount = 0;

  const catalogMap = new Map<string, Product>();
  currentCatalog.forEach(p => catalogMap.set(p.sku.toUpperCase(), p));

  lines.forEach((line, idx) => {
    // Si es cabecera
    if (idx === 0 && line.toLowerCase().includes('sku')) return;

    const cols = line.split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 3) return;

    const sku = cols[0];
    const name = cols[1];
    const category = cols[2] || 'Tornillería y Fijaciones';
    const subCategory = cols[3] || 'General';
    const dimensions = cols[4] || 'Estándar';
    const locationCode = cols[5] || 'P1-E1-C01';
    const stock = parseInt(cols[6] || '50', 10) || 0;
    const costPrice = parseFloat((cols[7] || '1').replace(',', '.')) || 1;
    const margin = parseFloat((cols[8] || '0.35').replace(',', '.')) || 0.35;
    const unitPrice = parseFloat((cols[9] || (costPrice * (1 + margin)).toFixed(2)).replace(',', '.')) || (costPrice * (1 + margin));

    if (!sku || !name) {
      errors.push(`Fila ${idx + 1}: SKU o Nombre ausente.`);
      return;
    }

    const locParts = locationCode.split('-');
    const aisle = locParts[0] || 'P1';
    const shelf = locParts[1] || 'E1';
    const levelBox = locParts[2] || 'C01';

    const stockStatus = stock > 50 ? 'green' : stock > 0 ? 'yellow' : 'red';

    const existing = catalogMap.get(sku.toUpperCase());
    if (existing) {
      updatedCount++;
      catalogMap.set(sku.toUpperCase(), {
        ...existing,
        name,
        category,
        subCategory,
        dimensions: {
          ...existing.dimensions,
          displayString: dimensions
        },
        location: {
          ...existing.location,
          code: locationCode,
          aisle,
          shelf,
          levelBox
        },
        stockCurrent: stock,
        stockStatus,
        pricing: {
          ...existing.pricing,
          costPrice,
          profitMargin: margin,
          unitPrice
        }
      });
    } else {
      createdCount++;
      const newProduct: Product = {
        id: 'prod-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        sku,
        barcode: '779' + Math.floor(1000000000 + Math.random() * 9000000000),
        qrPayload: `FERREFAST:${sku}:LOC_${locationCode}`,
        name,
        searchKeywords: [name.toLowerCase(), sku.toLowerCase(), dimensions.toLowerCase(), category.toLowerCase()],
        category,
        subCategory,
        application: 'Metal',
        material: 'Acero Estándar',
        coating: 'Zincado / Natural',
        dimensions: {
          diameterMm: 0,
          lengthMm: 0,
          displayString: dimensions
        },
        location: {
          aisle,
          shelf,
          levelBox,
          bin: 'G01',
          code: locationCode,
          zoneDescription: `Pasillo ${aisle}`
        },
        stockCurrent: stock,
        stockMinimum: 20,
        stockStatus,
        traceability: {
          lastBatchDate: new Date().toISOString().split('T')[0],
          lastBatchQuantity: stock,
          nextEstimatedArrival: null,
          supplierName: 'Distribuidor Industrial',
          supplierCode: sku
        },
        pricing: {
          unitPrice,
          vatRate: 0.21,
          profitMargin: margin,
          costPrice,
          pack100Price: Math.round(unitPrice * 90),
          pack1000Price: Math.round(unitPrice * 800)
        },
        gallery: {
          primary: '/icon.svg',
          detailThreadOrHead: '/icon.svg'
        }
      };
      catalogMap.set(sku.toUpperCase(), newProduct);
    }
  });

  const updatedCatalog = Array.from(catalogMap.values());
  saveCatalog(updatedCatalog);

  recordInflationLog({
    percentage: 0,
    scope: 'global',
    targetName: `Importación Masiva (${createdCount} altas, ${updatedCount} actualizados)`,
    itemsAffected: createdCount + updatedCount,
    user
  });

  return { updatedCatalog, createdCount, updatedCount, errors };
}
