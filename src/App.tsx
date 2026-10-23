/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FerreFast POS - PWA de Venta Asistida, Inventario y Gestión Integral
 * Arquitectura de Dos Módulos con Control de Acceso por Roles:
 * 1. Módulo Mostrador (Rol Vendedor - Búsqueda <3s, Semáforo, P-E-C, Comanda y QR)
 * 2. Módulo Backoffice (Rol Administrador - Altas, Importación Masiva, Categorías, Inflación y Configuración)
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategorySidebar } from './components/CategorySidebar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { VoucherModal } from './components/VoucherModal';
import { SubstituteModal } from './components/SubstituteModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { ShortcutsHelpModal } from './components/ShortcutsHelpModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminBackofficeModal } from './components/AdminBackofficeModal';

import { Product, CartItem, OrderVoucher, UserRole, CategoryItem, StoreSettings } from './types/product';
import { loadCatalog, saveCatalog, loadCategories, loadSettings, saveSettings } from './services/storageService';
import { searchCatalog } from './services/searchEngine';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { WifiOff, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  // State: Catalog, Categories & Settings
  const [catalog, setCatalog] = useState<Product[]>(loadCatalog);
  const [categories, setCategories] = useState<CategoryItem[]>(loadCategories);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(loadSettings);

  // Security: Default is strictly Seller
  const [userRole, setUserRole] = useState<UserRole>('seller');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isBackofficeOpen, setIsBackofficeOpen] = useState(false);
  
  // Search and Facets
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las Categorías');
  const [selectedApplication, setSelectedApplication] = useState('Todas');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [substituteTarget, setSubstituteTarget] = useState<Product | null>(null);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState<OrderVoucher | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // PWA & Connectivity
  const isOnline = useOnlineStatus();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Multi-tab synchronization
  useEffect(() => {
    const handleCatalogUpdate = (e: any) => {
      if (e.detail?.catalog) setCatalog(e.detail.catalog);
    };
    const handleCategoriesUpdate = (e: any) => {
      if (e.detail?.categories) setCategories(e.detail.categories);
    };
    const handleSettingsUpdate = (e: any) => {
      if (e.detail?.settings) setStoreSettings(e.detail.settings);
    };

    window.addEventListener('ferrefast_catalog_updated', handleCatalogUpdate);
    window.addEventListener('ferrefast_categories_updated', handleCategoriesUpdate);
    window.addEventListener('ferrefast_settings_updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('ferrefast_catalog_updated', handleCatalogUpdate);
      window.removeEventListener('ferrefast_categories_updated', handleCategoriesUpdate);
      window.removeEventListener('ferrefast_settings_updated', handleSettingsUpdate);
    };
  }, []);

  // Compute Search Results & Latency (<3 ms)
  const searchResult = useMemo(() => {
    return searchCatalog(
      catalog,
      query,
      selectedCategory,
      selectedApplication,
      stockFilter
    );
  }, [catalog, query, selectedCategory, selectedApplication, stockFilter]);

  // Compute Stock Counts for Traffic Light Sidebar
  const stockCounts = useMemo(() => {
    let green = 0;
    let yellow = 0;
    let red = 0;
    catalog.forEach(p => {
      if (p.stockStatus === 'green') green++;
      else if (p.stockStatus === 'yellow') yellow++;
      else if (p.stockStatus === 'red') red++;
    });
    return { total: catalog.length, green, yellow, red };
  }, [catalog]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    quantity: number,
    fractionType: 'unit' | 'pack100' | 'pack1000' | 'kilo'
  ) => {
    let price = product.pricing.unitPrice;
    if (fractionType === 'pack100') price = product.pricing.pack100Price || product.pricing.unitPrice * 100;
    else if (fractionType === 'pack1000') price = product.pricing.pack1000Price || product.pricing.unitPrice * 1000;
    else if (fractionType === 'kilo') price = product.pricing.perKiloPrice || product.pricing.unitPrice * 250;

    setCart(prev => {
      const existingIdx = prev.findIndex(
        i => i.product.id === product.id && i.fractionType === fractionType
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, fractionType, appliedPrice: price }];
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    setCart(prev => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Emit Voucher (F9)
  const handleEmitVoucher = () => {
    if (cart.length === 0) {
      setIsCartOpen(true);
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.appliedPrice * item.quantity, 0);
    const vatRate = storeSettings.defaultVatRate || 0.21;
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;
    const orderNumber = `CMD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const voucher: OrderVoucher = {
      id: 'ord-' + Date.now(),
      code: orderNumber,
      timestamp: new Date().toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'medium'
      }),
      sellerId: userRole === 'admin' ? 'ADMIN-01' : 'VEND-04',
      sellerName: userRole === 'admin' ? 'Administrador Central' : 'Martín V. (Mostrador 2)',
      items: [...cart],
      subtotal,
      vatAmount,
      total,
      paymentQrData: `FERREFAST:PAY:${orderNumber}:TOTAL:${total.toFixed(2)}:ITEMS:${cart.length}`
    };

    setCurrentVoucher(voucher);
    setIsCartOpen(false);
    setCart([]);
  };

  // Admin authentication handlers
  const handleLoginSuccess = () => {
    setUserRole('admin');
    setIsBackofficeOpen(true);
  };

  const handleLogoutAdmin = () => {
    setUserRole('seller');
    setIsBackofficeOpen(false);
  };

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onFocusSearch: () => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    },
    onEmitVoucher: () => {
      handleEmitVoucher();
    },
    onToggleInflation: () => {
      if (userRole === 'admin') {
        setIsBackofficeOpen(prev => !prev);
      } else {
        setIsAdminLoginOpen(true);
      }
    },
    onToggleBarcodeScan: () => {
      setIsBarcodeOpen(prev => !prev);
    },
    onClearOrEscape: () => {
      if (isAdminLoginOpen) setIsAdminLoginOpen(false);
      else if (isBackofficeOpen) setIsBackofficeOpen(false);
      else if (activeProductDetail) setActiveProductDetail(null);
      else if (substituteTarget) setSubstituteTarget(null);
      else if (isBarcodeOpen) setIsBarcodeOpen(false);
      else if (isShortcutsOpen) setIsShortcutsOpen(false);
      else if (currentVoucher) setCurrentVoucher(null);
      else if (isCartOpen) setIsCartOpen(false);
      else setQuery('');
    }
  });

  // Admin In-place Price Update
  const handleUpdateProductPrice = (productId: string, newUnitPrice: number, newMargin: number) => {
    if (userRole !== 'admin') return;

    const updated = catalog.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          pricing: {
            ...p.pricing,
            unitPrice: newUnitPrice,
            profitMargin: newMargin,
            pack100Price: p.pricing.pack100Price ? Math.round(newUnitPrice * 90) : undefined,
            pack1000Price: p.pricing.pack1000Price ? Math.round(newUnitPrice * 800) : undefined
          }
        };
      }
      return p;
    });
    setCatalog(updated);
    saveCatalog(updated);
    if (activeProductDetail && activeProductDetail.id === productId) {
      setActiveProductDetail(updated.find(p => p.id === productId) || null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        currentRole={userRole}
        onOpenLogin={() => setIsAdminLoginOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBackoffice={() => setIsBackofficeOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isOnline={isOnline}
      />

      {/* Omnichannel Search Bar */}
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        latencyMs={searchResult.latencyMs}
        totalMatches={searchResult.totalMatches}
        onOpenBarcodeScanner={() => setIsBarcodeOpen(true)}
        inputRef={searchInputRef}
      />

      {/* Main Workbench Layout: Left Sidebar + Central Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Category & Stock Traffic Light Tree */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedApplication={selectedApplication}
          onSelectApplication={setSelectedApplication}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          stockCounts={stockCounts}
        />

        {/* Central Product Grid */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-slate-950/60">
          {/* Active Filter Indicators Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-semibold text-slate-300">Vista Mostrador:</span>
              <span className="text-amber-400 font-medium">{selectedCategory}</span>
              {selectedApplication !== 'Todas' && (
                <>
                  <span>/</span>
                  <span className="text-sky-400">{selectedApplication}</span>
                </>
              )}
              {stockFilter !== 'all' && (
                <>
                  <span>/</span>
                  <span className="font-mono text-xs uppercase text-slate-300">
                    Filtro: {stockFilter}
                  </span>
                </>
              )}
            </div>

            {query && (
              <div className="text-slate-400 font-mono text-xs">
                Filtrado por: "<span className="text-white font-bold">{query}</span>"
              </div>
            )}
          </div>

          {/* Product Cards Grid */}
          {searchResult.products.length === 0 ? (
            <div className="py-16 text-center text-slate-500 max-w-md mx-auto space-y-3">
              <AlertTriangle className="w-12 h-12 text-slate-700 mx-auto" />
              <h4 className="text-base font-bold text-slate-300">No se encontraron artículos</h4>
              <p className="text-xs leading-relaxed">
                No hay coincidencias para "<span className="text-amber-400">{query}</span>" con los filtros actuales.
                Pruebe buscando por medida (ej: 10x2, M12), sinónimos o escanee el código de barras con F8.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('Todas las Categorías');
                  setSelectedApplication('Todas');
                  setStockFilter('all');
                }}
                className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {searchResult.products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenDetail={setActiveProductDetail}
                  onOpenSubstitutes={setSubstituteTarget}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onEmitVoucher={handleEmitVoucher}
      />

      {/* Product Detail Modal */}
      {activeProductDetail && (
        <ProductDetailModal
          product={activeProductDetail}
          onClose={() => setActiveProductDetail(null)}
          onAddToCart={handleAddToCart}
          onOpenSubstitutes={(prod) => {
            setActiveProductDetail(null);
            setSubstituteTarget(prod);
          }}
          userRole={userRole}
          onUpdateProductPrice={handleUpdateProductPrice}
        />
      )}

      {/* Automatic Substitutes Modal */}
      {substituteTarget && (
        <SubstituteModal
          targetProduct={substituteTarget}
          catalog={catalog}
          onClose={() => setSubstituteTarget(null)}
          onSelectSubstitute={(sub) => {
            handleAddToCart(sub, 1, 'unit');
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Admin Login Modal (Default: Admin / admin123) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Full Admin Backoffice Modal (Protected) */}
      {userRole === 'admin' && (
        <AdminBackofficeModal
          isOpen={isBackofficeOpen}
          onClose={() => setIsBackofficeOpen(false)}
          onLogout={handleLogoutAdmin}
          catalog={catalog}
          categories={categories}
          onCatalogChange={setCatalog}
          onCategoriesChange={setCategories}
          onSettingsChange={setStoreSettings}
        />
      )}

      {/* Barcode Scanner Modal (F8) */}
      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        catalog={catalog}
        onProductScanned={(scannedProduct) => {
          handleAddToCart(scannedProduct, 1, 'unit');
          setIsCartOpen(true);
        }}
      />

      {/* Keyboard Shortcuts Sheet (F2, F9, F8, F4, Esc) */}
      <ShortcutsHelpModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Cashier Voucher & Payment QR Modal */}
      <VoucherModal
        voucher={currentVoucher}
        onClose={() => setCurrentVoucher(null)}
        storeSettings={storeSettings}
      />

      {/* Non-intrusive Offline banner if disconnected */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xl border border-amber-400">
          <WifiOff className="w-4 h-4" />
          <span>Modo Offline Activado — Catálogo completo y ventas en mostrador funcionando desde caché local.</span>
        </div>
      )}
    </div>
  );
}
