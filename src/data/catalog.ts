/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Catálogo Semilla de Ferretería Industrial con datos técnicos hiper-reales
 */

import { Product } from '../types/product';

// Rutas de imágenes generadas con fidelidad comercial
import imgTornilloAuto from '../assets/images/tornillo_autoperforante_hd_1792715963731.jpg';
import imgBulonHex from '../assets/images/bulon_hexagonal_acero_1792715964697.jpg';
import imgTarugoNylon from '../assets/images/tarugo_fijacion_nylon_1792715965429.jpg';
import imgDiscoCorte from '../assets/images/disco_corte_industrial_1792715965446.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'TOR-T1-4225-ZC',
    barcode: '7798123456012',
    qrPayload: 'FERREFAST:TOR-T1-4225-ZC:STOCK_LOC_P3-E2-C14',
    name: 'Tornillo Autoperforante T1 Cabeza Tanque Mecha',
    searchKeywords: [
      'tornillo autoperforante', 't1', 'cabeza tanque', 'mecha', 'punta mecha',
      'torniyo 10x2', '10 x 1', '4.2x25', 'chapa metal', 'drywall', 'philips'
    ],
    category: 'Tornillería y Fijaciones',
    subCategory: 'Tornillos Autoperforantes',
    application: 'Metal',
    material: 'Acero cementado al carbono SAE 1022',
    coating: 'Zincado azul electrolítico 8µm (antioxidación)',
    specStandards: 'DIN 7504-N / ISO 15480',
    dimensions: {
      diameterMm: 4.2,
      lengthMm: 25.0,
      diameterInches: '#10 (0.190")',
      lengthInches: '1"',
      threadPitch: '1.4 mm paso estándar para chapa',
      driveType: 'Ranura Phillips PH2',
      displayString: '4.2 x 25 mm (#10 x 1")'
    },
    location: {
      aisle: 'P3',
      shelf: 'E2',
      levelBox: 'C14',
      bin: 'G08',
      code: 'P3-E2-C14',
      zoneDescription: 'Nave Central - Pasillo 3 (Tornillos Autoperforantes & Chapa)'
    },
    stockCurrent: 480,
    stockMinimum: 100,
    stockStatus: 'green',
    traceability: {
      lastBatchDate: '2026-09-15',
      lastBatchQuantity: 2000,
      nextEstimatedArrival: '2026-11-05',
      pendingPurchaseOrder: 'OC-2026-904',
      supplierName: 'Fijaciones Industriales Tel S.A.',
      supplierCode: 'TEL-T1-4225'
    },
    pricing: {
      unitPrice: 0.12,
      vatRate: 0.21,
      profitMargin: 0.40,
      costPrice: 0.08,
      pack100Price: 10.50,
      pack1000Price: 92.00,
      perKiloPrice: 28.50,
      unitWeightKg: 0.0035
    },
    gallery: {
      primary: imgTornilloAuto,
      detailThreadOrHead: imgTornilloAuto,
      technicalDrawingSvg: `<svg viewBox="0 0 400 140" fill="none" stroke="#94a3b8" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 70 L90 50 L90 90 Z" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
        <rect x="90" y="55" width="220" height="30" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
        <line x1="120" y1="55" x2="110" y2="85" stroke="#f59e0b" stroke-width="2"/>
        <line x1="150" y1="55" x2="140" y2="85" stroke="#f59e0b" stroke-width="2"/>
        <line x1="180" y1="55" x2="170" y2="85" stroke="#f59e0b" stroke-width="2"/>
        <line x1="210" y1="55" x2="200" y2="85" stroke="#f59e0b" stroke-width="2"/>
        <line x1="240" y1="55" x2="230" y2="85" stroke="#f59e0b" stroke-width="2"/>
        <line x1="270" y1="55" x2="260" y2="85" stroke="#f59e0b" stroke-width="2"/>
        <line x1="300" y1="55" x2="290" y2="85" stroke="#f59e0b" stroke-width="2"/>
        <path d="M310 40 C340 40 340 100 310 100 Z" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
        <line x1="90" y1="120" x2="310" y2="120" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="180" y="135" fill="#38bdf8" font-size="12" font-family="monospace">L: 25.0 mm</text>
        <line x1="20" y1="55" x2="20" y2="85" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="5" y="75" fill="#38bdf8" font-size="11" font-family="monospace">Ø 4.2</text>
      </svg>`
    },
    equivalentSubstituteIds: ['prod-002', 'prod-005'],
    notes: 'Ideal para perfiles C de drywall y zinguería sobre tubos de hasta 2.5 mm.'
  },
  {
    id: 'prod-002',
    sku: 'TOR-T1-INOX-4225',
    barcode: '7798123456029',
    qrPayload: 'FERREFAST:TOR-T1-INOX-4225:STOCK_LOC_P3-E2-C15',
    name: 'Tornillo Autoperforante T1 Acero Inoxidable AISI 304',
    searchKeywords: [
      'tornillo autoperforante inox', 't1 inox', 'acero inoxidable', 'cabeza tanque inox',
      '4.2x25 inox', 'anti oxido', 'nautica', 'alimentos'
    ],
    category: 'Tornillería y Fijaciones',
    subCategory: 'Tornillos Autoperforantes',
    application: 'Metal',
    material: 'Acero Inoxidable Austenítico AISI 304 (A2)',
    coating: 'Pasivado brillante natural (alta resistencia marina)',
    specStandards: 'DIN 7504-N / AISI 304',
    dimensions: {
      diameterMm: 4.2,
      lengthMm: 25.0,
      diameterInches: '#10',
      lengthInches: '1"',
      threadPitch: '1.4 mm paso chapa',
      driveType: 'Ranura Phillips PH2',
      displayString: '4.2 x 25 mm (#10 x 1") INOX'
    },
    location: {
      aisle: 'P3',
      shelf: 'E2',
      levelBox: 'C15',
      bin: 'G02',
      code: 'P3-E2-C15',
      zoneDescription: 'Nave Central - Pasillo 3 (Línea Inoxidable Alta Resistencia)'
    },
    stockCurrent: 32, // Stock Crítico (Amarillo)
    stockMinimum: 50,
    stockStatus: 'yellow',
    traceability: {
      lastBatchDate: '2026-08-10',
      lastBatchQuantity: 500,
      nextEstimatedArrival: '2026-10-28',
      pendingPurchaseOrder: 'OC-2026-981',
      supplierName: 'InoxFix Distribuidora',
      supplierCode: 'INX-T1-4225'
    },
    pricing: {
      unitPrice: 0.38,
      vatRate: 0.21,
      profitMargin: 0.38,
      costPrice: 0.24,
      pack100Price: 34.00,
      pack1000Price: 310.00,
      unitWeightKg: 0.0036
    },
    gallery: {
      primary: imgTornilloAuto,
      detailThreadOrHead: imgTornilloAuto
    },
    equivalentSubstituteIds: ['prod-001', 'prod-005'],
    notes: 'Uso en ambientes salinos, industria alimentaria y carpintería de aluminio exterior.'
  },
  {
    id: 'prod-003',
    sku: 'BUL-HEX-88-M12X50',
    barcode: '7798123456036',
    qrPayload: 'FERREFAST:BUL-HEX-88-M12X50:STOCK_LOC_P2-E1-C03',
    name: 'Bulón Cabeza Hexagonal Grado 8.8 M12 x 50mm Paso 1.75',
    searchKeywords: [
      'bulon hexagonal', 'tornillo hexagonal', 'bulon 8.8', 'alta resistencia',
      'm12', 'm12x50', 'tuerca m12', '1/2 pulgada', 'llave 19mm', 'mecanica pesada'
    ],
    category: 'Tornillería y Fijaciones',
    subCategory: 'Bulonería Pesada',
    application: 'Metal',
    material: 'Acero de media aleación templado y revenido Grado 8.8',
    coating: 'Zincado amarillo bicromatado / galvanizado electrolítico',
    specStandards: 'DIN 933 / ISO 4017 Rosca Total',
    dimensions: {
      diameterMm: 12.0,
      lengthMm: 50.0,
      diameterInches: '1/2" aprox',
      lengthInches: '2"',
      threadPitch: 'M12 x 1.75 mm métrico grueso',
      driveType: 'Cabeza Hexagonal - Ancho entre caras 19 mm (3/4")',
      displayString: 'M12 x 50 mm (Paso 1.75)'
    },
    location: {
      aisle: 'P2',
      shelf: 'E1',
      levelBox: 'C03',
      bin: 'G12',
      code: 'P2-E1-C03',
      zoneDescription: 'Nave Central - Pasillo 2 (Bulonería Estructural & Mecánica)'
    },
    stockCurrent: 210,
    stockMinimum: 60,
    stockStatus: 'green',
    traceability: {
      lastBatchDate: '2026-10-01',
      lastBatchQuantity: 600,
      nextEstimatedArrival: '2026-11-20',
      pendingPurchaseOrder: 'OC-2026-1020',
      supplierName: 'Bulonera Central Metalúrgica',
      supplierCode: 'BCM-88-1250'
    },
    pricing: {
      unitPrice: 0.95,
      vatRate: 0.21,
      profitMargin: 0.35,
      costPrice: 0.62,
      pack100Price: 82.00,
      pack1000Price: 750.00,
      perKiloPrice: 12.80,
      unitWeightKg: 0.054
    },
    gallery: {
      primary: imgBulonHex,
      detailThreadOrHead: imgBulonHex,
      technicalDrawingSvg: `<svg viewBox="0 0 400 140" fill="none" stroke="#94a3b8" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,35 70,35 90,70 70,105 40,105 20,70" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
        <rect x="90" y="50" width="240" height="40" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
        <line x1="120" y1="50" x2="105" y2="90" stroke="#38bdf8" stroke-width="2"/>
        <line x1="150" y1="50" x2="135" y2="90" stroke="#38bdf8" stroke-width="2"/>
        <line x1="180" y1="50" x2="165" y2="90" stroke="#38bdf8" stroke-width="2"/>
        <line x1="210" y1="50" x2="195" y2="90" stroke="#38bdf8" stroke-width="2"/>
        <line x1="240" y1="50" x2="225" y2="90" stroke="#38bdf8" stroke-width="2"/>
        <line x1="270" y1="50" x2="255" y2="90" stroke="#38bdf8" stroke-width="2"/>
        <line x1="300" y1="50" x2="285" y2="90" stroke="#38bdf8" stroke-width="2"/>
        <line x1="90" y1="115" x2="330" y2="115" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="180" y="130" fill="#f59e0b" font-size="12" font-family="monospace">Largo: 50 mm</text>
        <text x="340" y="75" fill="#38bdf8" font-size="12" font-family="monospace">M12</text>
      </svg>`
    },
    equivalentSubstituteIds: ['prod-004'],
    notes: 'Resistencia a tracción: 800 N/mm². Para bridas, motores y estructuras metálicas pesadas.'
  },
  {
    id: 'prod-004',
    sku: 'BUL-HEX-88-M12X60',
    barcode: '7798123456043',
    qrPayload: 'FERREFAST:BUL-HEX-88-M12X60:STOCK_LOC_P2-E1-C04',
    name: 'Bulón Cabeza Hexagonal Grado 8.8 M12 x 60mm Paso 1.75',
    searchKeywords: [
      'bulon m12x60', 'm12 60', 'tornillo m12 60mm', 'bulon 8.8 60mm', 'sustituto m12x50'
    ],
    category: 'Tornillería y Fijaciones',
    subCategory: 'Bulonería Pesada',
    application: 'Metal',
    material: 'Acero Grado 8.8 templado',
    coating: 'Zincado electrolítico',
    specStandards: 'DIN 933',
    dimensions: {
      diameterMm: 12.0,
      lengthMm: 60.0,
      diameterInches: '1/2"',
      lengthInches: '2-3/8"',
      threadPitch: 'M12 x 1.75 mm',
      driveType: 'Cabeza Hexagonal 19 mm',
      displayString: 'M12 x 60 mm (Paso 1.75)'
    },
    location: {
      aisle: 'P2',
      shelf: 'E1',
      levelBox: 'C04',
      bin: 'G03',
      code: 'P2-E1-C04',
      zoneDescription: 'Nave Central - Pasillo 2'
    },
    stockCurrent: 85,
    stockMinimum: 40,
    stockStatus: 'green',
    traceability: {
      lastBatchDate: '2026-09-20',
      lastBatchQuantity: 300,
      nextEstimatedArrival: '2026-11-20',
      supplierName: 'Bulonera Central Metalúrgica',
      supplierCode: 'BCM-88-1260'
    },
    pricing: {
      unitPrice: 1.10,
      vatRate: 0.21,
      profitMargin: 0.35,
      costPrice: 0.72,
      pack100Price: 95.00,
      pack1000Price: 870.00,
      unitWeightKg: 0.062
    },
    gallery: {
      primary: imgBulonHex,
      detailThreadOrHead: imgBulonHex
    },
    equivalentSubstituteIds: ['prod-003'],
    notes: 'Equivalente inmediato cuando el espesor de arandela o platina requiere 10mm más de vástago.'
  },
  {
    id: 'prod-005',
    sku: 'TAR-NYL-UNIV-8MM',
    barcode: '7798123456050',
    qrPayload: 'FERREFAST:TAR-NYL-UNIV-8MM:STOCK_LOC_P1-E4-C02',
    name: 'Tarugo Taco de Fijación Nylon Universal SX 8mm con Tope',
    searchKeywords: [
      'tarugo', 'tarugo de 8', 'tarugos', 'taco de 8', 'tarugo nylon', 'fischer',
      'sx 8', 'tarugo con tope', 'mamposteria', 'ladrillo hueco', 'hormigon'
    ],
    category: 'Tornillería y Fijaciones',
    subCategory: 'Fijaciones para Mampostería',
    application: 'Mampostería',
    material: 'Poliamida 6 (Nylon Virgen indeformable)',
    coating: 'Resistente a rayos UV, temperatura -40°C a +80°C',
    specStandards: 'ETA-15/0263',
    dimensions: {
      diameterMm: 8.0,
      lengthMm: 40.0,
      diameterInches: '5/16"',
      lengthInches: '1-9/16"',
      threadPitch: 'Acepta tornillo tira fondo 4.5 a 6.0 mm',
      driveType: 'Expansión 4 direcciones con aletas antirrotación',
      displayString: 'Ø 8 x 40 mm (Broca 8mm)'
    },
    location: {
      aisle: 'P1',
      shelf: 'E4',
      levelBox: 'C02',
      bin: 'G01',
      code: 'P1-E4-C02',
      zoneDescription: 'Nave Central - Pasillo 1 (Tarugos, Químicos & Anclajes)'
    },
    stockCurrent: 850,
    stockMinimum: 200,
    stockStatus: 'green',
    traceability: {
      lastBatchDate: '2026-10-10',
      lastBatchQuantity: 2500,
      nextEstimatedArrival: '2026-11-15',
      pendingPurchaseOrder: 'OC-2026-1055',
      supplierName: 'Fischer / Fixer Anclajes',
      supplierCode: 'FSX-0840'
    },
    pricing: {
      unitPrice: 0.08,
      vatRate: 0.21,
      profitMargin: 0.45,
      costPrice: 0.045,
      pack100Price: 6.80,
      pack1000Price: 58.00,
      unitWeightKg: 0.002
    },
    gallery: {
      primary: imgTarugoNylon,
      detailThreadOrHead: imgTarugoNylon,
      technicalDrawingSvg: `<svg viewBox="0 0 400 140" fill="none" stroke="#94a3b8" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="50" width="20" height="40" rx="3" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
        <rect x="80" y="55" width="220" height="30" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <line x1="140" y1="55" x2="220" y2="70" stroke="#f59e0b" stroke-width="2"/>
        <line x1="140" y1="85" x2="220" y2="70" stroke="#f59e0b" stroke-width="2"/>
        <path d="M300 55 L320 70 L300 85 Z" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
        <line x1="60" y1="110" x2="320" y2="110" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="170" y="125" fill="#38bdf8" font-size="12" font-family="monospace">Largo: 40 mm</text>
        <text x="25" y="75" fill="#f59e0b" font-size="12" font-family="monospace">Ø 8 mm</text>
      </svg>`
    },
    equivalentSubstituteIds: ['prod-006'],
    notes: 'Óptima fijación en hormigón, ladrillo macizo, ladrillo hueco y bloque de hormigón celular.'
  },
  {
    id: 'prod-006',
    sku: 'TAR-NYL-UNIV-10MM',
    barcode: '7798123456067',
    qrPayload: 'FERREFAST:TAR-NYL-UNIV-10MM:STOCK_LOC_P1-E4-C03',
    name: 'Tarugo Taco de Fijación Nylon SX 10mm Carga Pesada',
    searchKeywords: [
      'tarugo de 10', 'taco de 10', 'tarugo 10mm', 'sx 10', 'tarugo pesado'
    ],
    category: 'Tornillería y Fijaciones',
    subCategory: 'Fijaciones para Mampostería',
    application: 'Mampostería',
    material: 'Poliamida 6 Virgen',
    coating: 'Gris industrial',
    specStandards: 'ETA-15/0263',
    dimensions: {
      diameterMm: 10.0,
      lengthMm: 50.0,
      diameterInches: '3/8"',
      lengthInches: '2"',
      threadPitch: 'Tornillo 6 a 8 mm',
      driveType: 'Expansión cuádruple',
      displayString: 'Ø 10 x 50 mm (Broca 10mm)'
    },
    location: {
      aisle: 'P1',
      shelf: 'E4',
      levelBox: 'C03',
      bin: 'G05',
      code: 'P1-E4-C03',
      zoneDescription: 'Nave Central - Pasillo 1'
    },
    stockCurrent: 0, // AGOTADO (Rojo)
    stockMinimum: 100,
    stockStatus: 'red',
    traceability: {
      lastBatchDate: '2026-07-22',
      lastBatchQuantity: 1500,
      nextEstimatedArrival: '2026-10-30',
      pendingPurchaseOrder: 'OC-2026-940',
      supplierName: 'Fischer / Fixer Anclajes',
      supplierCode: 'FSX-1050'
    },
    pricing: {
      unitPrice: 0.14,
      vatRate: 0.21,
      profitMargin: 0.40,
      costPrice: 0.085,
      pack100Price: 12.00,
      pack1000Price: 105.00,
      unitWeightKg: 0.0038
    },
    gallery: {
      primary: imgTarugoNylon,
      detailThreadOrHead: imgTarugoNylon
    },
    equivalentSubstituteIds: ['prod-005', 'prod-001'],
    notes: 'Agotado temporalmente. Se sugiere utilizar Tarugo SX 8mm reforzado con tirafondo más largo o brocal químico.'
  },
  {
    id: 'prod-007',
    sku: 'DIS-COR-INOX-115X10',
    barcode: '7798123456074',
    qrPayload: 'FERREFAST:DIS-COR-INOX-115X10:STOCK_LOC_P4-E3-C08',
    name: 'Disco de Corte Extra Fino Acero Inox & Metal 115 x 1.0 x 22.2mm',
    searchKeywords: [
      'disco corte', 'disco 115', 'disco amoladora', 'corte fino', 'corte inox',
      'disco 1mm', '4 1/2', 'flexicut', 'abrasivo'
    ],
    category: 'Abrasivos y Corte',
    subCategory: 'Discos Abrasivos de Corte',
    application: 'Metal',
    material: 'Óxido de aluminio refinado con ligante de resina sintética',
    coating: 'Doble malla de fibra de vidrio de seguridad (80 m/s max 13.300 RPM)',
    specStandards: 'EN 12413 / ISO 9001 / OSA',
    dimensions: {
      diameterMm: 115.0,
      lengthMm: 1.0,
      diameterInches: '4-1/2"',
      lengthInches: '3/64" (1.0 mm espesor)',
      threadPitch: 'Buje central 22.23 mm (7/8")',
      driveType: 'Montaje en amoladora angular 115mm (4.5")',
      displayString: '115 x 1.0 x 22.23 mm (4-1/2" x 1mm)'
    },
    location: {
      aisle: 'P4',
      shelf: 'E3',
      levelBox: 'C08',
      bin: 'G15',
      code: 'P4-E3-C08',
      zoneDescription: 'Nave Herramientas - Pasillo 4 (Discos Abrasivos & Seguridad)'
    },
    stockCurrent: 340,
    stockMinimum: 80,
    stockStatus: 'green',
    traceability: {
      lastBatchDate: '2026-10-05',
      lastBatchQuantity: 1000,
      nextEstimatedArrival: '2026-12-01',
      supplierName: 'Norton Tyrolit Abrasivos S.A.',
      supplierCode: 'TYR-EX-11510'
    },
    pricing: {
      unitPrice: 1.45,
      vatRate: 0.21,
      profitMargin: 0.35,
      costPrice: 0.95,
      pack100Price: 130.00,
      pack1000Price: 1180.00,
      unitWeightKg: 0.026
    },
    gallery: {
      primary: imgDiscoCorte,
      detailThreadOrHead: imgDiscoCorte,
      technicalDrawingSvg: `<svg viewBox="0 0 200 200" fill="none" stroke="#94a3b8" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="85" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>
        <circle cx="100" cy="100" r="50" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="100" cy="100" r="18" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
        <text x="75" y="105" fill="#f8fafc" font-size="10" font-family="monospace">22.23mm</text>
        <line x1="15" y1="100" x2="185" y2="100" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3"/>
        <text x="80" y="35" fill="#38bdf8" font-size="11" font-family="monospace">Ø 115 mm</text>
      </svg>`
    },
    equivalentSubstituteIds: ['prod-008'],
    notes: 'Corte frío ultrarrápido sin rebaba ni quemado de chapas de acero inoxidable y caños estructurales.'
  },
  {
    id: 'prod-008',
    sku: 'DIS-COR-INOX-115X16',
    barcode: '7798123456081',
    qrPayload: 'FERREFAST:DIS-COR-INOX-115X16:STOCK_LOC_P4-E3-C09',
    name: 'Disco de Corte Trabajo Pesado 115 x 1.6 x 22.2mm',
    searchKeywords: [
      'disco corte 1.6', 'disco amoladora grueso', 'corte pesado 115', 'disco 115 1.6'
    ],
    category: 'Abrasivos y Corte',
    subCategory: 'Discos Abrasivos de Corte',
    application: 'Metal',
    material: 'Óxido de circonio reforzado',
    coating: 'Resina fenólica prensada',
    specStandards: 'EN 12413',
    dimensions: {
      diameterMm: 115.0,
      lengthMm: 1.6,
      diameterInches: '4-1/2"',
      lengthInches: '1/16"',
      threadPitch: 'Buje 22.23 mm',
      driveType: 'Amoladora 115mm',
      displayString: '115 x 1.6 x 22.23 mm'
    },
    location: {
      aisle: 'P4',
      shelf: 'E3',
      levelBox: 'C09',
      bin: 'G16',
      code: 'P4-E3-C09',
      zoneDescription: 'Nave Herramientas - Pasillo 4'
    },
    stockCurrent: 24, // Stock crítico
    stockMinimum: 50,
    stockStatus: 'yellow',
    traceability: {
      lastBatchDate: '2026-08-30',
      lastBatchQuantity: 400,
      nextEstimatedArrival: '2026-11-02',
      supplierName: 'Norton Tyrolit Abrasivos S.A.',
      supplierCode: 'TYR-EX-11516'
    },
    pricing: {
      unitPrice: 1.55,
      vatRate: 0.21,
      profitMargin: 0.35,
      costPrice: 1.02,
      pack100Price: 140.00,
      unitWeightKg: 0.038
    },
    gallery: {
      primary: imgDiscoCorte,
      detailThreadOrHead: imgDiscoCorte
    },
    equivalentSubstituteIds: ['prod-007'],
    notes: 'Mayor durabilidad para corte de vigas UPN, IPN y hierro macizo.'
  },
  {
    id: 'prod-009',
    sku: 'TUE-AUT-DIN985-M12',
    barcode: '7798123456098',
    qrPayload: 'FERREFAST:TUE-AUT-DIN985-M12:STOCK_LOC_P2-E2-C11',
    name: 'Tuerca Autoblocante Autofrenante Inserto Nylon DIN 985 M12',
    searchKeywords: [
      'tuerca m12', 'tuerca autoblocante', 'autofrenante', 'tuerca nylon', 'tuerca seguridad',
      'tuerca 3/8', 'tuerca 1/2', 'antivibracion'
    ],
    category: 'Tornillería y Fijaciones',
    subCategory: 'Tuercas y Arandelas',
    application: 'Metal',
    material: 'Acero Grado 8 con anillo de poliamida autoblocante',
    coating: 'Zincado blanco pasivado',
    specStandards: 'DIN 985 / ISO 10511',
    dimensions: {
      diameterMm: 12.0,
      lengthMm: 12.0,
      diameterInches: 'M12 (aprox 1/2")',
      threadPitch: 'Paso 1.75 mm métrico',
      driveType: 'Hexagonal - Llave 19 mm',
      displayString: 'M12 Paso 1.75 mm'
    },
    location: {
      aisle: 'P2',
      shelf: 'E2',
      levelBox: 'C11',
      bin: 'G07',
      code: 'P2-E2-C11',
      zoneDescription: 'Nave Central - Pasillo 2 (Tuercas, Arandelas Grower & Planas)'
    },
    stockCurrent: 0, // AGOTADO (Rojo)
    stockMinimum: 100,
    stockStatus: 'red',
    traceability: {
      lastBatchDate: '2026-06-15',
      lastBatchQuantity: 1200,
      nextEstimatedArrival: '2026-10-26',
      pendingPurchaseOrder: 'OC-2026-879',
      supplierName: 'Bulonera Central Metalúrgica',
      supplierCode: 'BCM-TUE-98512'
    },
    pricing: {
      unitPrice: 0.35,
      vatRate: 0.21,
      profitMargin: 0.40,
      costPrice: 0.22,
      pack100Price: 30.00,
      pack1000Price: 270.00,
      unitWeightKg: 0.017
    },
    gallery: {
      primary: imgBulonHex,
      detailThreadOrHead: imgBulonHex
    },
    equivalentSubstituteIds: ['prod-003', 'prod-004'],
    notes: 'Agotado. Alternativa: Tuerca hexagonal común M12 Grado 8 con arandela Grover elástica DIN 127.'
  },
  {
    id: 'prod-010',
    sku: 'PUN-PH2-IMP-50MM',
    barcode: '7798123456104',
    qrPayload: 'FERREFAST:PUN-PH2-IMP-50MM:STOCK_LOC_P5-E1-C01',
    name: 'Punta para Atornillador Phillips PH2 Zona de Torsión Impacto 50mm',
    searchKeywords: [
      'punta phillips', 'punta atornillador', 'punta ph2', 'punta ph 2', 'punta impacto',
      'dewalt', 'bosch', 'makita', 'repuesto punta'
    ],
    category: 'Herramientas de Ajuste & Puntas',
    subCategory: 'Puntas y Puntas de Impacto',
    application: 'Universal',
    material: 'Acero modificado S2 forjado con zona de torsión elástica',
    coating: 'Fosfatizado negro anti-óxido con cabeza magnética de neodimio',
    specStandards: 'DIN 3126-E 6.3 / ISO 1173',
    dimensions: {
      diameterMm: 6.35,
      lengthMm: 50.0,
      diameterInches: 'Vástago Hexagonal 1/4"',
      lengthInches: '2"',
      driveType: 'Phillips #2 universal para tornillos T1 y T2',
      displayString: 'Hex 1/4" x 50 mm (PH2)'
    },
    location: {
      aisle: 'P5',
      shelf: 'E1',
      levelBox: 'C01',
      bin: 'G02',
      code: 'P5-E1-C01',
      zoneDescription: 'Nave Herramientas - Pasillo 5 (Puntas, Mechas & Accesorios Eléctricos)'
    },
    stockCurrent: 145,
    stockMinimum: 30,
    stockStatus: 'green',
    traceability: {
      lastBatchDate: '2026-09-28',
      lastBatchQuantity: 300,
      nextEstimatedArrival: '2026-11-30',
      supplierName: 'Herramientas y Accesorios Pro S.R.L.',
      supplierCode: 'HAP-PH2-50'
    },
    pricing: {
      unitPrice: 2.80,
      vatRate: 0.21,
      profitMargin: 0.40,
      costPrice: 1.80,
      pack100Price: 250.00,
      unitWeightKg: 0.012
    },
    gallery: {
      primary: imgTornilloAuto,
      detailThreadOrHead: imgTornilloAuto
    },
    equivalentSubstituteIds: ['prod-001'],
    notes: 'Resiste hasta 10 veces más ciclos de torque que puntas estándar sin descabezar el tornillo.'
  }
];

