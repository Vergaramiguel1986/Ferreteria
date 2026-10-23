/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, QrCode, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { CartItem } from '../types/product';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onEmitVoucher: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onEmitVoucher
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.appliedPrice * item.quantity, 0);
  const vatAmount = subtotal * 0.21;
  const total = subtotal + vatAmount;

  const getFractionLabel = (type: CartItem['fractionType']) => {
    switch (type) {
      case 'pack100':
        return 'Caja x100';
      case 'pack1000':
        return 'Caja x1000';
      case 'kilo':
        return 'Kilo';
      default:
        return 'Unidad';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Comanda de Mostrador</h3>
            <span className="font-mono text-xs bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full font-bold">
              {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <ShoppingBag className="w-12 h-12 text-slate-700 mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-400">Comanda vacía</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Seleccione productos del catálogo o use el escáner de códigos de barra para sumar artículos.
              </p>
            </div>
          ) : (
            items.map((item, index) => {
              const itemTotal = item.appliedPrice * item.quantity;
              return (
                <div
                  key={`${item.product.id}-${item.fractionType}-${index}`}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-amber-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {item.product.location.code}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.product.sku}</span>
                      </div>
                      <h5 className="font-bold text-slate-200 mt-1 line-clamp-1">
                        {item.product.name}
                      </h5>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-amber-300 font-medium">{getFractionLabel(item.fractionType)}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-300">${item.appliedPrice.toFixed(2)} c/u</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors cursor-pointer"
                      title="Quitar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 text-slate-400 hover:text-white font-mono font-bold cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-1 font-mono font-bold text-white min-w-8 text-center text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="px-2 py-1 text-slate-400 hover:text-white font-mono font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-mono text-sm font-bold text-white tabular-nums">
                      ${itemTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Totals & Emit */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Subtotal Neto:</span>
                <span className="text-slate-200 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (21.0%):</span>
                <span className="text-slate-200 tabular-nums">${vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span className="font-sans">Total a Cobrar:</span>
                <span className="text-amber-400 font-mono tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onClearCart}
                className="px-3 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-900 text-xs font-medium transition-colors cursor-pointer"
                title="Vaciar comanda"
              >
                Vaciar
              </button>

              <button
                onClick={onEmitVoucher}
                className="flex-1 py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Generar QR de Cobro (F9)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
