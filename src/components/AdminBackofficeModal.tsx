/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Módulo de Administración (Backoffice Protegido) de Ferretería Industrial
 * Sub-dividido en 4 pestañas:
 * A) Gestión de Catálogo y Altas (Individual, Importación Masiva y Listado/Baja)
 * B) Gestión de Categorías Dinámicas
 * C) Módulo de Gestión de Precios e Inflación
 * D) Configuración de Seguridad y Parámetros del Comercio
 */

import React, { useState } from 'react';
import {
  X,
  PackagePlus,
  Layers,
  TrendingUp,
  Settings,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Save,
  Search,
  KeyRound,
  Store,
  DollarSign,
  ArrowRight,
  RefreshCw,
  LogOut
} from 'lucide-react';

import { Product, CategoryItem, StoreSettings, AdminAuth, UnitOfMeasure, StockStatus } from '../types/product';
import {
  addProductToCatalog,
  updateProductInCatalog,
  deleteProductFromCatalog,
  addCategory,
  updateCategory,
  deleteCategory,
  saveSettings,
  loadSettings,
  loadAdminAuth,
  saveAdminAuth,
  applyMassivePriceIncrease,
  importFullCatalogCsv,
  loadInflationLogs,
  resetCatalogToFactory
} from '../services/storageService';

interface AdminBackofficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  catalog: Product[];
  categories: CategoryItem[];
  onCatalogChange: (newCatalog: Product[]) => void;
  onCategoriesChange: (newCategories: CategoryItem[]) => void;
  onSettingsChange: (newSettings: StoreSettings) => void;
}