import { CategoryItem } from '../types/product';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-tornilleria',
    name: 'Tornillería y Fijaciones',
    icon: 'Layers',
    color: 'amber',
    subcategories: ['Tornillos Autoperforantes', 'Bulonería Pesada', 'Tuercas y Arandelas', 'Fijaciones para Mampostería', 'Varillas Roscadas']
  },
  {
    id: 'cat-abrasivos',
    name: 'Abrasivos y Corte',
    icon: 'Disc',
    color: 'sky',
    subcategories: ['Discos Abrasivos de Corte', 'Discos de Desbaste', 'Lijas y Esmeriles', 'Cepillos de Alambre']
  },
  {
    id: 'cat-herramientas',
    name: 'Herramientas de Ajuste & Puntas',
    icon: 'Wrench',
    color: 'emerald',
    subcategories: ['Puntas y Puntas de Impacto', 'Bocallaves y Tubos', 'Llaves Combinadas', 'Destornilladores']
  },
  {
    id: 'cat-clavacion',
    name: 'Clavación & Neumática',
    icon: 'Hammer',
    color: 'purple',
    subcategories: ['Clavos Espiralados', 'Grampas Industriales', 'Mangueras Espiraladas', 'Acoples Rápidos']
  },
  {
    id: 'cat-pinturas',
    name: 'Pinturas & Químicos',
    icon: 'Paintbrush',
    color: 'rose',
    subcategories: ['Selladores y Siliconas', 'Antióxidos Industriales', 'Espumas de Poliuretano', 'Trabas Químicas Anaeróbicas']
  }
];

export const CATEGORIES_LIST = [
  'Todas las Categorías',
  'Tornillería y Fijaciones',
  'Abrasivos y Corte',
  'Herramientas de Ajuste & Puntas',
  'Clavación & Neumática',
  'Pinturas & Químicos'
];

export const APPLICATION_FILTERS: Array<'Todas' | 'Metal' | 'Madera' | 'Mampostería' | 'Drywall'> = [
  'Todas',
  'Metal',
  'Mampostería',
  'Drywall',
  'Madera'
];

