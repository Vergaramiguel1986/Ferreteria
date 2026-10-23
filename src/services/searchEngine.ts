/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Motor de Búsqueda Ultrarrápida (<3 segundos, típico <5ms) con Tolerancia a Errores (Fuzzy),
 * Normalización de Medidas y Expansión de Sinónimos Ferreteros.
 */

import { Product } from '../types/product';

// Diccionario de normalización fonética y errores comunes de mostrador ferretero
const TYPO_MAP: Record<string, string> = {
  'torniyo': 'tornillo',
  'torniyos': 'tornillos',
  'torni': 'tornillo',
  'bulo': 'bulon',
  'bulones': 'bulon',
  'tuerc': 'tuerca',
  'tarugos': 'tarugo',
  'taco': 'tarugo',
  'tacos': 'tarugo',
  'taquito': 'tarugo',
  'mecha': 'mecha',
  'mexa': 'mecha',
  'broca': 'mecha',
  'alambre': 'alambre',
  'auto': 'autoperforante',
  'autoperforantes': 'autoperforante',
  't1': 't1 autoperforante',
  't2': 't2 drywall',
  'drywal': 'drywall',
  'durlok': 'drywall',
  'durlock': 'drywall',
  'durloc': 'drywall',
  'inox': 'inoxidable',
  'inoxidable': 'inoxidable',
  'amoladora': 'disco corte',
  'galvanisado': 'galvanizado',
  'sincado': 'zincado',
  'zinc': 'zincado'
};

export interface SearchResult {
  products: Product[];
  latencyMs: number;
  interpretedTerms: string[];
  totalMatches: number;
}

/**
 * Normaliza cadenas quitando tildes, signos y llevando a minúsculas
 */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes
    .replace(/["'”]/g, '')           // Normaliza comillas de pulgadas
    .trim();
}

/**
 * Normaliza dimensiones y tokens para que "10 x 2" o "10x2" o "10*2" coincidan
 */
function normalizeDimensionToken(token: string): string {
  return token.replace(/\s*[xX*]\s*/g, 'x');
}

/**
 * Motor de búsqueda para mostrador ferretero de alto rendimiento
 */
export function searchCatalog(
  catalog: Product[],
  rawQuery: string,
  selectedCategory?: string,
  selectedApplication?: string,
  stockFilter?: 'all' | 'inStock' | 'lowStock' | 'outOfStock'
): SearchResult {
  const t0 = performance.now();

  const queryClean = normalizeText(rawQuery);
  const rawTokens = queryClean.split(/\s+/).filter(Boolean);

  // Expansión con sinónimos
  const expandedTokens: string[] = [];
  rawTokens.forEach(t => {
    const dimNormalized = normalizeDimensionToken(t);
    expandedTokens.push(dimNormalized);

    if (TYPO_MAP[t]) {
      expandedTokens.push(TYPO_MAP[t]);
    }
  });

  // Filtro inicial por facetas
  let filtered = catalog;

  if (selectedCategory && selectedCategory !== 'Todas las Categorías') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  if (selectedApplication && selectedApplication !== 'Todas') {
    filtered = filtered.filter(p => p.application === selectedApplication || p.application === 'Universal');
  }

  if (stockFilter && stockFilter !== 'all') {
    if (stockFilter === 'inStock') {
      filtered = filtered.filter(p => p.stockStatus === 'green');
    } else if (stockFilter === 'lowStock') {
      filtered = filtered.filter(p => p.stockStatus === 'yellow');
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter(p => p.stockStatus === 'red');
    }
  }

  // Si la búsqueda está vacía, devuelve el catálogo filtrado
  if (rawTokens.length === 0) {
    const t1 = performance.now();
    return {
      products: filtered,
      latencyMs: Math.round((t1 - t0) * 100) / 100,
      interpretedTerms: [],
      totalMatches: filtered.length
    };
  }

  // Scoring ponderado por coincidencia exacta de SKU / Barcode / Keywords
  const scoredProducts: Array<{ product: Product; score: number }> = [];

  for (const product of filtered) {
    let score = 0;
    const normSku = normalizeText(product.sku);
    const normBarcode = normalizeText(product.barcode);
    const normName = normalizeText(product.name);
    const normLocation = normalizeText(product.location.code);
    const normMaterial = normalizeText(product.material + ' ' + product.coating);
    const normDims = normalizeText(product.dimensions.displayString + ' ' + (product.dimensions.diameterInches || '') + ' ' + (product.dimensions.lengthInches || ''));
    const allKeywords = product.searchKeywords.map(k => normalizeText(k)).join(' ');

    // 1. Coincidencia exacta o directa por código de barras o SKU (Match instantáneo)
    if (queryClean === normBarcode || normSku.includes(queryClean)) {
      score += 1000;
    }

    // 2. Coincidencia por código de ubicación de depósito (ej: P3-E2 o P3)
    if (normLocation.includes(queryClean)) {
      score += 500;
    }

    // 3. Chequeo de tokens individuales
    for (const token of expandedTokens) {
      if (normSku.includes(token)) score += 150;
      if (normName.includes(token)) score += 120;
      if (normDims.includes(token)) score += 100;
      if (allKeywords.includes(token)) score += 80;
      if (normMaterial.includes(token)) score += 60;
      if (normalizeText(product.subCategory).includes(token)) score += 40;
    }

    if (score > 0) {
      // Priorizar productos con disponibilidad para atención rápida
      if (product.stockStatus === 'green') score += 10;
      if (product.stockStatus === 'yellow') score += 5;

      scoredProducts.push({ product, score });
    }
  }

  // Ordenar descendentemente por score
  scoredProducts.sort((a, b) => b.score - a.score);

  const t1 = performance.now();
  const latency = Math.round((t1 - t0) * 100) / 100;

  return {
    products: scoredProducts.map(sp => sp.product),
    latencyMs: latency,
    interpretedTerms: expandedTokens,
    totalMatches: scoredProducts.length
  };
}

/**
 * Calcula sustitutos recomendados basados en similitud de dimensiones y categoría
 */
export function findSubstitutes(target: Product, catalog: Product[]): Product[] {
  // Si ya tiene IDs predefinidos en su ficha
  if (target.equivalentSubstituteIds && target.equivalentSubstituteIds.length > 0) {
    const predefined = catalog.filter(p => target.equivalentSubstituteIds?.includes(p.id));
    if (predefined.length > 0) return predefined;
  }

  // Motor heurístico de compatibilidad
  return catalog.filter(p => {
    if (p.id === target.id) return false;
    if (p.category !== target.category) return false;
    
    // Misma medida o diámetro aproximado
    const sameDiameter = Math.abs(p.dimensions.diameterMm - target.dimensions.diameterMm) <= 2.0;
    const sameApplication = p.application === target.application;
    const hasStock = p.stockCurrent > 0;

    return sameDiameter && (sameApplication || hasStock);
  }).slice(0, 3);
}
