/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Plus, Calendar, AlertOctagon, ArrowRightLeft, FileText, Check } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, fractionType: 'unit' | 'pack100' | 'pack1000' | 'kilo') => void;
  onOpenDetail: (product: Product) => void;
  onOpenSubstitutes: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetail,
  onOpenSubstitutes
}) => {
  const [selectedPack, setSelectedPack] = useState<'unit' | 'pack100' | 'pack1000' | 'kilo'>('unit');
  const [qty, setQty] = useState<number>(1);
  const [imageError, setImageError] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const getPackPrice = () => {
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

  const handleAdd = () => {
    onAddToCart(product, qty, selectedPack);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 900);
  };

  const currentPackPrice = getPackPrice();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 transition-all shadow-sm hover:shadow-md group">
      {/* Top Image + Badges Header */}
      <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(product)}>
        {!imageError ? (
          <img
            src={product.gallery.primary}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4 text-center">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
              {product.category}
            </span>
            <span className="text-xs font-semibold text-slate-300">{product.name}</span>
          </div>
        )}

        {/* Physical Location Badge (Pasillo - Estantería - Caja) */}
        <div className="absolute top-2.5 left-2.5 bg-slate-950/90 border border-slate-700 text-amber-300 font-mono text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1.5 backdrop-blur-xs">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{product.location.code}</span>
        </div>

        {/* SKU tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 text-slate-300 font-mono text-[11px] px-2 py-0.5 rounded backdrop-blur-xs border border-slate-800">
          {product.sku}
        </div>

        {/* Traffic Light Stock Pill */}
        <div className="absolute top-2.5 right-2.5">
          {product.stockStatus === 'green' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-xs font-medium backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="tabular-nums font-mono font-bold">{product.stockCurrent} u.</span>
            </span>
          )}
          {product.stockStatus === 'yellow' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/90 text-amber-300 border border-amber-500/50 text-xs font-medium backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="tabular-nums font-mono font-bold">{product.stockCurrent} u. Crítico</span>
            </span>
          )}
          {product.stockStatus === 'red' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/90 text-rose-300 border border-rose-500/50 text-xs font-medium backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="font-bold">Agotado (0)</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Info Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Application Metadata */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
            <span className="truncate">{product.subCategory}</span>
            <span aria-hidden="true">·</span>
            <span className="text-sky-400 font-medium">{product.application}</span>
          </div>

          {/* Product Title */}
          <h4
            onClick={() => onOpenDetail(product)}
            className="text-sm font-bold text-white hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer mb-1.5"
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Dimension Highlight */}
          <div className="inline-block bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono px-2 py-0.5 rounded mb-2">
            <strong>Medidas:</strong> {product.dimensions.displayString}
          </div>

          {/* Stock Condition Alerts */}
          {product.stockStatus === 'yellow' && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded px-2 py-1 mb-2">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Próximo ingreso el {product.traceability.nextEstimatedArrival || 'en camino'}</span>
            </div>
          )}

          {product.stockStatus === 'red' && (
            <button
              onClick={() => onOpenSubstitutes(product)}
              className="w-full flex items-center justify-between text-[11px] text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/50 rounded px-2.5 py-1.5 mb-2 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-semibold">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Ver Sustitutos Compatibles</span>
              </span>
              <ArrowRightLeft className="w-3.5 h-3.5 text-rose-400" />
            </button>
          )}
        </div>

        {/* Pricing & Fast Checkout Segment */}
        <div className="pt-2 border-t border-slate-800/80">
          {/* Packaging Selection Buttons */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-md mb-2 border border-slate-800 text-[10px]">
            <button
              onClick={() => setSelectedPack('unit')}
              className={`flex-1 py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                selectedPack === 'unit' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unidad
            </button>
            {product.pricing.pack100Price && (
              <button
                onClick={() => setSelectedPack('pack100')}
                className={`flex-1 py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                  selectedPack === 'pack100' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Caja x100
              </button>
            )}
            {product.pricing.pack1000Price && (
              <button
                onClick={() => setSelectedPack('pack1000')}
                className={`flex-1 py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                  selectedPack === 'pack1000' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Caja x1000
              </button>
            )}
            {product.pricing.perKiloPrice && (
              <button
                onClick={() => setSelectedPack('kilo')}
                className={`flex-1 py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                  selectedPack === 'kilo' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                x Kilo
              </button>
            )}
          </div>

          {/* Price display and Fast Add */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Precio Final</span>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                ${currentPackPrice.toFixed(2)}
                <span className="text-[10px] text-slate-400 font-normal ml-1">+IVA</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenDetail(product)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Ver Ficha Técnica Completa"
              >
                <FileText className="w-4 h-4" />
              </button>

              <button
                onClick={handleAdd}
                disabled={product.stockStatus === 'red'}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  product.stockStatus === 'red'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : addedNotice
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                }`}
                title={product.stockStatus === 'red' ? 'Sin stock' : 'Sumar a Comanda'}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Listo!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