export const AdminBackofficeModal: React.FC<AdminBackofficeModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  catalog,
  categories,
  onCatalogChange,
  onCategoriesChange,
  onSettingsChange
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'categories' | 'inflation' | 'settings'>('catalog');
  const [catalogSubTab, setCatalogSubTab] = useState<'create' | 'import' | 'list'>('create');
  
  // Feedback banners
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ----------------- TAB A: PRODUCT CREATE FORM STATE -----------------
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Tornillería y Fijaciones');
  const [formSubCategory, setFormSubCategory] = useState('Tornillos Generales');
  const [formUnit, setFormUnit] = useState<UnitOfMeasure>('Unidad');
  const [formApplication, setFormApplication] = useState<'Metal' | 'Madera' | 'Mampostería' | 'Drywall' | 'Universal'>('Metal');
  const [formMaterial, setFormMaterial] = useState('Acero Carbono');
  const [formCoating, setFormCoating] = useState('Zincado Azul');
  const [formDimensions, setFormDimensions] = useState('');
  const [formDiameterMm, setFormDiameterMm] = useState<number>(0);
  const [formLengthMm, setFormLengthMm] = useState<number>(0);
  
  // P-E-C Location
  const [formAisle, setFormAisle] = useState('P1');
  const [formShelf, setFormShelf] = useState('E1');
  const [formBox, setFormBox] = useState('C01');
  
  // Stock
  const [formStock, setFormStock] = useState<number>(100);
  const [formMinStock, setFormMinStock] = useState<number>(25);

  // Traceability & Supplier
  const [formSupplier, setFormSupplier] = useState('Distribuidor Central');
  const [formSupplierCode, setFormSupplierCode] = useState('');

  // Pricing
  const [formCostPrice, setFormCostPrice] = useState<number>(10.0);
  const [formMargin, setFormMargin] = useState<number>(35); // 35%
  const [formVatRate, setFormVatRate] = useState<number>(21); // 21%

  // Calculated unit price
  const calculatedUnitPrice = Math.round((formCostPrice * (1 + formMargin / 100)) * 100) / 100;
  const calculatedFinalPriceWithVat = Math.round((calculatedUnitPrice * (1 + formVatRate / 100)) * 100) / 100;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim()) {
      showNotice('error', 'El Nombre Comercial y el SKU son campos obligatorios.');
      return;
    }

    const locationCode = `${formAisle}-${formShelf}-${formBox}`;
    const stockStatus: StockStatus = formStock > 50 ? 'green' : formStock > 0 ? 'yellow' : 'red';

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      sku: formSku.trim().toUpperCase(),
      barcode: formBarcode.trim() || '779' + Math.floor(1000000000 + Math.random() * 9000000000),
      qrPayload: `FERREFAST:${formSku.trim()}:LOC_${locationCode}`,
      name: formName.trim(),
      searchKeywords: formKeywords
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(Boolean),
      category: formCategory,
      subCategory: formSubCategory,
      application: formApplication,
      material: formMaterial,
      coating: formCoating,
      dimensions: {
        diameterMm: Number(formDiameterMm) || 0,
        lengthMm: Number(formLengthMm) || 0,
        displayString: formDimensions || `${formDiameterMm} x ${formLengthMm} mm`
      },
      location: {
        aisle: formAisle,
        shelf: formShelf,
        levelBox: formBox,
        bin: 'G01',
        code: locationCode,
        zoneDescription: `Pasillo ${formAisle} - Estante ${formShelf}`
      },
      stockCurrent: Number(formStock),
      stockMinimum: Number(formMinStock),
      stockStatus,
      traceability: {
        lastBatchDate: new Date().toISOString().split('T')[0],
        lastBatchQuantity: Number(formStock),
        nextEstimatedArrival: null,
        supplierName: formSupplier,
        supplierCode: formSupplierCode || formSku
      },
      pricing: {
        costPrice: Number(formCostPrice),
        profitMargin: Number(formMargin) / 100,
        unitPrice: calculatedUnitPrice,
        vatRate: Number(formVatRate) / 100,
        pack100Price: Math.round(calculatedUnitPrice * 90),
        pack1000Price: Math.round(calculatedUnitPrice * 800)
      },
      gallery: {
        primary: '/icon.svg',
        detailThreadOrHead: '/icon.svg'
      }
    };

    const updated = addProductToCatalog(newProduct);
    onCatalogChange(updated);
    showNotice('success', `Producto '${newProduct.name}' agregado al catálogo exitosamente.`);

    // Reset inputs
    setFormName('');
    setFormSku('');
    setFormBarcode('');
    setFormKeywords('');
    setFormDimensions('');
  };

  // ----------------- TAB A: BULK CSV IMPORT STATE -----------------
  const [bulkCsvText, setBulkCsvText] = useState<string>(
`SKU;NOMBRE;CATEGORIA;SUBCATEGORIA;MEDIDAS;UBICACION;STOCK;PRECIO_COSTO;MARGEN;PRECIO_VENTA
CLV-ESP-212;Clavo Espiralado Cabeza Chata;Clavación & Neumática;Clavos Espiralados;2 1/2" (65mm);P1-E2-C05;1500;0.05;0.40;0.07
SEL-SIL-TRAN-300;Sellador Silicona Transparente 300ml;Pinturas & Químicos;Selladores y Siliconas;300 ml;P5-E3-C10;85;3.20;0.35;4.32
MEC-HSS-COB-06;Mecha Taladro Acero Rápido Cobalto 6mm;Herramientas de Ajuste & Puntas;Mechas;Ø 6.0 mm;P5-E1-C08;120;2.10;0.40;2.94`
  );

  const handleRunBulkImport = () => {
    if (!bulkCsvText.trim()) return;
    const { updatedCatalog, createdCount, updatedCount, errors } = importFullCatalogCsv(
      catalog,
      bulkCsvText,
      'Administrador Backoffice'
    );
    onCatalogChange(updatedCatalog);
    if (errors.length > 0) {
      showNotice('error', `Importados: ${createdCount} nuevos, ${updatedCount} actualizados. Hubo errores: ${errors.join(', ')}`);
    } else {
      showNotice('success', `Importación exitosa: ${createdCount} productos creados y ${updatedCount} actualizados.`);
    }
  };

  // ----------------- TAB A: CATALOG LIST SEARCH & DELETE -----------------
  const [listSearch, setListSearch] = useState('');
  const [listCategoryFilter, setListCategoryFilter] = useState('Todas');

  const filteredCatalogForAdmin = catalog.filter(p => {
    const matchCat = listCategoryFilter === 'Todas' || p.category === listCategoryFilter;
    const matchQuery =
      p.name.toLowerCase().includes(listSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(listSearch.toLowerCase()) ||
      p.location.code.toLowerCase().includes(listSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleDeleteProduct = (productId: string, name: string) => {
    if (confirm(`¿Confirma eliminar el artículo "${name}" del catálogo?`)) {
      const updated = deleteProductFromCatalog(productId);
      onCatalogChange(updated);
      showNotice('success', `Artículo eliminado del maestro.`);
    }
  };

  // ----------------- TAB B: CATEGORIES MANAGEMENT STATE -----------------
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('amber');
  const [newCatSubcats, setNewCatSubcats] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const subcats = newCatSubcats
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newCategory: CategoryItem = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      icon: 'Layers',
      color: newCatColor,
      subcategories: subcats.length > 0 ? subcats : ['General']
    };

    const updated = addCategory(newCategory);
    onCategoriesChange(updated);
    setNewCatName('');
    setNewCatSubcats('');
    showNotice('success', `Categoría '${newCategory.name}' agregada. Reflejada de inmediato en mostrador.`);
  };

  const handleDeleteCategory = (catId: string, name: string) => {
    if (confirm(`¿Eliminar la categoría '${name}'? Los productos existentes mantendrán su asignación.`)) {
      const updated = deleteCategory(catId);
      onCategoriesChange(updated);
      showNotice('success', `Categoría '${name}' eliminada.`);
    }
  };

  // ----------------- TAB C: INFLATION & PRICES STATE -----------------
  const [infPercentage, setInfPercentage] = useState('15');
  const [infScope, setInfScope] = useState<'global' | 'category' | 'supplier'>('category');
  const [infSelectedCategory, setInfSelectedCategory] = useState(categories[0]?.name || 'Tornillería y Fijaciones');
  const [infSelectedSupplier, setInfSelectedSupplier] = useState('Distribuidor Central');

  const suppliers = Array.from(new Set(catalog.map(p => p.traceability.supplierName)));
  const inflationLogs = loadInflationLogs();

  const handleApplyInflation = () => {
    const pct = parseFloat(infPercentage);
    if (isNaN(pct) || pct === 0) {
      showNotice('error', 'Ingrese un porcentaje válido.');
      return;
    }

    const targetVal = infScope === 'category' ? infSelectedCategory : infScope === 'supplier' ? infSelectedSupplier : undefined;
    const { updatedCatalog, affectedCount } = applyMassivePriceIncrease(
      catalog,
      pct,
      infScope,
      targetVal,
      'Administrador Central'
    );

    onCatalogChange(updatedCatalog);
    showNotice('success', `Aumento del +${pct}% aplicado a ${affectedCount} productos. Ya impacta en el mostrador.`);
  };

  // ----------------- TAB D: SETTINGS & SECURITY STATE -----------------
  const initialSettings = loadSettings();
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(initialSettings);
  
  const currentAuth = loadAdminAuth();
  const [adminUser, setAdminUser] = useState(currentAuth.username);
  const [adminCurrentPass, setAdminCurrentPass] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settingsForm);
    onSettingsChange(settingsForm);
    showNotice('success', 'Parámetros del comercio guardados correctamente.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCurrentPass) {
      showNotice('error', 'Debe ingresar la contraseña actual.');
      return;
    }
    if (adminCurrentPass !== currentAuth.password) {
      showNotice('error', 'La contraseña actual no es correcta.');
      return;
    }
    if (!adminNewPass || adminNewPass.length < 4) {
      showNotice('error', 'La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (adminNewPass !== adminConfirmPass) {
      showNotice('error', 'La confirmación no coincide con la nueva contraseña.');
      return;
    }

    const newAuth: AdminAuth = {
      username: adminUser.trim() || 'Admin',
      password: adminNewPass.trim()
    };
    saveAdminAuth(newAuth);
    setAdminCurrentPass('');
    setAdminNewPass('');
    setAdminConfirmPass('');
    showNotice('success', 'Credenciales de Administrador actualizadas con éxito.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs">
      <div className="relative w-full max-w-6xl h-[94vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header of Backoffice */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Panel de Control & Backoffice</h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                  SESIÓN ADMINISTRADOR ACTIVA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Altas de catálogo, árbol de familias, aumentos masivos y configuración
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 text-xs font-medium transition-colors cursor-pointer border border-slate-700"
              title="Cerrar sesión de administrador y regresar al mostrador de venta"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div
            className={`px-6 py-2.5 flex items-center gap-2 text-xs font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-950 border-b border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950 border-b border-rose-500/40 text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* 4 Main Tabs Nav */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            <span>A) Catálogo & Altas ({catalog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>B) Familias & Categorías ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inflation')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inflation'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>C) Precios & Inflación</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>D) Configuración & Seguridad</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ======================================================== */}
          {/* TAB A: GESTIÓN DE CATÁLOGO Y ALTAS                       */}
          {/* ======================================================== */}
          {activeTab === 'catalog' && (
            <div className="space-y-5">
              {/* Sub-tabs for Catalog */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
                <button
                  onClick={() => setCatalogSubTab('create')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    catalogSubTab === 'create'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  + Alta Individual
                </button>
                <button
                  onClick={() => setCatalogSubTab('import')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    catalogSubTab === 'import'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Importación Masiva (CSV / Excel)</span>
                </button>
                <button
                  onClick={() => setCatalogSubTab('list')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    catalogSubTab === 'list'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Maestro de Artículos ({catalog.length})
                </button>
              </div>

              {/* SUB-TAB: ALTA INDIVIDUAL */}
              {catalogSubTab === 'create' && (
                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                      1. Identificación Principal
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 mb-1">Nombre Comercial del Producto *</label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Ej: Tornillo Hexagonal Grado 8.8 Galvanizado"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">SKU / Código Interno *</label>
                        <input
                          type="text"
                          required
                          value={formSku}
                          onChange={(e) => setFormSku(e.target.value)}
                          placeholder="Ej: BUL-HEX-88-M12"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Código de Barras EAN-13 (Opcional)</label>
                        <input
                          type="text"
                          value={formBarcode}
                          onChange={(e) => setFormBarcode(e.target.value)}
                          placeholder="7798123456012"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 mb-1">Sinónimos y Términos de Búsqueda (separados por coma)</label>
                        <input
                          type="text"
                          value={formKeywords}
                          onChange={(e) => setFormKeywords(e.target.value)}
                          placeholder="Ej: bulon, m12, hexagonal, tuerca de 1/2, alta resistencia"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Categorización & Unidad de Medida */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                      2. Clasificación & Fraccionamiento
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Categoría / Familia *</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Subcategoría</label>
                        <input
                          type="text"
                          value={formSubCategory}
                          onChange={(e) => setFormSubCategory(e.target.value)}
                          placeholder="Ej: Bulonería Pesada"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Unidad de Medida Principal</label>
                        <select
                          value={formUnit}
                          onChange={(e) => setFormUnit(e.target.value as UnitOfMeasure)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        >
                          <option value="Unidad">Unidad</option>
                          <option value="Kilo">Kilo (a granel)</option>
                          <option value="Caja">Caja cerrada</option>
                          <option value="Metro">Metro</option>
                          <option value="Litro">Litro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Aplicación Recomendada</label>
                        <select
                          value={formApplication}
                          onChange={(e) => setFormApplication(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        >
                          <option value="Metal">Metal</option>
                          <option value="Madera">Madera</option>
                          <option value="Mampostería">Mampostería</option>
                          <option value="Drywall">Drywall</option>
                          <option value="Universal">Universal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3. Medidas & Ubicación Física (P-E-C) */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                      3. Medidas Técnicas y Ubicación Física (P-E-C)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 mb-1">Medida Visible (Display)</label>
                        <input
                          type="text"
                          value={formDimensions}
                          onChange={(e) => setFormDimensions(e.target.value)}
                          placeholder="Ej: M12 x 50 mm (1/2 x 2 pulg)"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Material</label>
                        <input
                          type="text"
                          value={formMaterial}
                          onChange={(e) => setFormMaterial(e.target.value)}
                          placeholder="Acero 8.8"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-amber-300 font-bold mb-1">Pasillo (P)</label>
                        <input
                          type="text"
                          value={formAisle}
                          onChange={(e) => setFormAisle(e.target.value.toUpperCase())}
                          placeholder="P1"
                          className="w-full bg-slate-900 border border-amber-500/60 rounded-lg p-2 text-amber-300 font-mono font-bold uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-amber-300 font-bold mb-1">Estante (E)</label>
                        <input
                          type="text"
                          value={formShelf}
                          onChange={(e) => setFormShelf(e.target.value.toUpperCase())}
                          placeholder="E2"
                          className="w-full bg-slate-900 border border-amber-500/60 rounded-lg p-2 text-amber-300 font-mono font-bold uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-amber-300 font-bold mb-1">Caja/Nivel (C)</label>
                        <input
                          type="text"
                          value={formBox}
                          onChange={(e) => setFormBox(e.target.value.toUpperCase())}
                          placeholder="C05"
                          className="w-full bg-slate-900 border border-amber-500/60 rounded-lg p-2 text-amber-300 font-mono font-bold uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Stock y Precios con cálculo automático */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                      4. Control de Inventario y Precios Automáticos
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Stock Inicial</label>
                        <input
                          type="number"
                          value={formStock}
                          onChange={(e) => setFormStock(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Stock Mínimo Alerta</label>
                        <input
                          type="number"
                          value={formMinStock}
                          onChange={(e) => setFormMinStock(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Precio Costo ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formCostPrice}
                          onChange={(e) => setFormCostPrice(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Margen Ganancia (%)</label>
                        <input
                          type="number"
                          step="1"
                          value={formMargin}
                          onChange={(e) => setFormMargin(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                        />
                      </div>

                      <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-2 text-right">
                        <span className="text-[10px] text-slate-400 block">Venta Final c/IVA:</span>
                        <div className="text-base font-bold text-amber-400 font-mono">
                          ${calculatedFinalPriceWithVat.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Dar de Alta en Catálogo</span>
                    </button>
                  </div>
                </form>
              )}

              {/* SUB-TAB: IMPORTACIÓN MASIVA */}
              {catalogSubTab === 'import' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 leading-relaxed">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      <span>Importador Masivo para Miles de Productos</span>
                    </h4>
                    <p className="text-slate-300">
                      Pegue a continuación las filas de su archivo Excel o CSV (separado por comas, punto y coma o tabulaciones).
                      El sistema detectará si el SKU ya existe para actualizar stock y precios, o creará un nuevo artículo automáticamente.
                    </p>
                    <div className="font-mono text-[11px] text-amber-300/90 bg-slate-900 p-2 rounded border border-slate-800">
                      Encabezados requeridos: SKU; NOMBRE; CATEGORIA; SUBCATEGORIA; MEDIDAS; UBICACION; STOCK; PRECIO_COSTO; MARGEN; PRECIO_VENTA
                    </div>
                  </div>

                  <textarea
                    value={bulkCsvText}
                    onChange={(e) => setBulkCsvText(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-white focus:border-amber-500 focus:outline-hidden"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleRunBulkImport}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Ejecutar Importación Masiva</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-TAB: LISTADO Y EDICIÓN/BAJA */}
              {catalogSubTab === 'list' && (
                <div className="space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row gap-2 justify-between">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={listSearch}
                        onChange={(e) => setListSearch(e.target.value)}
                        placeholder="Filtrar por SKU, nombre o ubicación (P-E-C)..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono"
                      />
                    </div>
                    <select
                      value={listCategoryFilter}
                      onChange={(e) => setListCategoryFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium"
                    >
                      <option value="Todas">Todas las Categorías</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-left font-mono">
                        <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider sticky top-0">
                          <tr>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Categoría</th>
                            <th className="p-3">Ubicación</th>
                            <th className="p-3 text-right">Stock</th>
                            <th className="p-3 text-right">P. Unitario</th>
                            <th className="p-3 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredCatalogForAdmin.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                              <td className="p-3 font-bold text-amber-300">{item.sku}</td>
                              <td className="p-3 font-sans font-medium text-white max-w-xs truncate">
                                {item.name}
                              </td>
                              <td className="p-3 text-slate-400">{item.category}</td>
                              <td className="p-3">
                                <span className="bg-slate-900 border border-slate-800 text-amber-400 px-1.5 py-0.5 rounded text-[11px] font-bold">
                                  {item.location.code}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <span className={item.stockCurrent > 50 ? 'text-emerald-400' : item.stockCurrent > 0 ? 'text-amber-400' : 'text-rose-400'}>
                                  {item.stockCurrent} u.
                                </span>
                              </td>
                              <td className="p-3 text-right font-bold text-white">
                                ${item.pricing.unitPrice.toFixed(2)}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleDeleteProduct(item.id, item.name)}
                                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                                  title="Eliminar artículo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB B: GESTIÓN DE FAMILIAS & CATEGORÍAS                 */}
          {/* ======================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-5 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Árbol de Familias y Categorías de Venta</h4>
                  <p className="text-slate-400 text-xs">
                    Toda categoría agregada o modificada se actualiza en tiempo real en la pantalla de los vendedores.
                  </p>
                </div>
              </div>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h5 className="font-bold text-amber-400 uppercase text-[11px] tracking-wider">
                  + Crear Nueva Familia de Productos
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Nombre de la Categoría *</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Ej: Clavación & Neumática"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Color Distintivo</label>
                    <select
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option value="amber">Ámbar (Industrial)</option>
                      <option value="sky">Azul Celeste (Corte & Metal)</option>
                      <option value="emerald">Verde Esmeralda (Herramientas)</option>
                      <option value="purple">Púrpura (Neumática)</option>
                      <option value="rose">Rosa / Rojizo (Químicos & Selladores)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Subcategorías (separadas por coma)</label>
                    <input
                      type="text"
                      value={newCatSubcats}
                      onChange={(e) => setNewCatSubcats(e.target.value)}
                      placeholder="Clavos, Grampas, Mangueras"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Guardar Familia
                  </button>
                </div>
              </form>

              {/* Categories grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                          <span>{cat.name}</span>
                        </span>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                          title="Eliminar familia"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cat.subcategories.map((s, idx) => (
                              <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span>Sin subcategorías específicas</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Artículos asociados:</span>
                      <span className="font-bold text-slate-300">
                        {catalog.filter(p => p.category === cat.name).length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB C: GESTIÓN DE PRECIOS E INFLACIÓN                    */}
          {/* ======================================================== */}
          {activeTab === 'inflation' && (
            <div className="space-y-5 text-xs max-w-2xl">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Aumento Masivo Porcentual Inmediato</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Aplica un porcentaje sobre el precio unitario base y recalcula todas las cajas y fraccionamientos sin demoras.
                </p>

                {/* Scope Selection */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1 uppercase text-[10px] tracking-wider">
                    Alcance del Aumento:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setInfScope('category')}
                      className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                        infScope === 'category'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Por Categoría
                    </button>
                    <button
                      type="button"
                      onClick={() => setInfScope('supplier')}
                      className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                        infScope === 'supplier'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Por Proveedor
                    </button>
                    <button
                      type="button"
                      onClick={() => setInfScope('global')}
                      className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                        infScope === 'global'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Catálogo Completo
                    </button>
                  </div>
                </div>

                {infScope === 'category' && (
                  <div>
                    <label className="block text-slate-400 mb-1">Categoría a Aumentar:</label>
                    <select
                      value={infSelectedCategory}
                      onChange={(e) => setInfSelectedCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {infScope === 'supplier' && (
                  <div>
                    <label className="block text-slate-400 mb-1">Proveedor a Aumentar:</label>
                    <select
                      value={infSelectedSupplier}
                      onChange={(e) => setInfSelectedSupplier(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium"
                    >
                      {suppliers.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 mb-1">Porcentaje de Ajuste (%):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      value={infPercentage}
                      onChange={(e) => setInfPercentage(e.target.value)}
                      className="w-32 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-base font-bold text-center"
                    />
                    <div className="flex gap-1">
                      {['+5%', '+10%', '+15%', '+20%'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setInfPercentage(p.replace(/[+%]/g, ''))}
                          className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-xs cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyInflation}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Aplicar Aumento Inmediato (+{infPercentage}%)</span>
                </button>
              </div>

              {/* History logs */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Histórico de Ajustes de Precios:
                </h5>
                {inflationLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between font-mono">
                    <div>
                      <div className="font-bold text-white font-sans">{log.targetName} (+{log.percentage}%)</div>
                      <div className="text-[10px] text-slate-500">{log.timestamp} · {log.user}</div>
                    </div>
                    <span className="text-amber-400 font-bold text-[11px]">{log.itemsAffected} artículos</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB D: CONFIGURACIÓN Y SEGURIDAD                        */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Form 1: Store parameters */}
              <form onSubmit={handleSaveStoreSettings} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Parámetros del Comercio (Impresión Voucher)</span>
                </h4>

                <div>
                  <label className="block text-slate-400 mb-1">Nombre Comercial / Razón Social:</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Identificador Fiscal (CUIT / RUT):</label>
                  <input
                    type="text"
                    value={settingsForm.taxId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, taxId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Dirección de Mostrador:</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Teléfono / WhatsApp de Despacho:</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tasa de IVA Predeterminada (%):</label>
                  <input
                    type="number"
                    value={Math.round(settingsForm.defaultVatRate * 100)}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultVatRate: Number(e.target.value) / 100 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Guardar Datos del Local
                  </button>
                </div>
              </form>

              {/* Form 2: Password change */}
              <form onSubmit={handleUpdatePassword} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Seguridad de Acceso del Administrador</span>
                </h4>
                <p className="text-slate-400 text-xs">
                  Cambie el usuario o contraseña que bloquea el backoffice frente al personal de mostrador.
                </p>

                <div>
                  <label className="block text-slate-400 mb-1">Usuario de Administrador:</label>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Contraseña Actual:</label>
                  <input
                    type="password"
                    value={adminCurrentPass}
                    onChange={(e) => setAdminCurrentPass(e.target.value)}
                    placeholder="Clave actual (default: admin123)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Nueva Contraseña:</label>
                  <input
                    type="password"
                    value={adminNewPass}
                    onChange={(e) => setAdminNewPass(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Confirmar Nueva Contraseña:</label>
                  <input
                    type="password"
                    value={adminConfirmPass}
                    onChange={(e) => setAdminConfirmPass(e.target.value)}
                    placeholder="Repita la nueva clave"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="font-mono text-[11px]">
            Base local de artículos: <strong className="text-white">{catalog.length}</strong> productos sincronizados.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Volver a la Vista de Mostrador
          </button>
        </div>
      </div>
    </div>
  );
};
