/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ficha Técnica y Modelo de Datos Integral del Producto para Ferretería Industrial
 */

export type StockStatus = 'green' | 'yellow' | 'red';

export type ApplicationTag = 'Metal' | 'Madera' | 'Mampostería' | 'Drywall' | 'Universal';

export interface ProductDimensions {
  diameterMm: number;
  lengthMm: number;
  diameterInches?: string;
  lengthInches?: string;
  threadPitch?: string;      // ej: "1.5 mm", "20 TPI UNC"
  driveType?: string;        // ej: "Phillips PH2", "Boca Hexagonal 10mm", "Torx T25"
  displayString: string;     // ej: "4.2 x 25 mm (#10 x 1\")"
}

export interface PhysicalLocation {
  aisle: string;    // Pasillo (ej: P3)
  shelf: string;    // Módulo/Estantería (ej: E2)
  levelBox: string; // Nivel/Caja (ej: C14)
  bin: string;      // Bin/Gaveta (ej: G08)
  code: string;     // Formato consolidado: P3-E2-C14-G08
  zoneDescription: string; // ej: "Nave Central - Pasillo 3 (Tornillería Fina)"
}

export interface Traceability {
  lastBatchDate: string;        // Fecha último ingreso (ISO)
  lastBatchQuantity: number;    // Cantidad ingresada en último lote
  nextEstimatedArrival: string | null; // Fecha estimada próximo ingreso
  pendingPurchaseOrder?: string; // Código de OC pendiente
  supplierName: string;         // Nombre proveedor principal
  supplierCode: string;         // Código en proveedor
}

export interface PricingPackaging {
  unitPrice: number;            // Precio unitario base sin IVA
  vatRate: number;              // ej: 0.21 (21%)
  profitMargin: number;         // Margen ej: 0.35 (35%)
  costPrice: number;            // Costo de compra
  
  // Fraccionamientos comunes en ferretería industrial
  pack100Price?: number;
  pack1000Price?: number;
  perKiloPrice?: number;
  unitWeightKg?: number;
}

export interface ProductGallery {
  primary: string;              // Foto HD principal
  detailThreadOrHead: string;   // Detalle macro rosca / ranura / cabeza
  technicalDrawingSvg?: string; // Esquema dimensional con cotas técnicas
}

export interface Product {
  id: string;
  sku: string;                  // SKU ferretero único (ej: "TOR-AUT-4225")
  barcode: string;              // EAN-13
  qrPayload: string;            // Payload codificado para lectura rápida

  name: string;                 // Nombre comercial normalizado
  searchKeywords: string[];     // Sinónimos y términos de búsqueda común (ej: "t1 mecha", "torniyo", "cabeza tanque")

  category: string;             // ej: "Tornillería y Fijaciones"
  subCategory: string;          // ej: "Tornillos Autoperforantes"
  application: ApplicationTag;  // ej: "Metal", "Drywall", etc.

  material: string;             // ej: "Acero cementado al carbono"
  coating: string;              // ej: "Zincado electrolítico azul 8µm"
  specStandards?: string;       // ej: "DIN 7504-N", "ISO 15480"
  
  dimensions: ProductDimensions;
  location: PhysicalLocation;

  stockCurrent: number;
  stockMinimum: number;         // Punto de reorden
  stockStatus: StockStatus;     // 'green' (>50) | 'yellow' (1-49) | 'red' (0)

  traceability: Traceability;
  pricing: PricingPackaging;
  gallery: ProductGallery;

  // Sugerencias de sustitución directa
  equivalentSubstituteIds?: string[];
  notes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  fractionType: 'unit' | 'pack100' | 'pack1000' | 'kilo';
  appliedPrice: number;
}

export interface OrderVoucher {
  id: string;
  code: string;                 // ej: "CMD-2026-8841"
  timestamp: string;
  sellerId: string;
  sellerName: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  paymentQrData: string;
}

export type UserRole = 'seller' | 'admin';

export type UnitOfMeasure = 'Unidad' | 'Kilo' | 'Caja' | 'Metro' | 'Litro' | 'Juego';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
}

export interface StoreSettings {
  storeName: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  defaultVatRate: number;
  ticketFooter: string;
}

export interface AdminAuth {
  username: string;
  password: string;
}
