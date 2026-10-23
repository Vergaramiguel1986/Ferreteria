/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, MapPin, Plus, Package, Layers, Shield, Calendar, Truck, Barcode, QrCode, Edit3, Check, ArrowRightLeft } from 'lucide-react';
import { Product, UserRole } from '../types/product';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, fractionType: 'unit' | 'pack100' | 'pack1000' | 'kilo') => void;
  onOpenSubstitutes: (product: Product) => void;
  userRole: UserRole;
  onUpdateProductPrice?: (productId: string, newUnitPrice: number, newMargin: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenSubstitutes,
  userRole,
  onUpdateProductPrice
}) => {
  const [selectedPack, setSelectedPack] = useState<'unit' | 'pack100' | 'pack1000' | 'kilo'>('unit');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'stock' | 'traceability' | 'pricingAdmin'>('specs');

  // Admin price edit state
  const [editPrice, setEditPrice] = useState(product.pricing.unitPrice.toString());
  const [editMargin, setEditMargin] = useState((product.pricing.profitMargin * 100).toString());
  const [savedPriceMsg, setSavedPriceMsg] = useState(false);

  const handleSavePrice = () => {
    const p = parseFloat(editPrice);
    const m = parseFloat(editMargin) / 100;
    if (!isNaN(p) && p > 0 && onUpdateProductPrice) {
      onUpdateProductPrice(product.id, p, m);
      setSavedPriceMsg(true);
      setTimeout(() => setSavedPriceMsg(false), 2000);
    }
  };

  const getPriceForSelected = () => {
    switch (selectedPack) {
      case 'pack100':
        return product.pricing.pack100Price || product.pricing.unitPrice * 100;
      case 'pack1000':
        return product.pricing.pack1000Price || product.pricing.unitPrice * 1000;
      case 'kilo':
        return product.pricing.perKiloPrice || product.pricing.unitPrice * 250;
      default:
        return product.pricing.unitPrice;
    }
  };

  const unitP = getPriceForSelected();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs bg-slate-800 border border-slate-700 text-amber-300 px-2 py-0.5 rounded font-bold">
              {product.sku}
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">EAN: {product.barcode}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6">
          {/* Top Hero Section: Photo + Quick specs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Image & Technical Drawing Preview */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={product.gallery.primary}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-slate-950/90 text-amber-400 font-mono text-xs font-bold px-2 py-1 rounded border border-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{product.location.code}</span>
                </div>
              </div>

              {/* Technical Drawing Container */}
              {product.gallery.technicalDrawingSvg && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">
                    Plano Técnico Dimensional (Cotas mm):
                  </span>
                  <div
                    className="w-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: product.gallery.technicalDrawingSvg }}
                  />
                </div>
              )}
            </div>

            {/* Right Main Info & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{product.category}</span>
                  <span>/</span>
                  <span className="text-sky-400">{product.subCategory}</span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2 leading-snug">
                  {product.name}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  {product.notes || 'Componente estándar de fijación para aplicaciones industriales pesadas.'}
                </p>

                {/* Stock Semáforo Banner */}
                <div className={`p-3 rounded-xl border flex items-center justify-between mb-4 ${
                  product.stockStatus === 'green'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : product.stockStatus === 'yellow'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${
                      product.stockStatus === 'green' ? 'bg-emerald-400' : product.stockStatus === 'yellow' ? 'bg-amber-400' : 'bg-rose-500'
                    }`} />
                    <div>
                      <div className="text-xs font-bold">
                        {product.stockStatus === 'green' && `Stock Disponible: ${product.stockCurrent} unidades`}
                        {product.stockStatus === 'yellow' && `Stock Crítico: ${product.stockCurrent} unidades (Mínimo: ${product.stockMinimum})`}
                        {product.stockStatus === 'red' && 'Agotado (0 unidades en depósito)'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {product.stockStatus === 'yellow' && `Próximo ingreso el: ${product.traceability.nextEstimatedArrival || 'Por confirmar'}`}
                        {product.stockStatus === 'red' && 'Consulte opciones sustitutas compatibles debajo'}
                        {product.stockStatus === 'green' && 'Abastecimiento normal sin quiebre previsto'}
                      </div>
                    </div>
                  </div>

                  {product.stockStatus === 'red' && (
                    <button
                      onClick={() => onOpenSubstitutes(product)}
                      className="px-2.5 py-1.5 bg-rose-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Ver Sustitutos</span>
                    </button>
                  )}
                </div>

                {/* Packaging & Pricing Quick Order Selector */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Modalidad de Venta:</span>
                    <span className="font-mono text-amber-300 font-bold text-sm">
                      ${unitP.toFixed(2)} + IVA ({Math.round(product.pricing.vatRate * 100)}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    <button
                      onClick={() => setSelectedPack('unit')}
                      className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        selectedPack === 'unit' ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>Unidad</div>
                      <div className="font-mono text-[11px] opacity-80">${product.pricing.unitPrice.toFixed(2)}</div>
                    </button>

                    {product.pricing.pack100Price && (
                      <button
                        onClick={() => setSelectedPack('pack100')}
                        className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                          selectedPack === 'pack100' ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>Caja x100</div>
                        <div className="font-mono text-[11px] opacity-80">${product.pricing.pack100Price.toFixed(2)}</div>
                      </button>
                    )}

                    {product.pricing.pack1000Price && (
                      <button
                        onClick={() => setSelectedPack('pack1000')}
                        className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                          selectedPack === 'pack1000' ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>Caja x1000</div>
                        <div className="font-mono text-[11px] opacity-80">${product.pricing.pack1000Price.toFixed(2)}</div>
                      </button>
                    )}

                    {product.pricing.perKiloPrice && (
                      <button
                        onClick={() => setSelectedPack('kilo')}
                        className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                          selectedPack === 'kilo' ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>Por Kilo</div>
                        <div className="font-mono text-[11px] opacity-80">${product.pricing.perKiloPrice.toFixed(2)}</div>
                      </button>
                    )}
                  </div>

                  {/* Add to ticket action */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center border border-slate-800 bg-slate-900 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 font-mono font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-2 text-xs font-mono font-bold text-white min-w-10 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 font-mono font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(product, qty, selectedPack);
                        onClose();
                      }}
                      disabled={product.stockStatus === 'red'}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        product.stockStatus === 'red'
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-95'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Añadir a Comanda (${(unitP * qty * 1.21).toFixed(2)} c/IVA)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Tabs: Specs / Inventory / Traceability / Admin Pricing */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg max-w-xl mb-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
                  activeTab === 'specs' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ficha Técnica
              </button>
              <button
                onClick={() => setActiveTab('stock')}
                className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
                  activeTab === 'stock' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ubicación & Depósito
              </button>
              <button
                onClick={() => setActiveTab('traceability')}
                className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
                  activeTab === 'traceability' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Trazabilidad Lote
              </button>
              {userRole === 'admin' && (
                <button
                  onClick={() => setActiveTab('pricingAdmin')}
                  className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
                    activeTab === 'pricingAdmin' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  Gestión Precios (Admin)
                </button>
              )}
            </div>

            {/* TAB 1: SPECS */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Material:</span>
                  <span className="font-semibold text-white">{product.material}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Recubrimiento:</span>
                  <span className="font-semibold text-white">{product.coating}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Norma / Estándar:</span>
                  <span className="font-mono text-amber-300">{product.specStandards || 'N/A'}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Medidas Exactas:</span>
                  <span className="font-mono text-white font-semibold">{product.dimensions.displayString}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Paso / Rosca:</span>
                  <span className="font-mono text-slate-200">{product.dimensions.threadPitch || 'N/A'}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Tipo de Encastre / Llave:</span>
                  <span className="text-slate-200">{product.dimensions.driveType || 'N/A'}</span>
                </div>
              </div>
            )}

            {/* TAB 2: INVENTORY & LOCATION */}
            {activeTab === 'stock' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[11px]">Pasillo:</span>
                    <span className="font-mono text-base font-bold text-amber-400">{product.location.aisle}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[11px]">Módulo/Estantería:</span>
                    <span className="font-mono text-base font-bold text-amber-400">{product.location.shelf}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[11px]">Nivel/Caja:</span>
                    <span className="font-mono text-base font-bold text-amber-400">{product.location.levelBox}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[11px]">Bin / Gaveta:</span>
                    <span className="font-mono text-base font-bold text-amber-400">{product.location.bin}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Zona del Depósito:</span>
                    <span className="text-white font-medium">{product.location.zoneDescription}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Punto de Reorden:</span>
                    <span className="font-mono font-bold text-amber-300">{product.stockMinimum} unidades</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TRACEABILITY */}
            {activeTab === 'traceability' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Proveedor Principal:</span>
                  <div className="font-bold text-white text-sm">{product.traceability.supplierName}</div>
                  <div className="text-slate-400 font-mono text-[11px] mt-0.5">Código Proveedor: {product.traceability.supplierCode}</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Último Ingreso de Lote:</span>
                  <div className="font-semibold text-white">{product.traceability.lastBatchDate}</div>
                  <div className="text-slate-400 font-mono text-[11px] mt-0.5">Cantidad Lote: {product.traceability.lastBatchQuantity} u.</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Próxima Llegada Prevista:</span>
                  <div className="font-semibold text-amber-400">{product.traceability.nextEstimatedArrival || 'Sin orden activa'}</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Orden de Compra Asociada:</span>
                  <div className="font-mono text-slate-200">{product.traceability.pendingPurchaseOrder || 'N/A'}</div>
                </div>
              </div>
            )}

            {/* TAB 4: ADMIN PRICING IN-PLACE */}
            {activeTab === 'pricingAdmin' && userRole === 'admin' && (
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 text-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4" />
                    <span>Ajuste Individual de Precio y Margen</span>
                  </h4>
                  {savedPriceMsg && (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-4 h-4" /> Guardado
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Precio Unitario Base ($):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Margen de Ganancia (%):</label>
                    <input
                      type="number"
                      step="1"
                      value={editMargin}
                      onChange={(e) => setEditMargin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSavePrice}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Actualizar Precio en Tiempo Real
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with EAN Barcode & Close */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <Barcode className="w-4 h-4 text-slate-500" />
            <span>Barcode: {product.barcode}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Cerrar (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
