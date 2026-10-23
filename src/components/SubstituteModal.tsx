/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ArrowRightLeft, Check, Plus, AlertCircle, MapPin } from 'lucide-react';
import { Product } from '../types/product';
import { findSubstitutes } from '../services/searchEngine';

interface SubstituteModalProps {
  targetProduct: Product | null;
  catalog: Product[];
  onClose: () => void;
  onSelectSubstitute: (substitute: Product) => void;
}

export const SubstituteModal: React.FC<SubstituteModalProps> = ({
  targetProduct,
  catalog,
  onClose,
  onSelectSubstitute
}) => {
  if (!targetProduct) return null;

  const substitutes = findSubstitutes(targetProduct, catalog);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Sugerencia Automática de Sustitutos</h3>
              <p className="text-[11px] text-slate-400">Alternativas directas compatibles para no perder la venta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Target Out-Of-Stock Product summary */}
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-rose-400 uppercase tracking-wider font-bold">Artículo Solicitado (Sin Stock):</div>
              <div className="text-sm font-bold text-white mt-0.5">{targetProduct.name}</div>
              <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                {targetProduct.sku} · {targetProduct.dimensions.displayString}
              </div>
            </div>
            <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-bold">
              0 en Depósito
            </span>
          </div>

          <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider pt-2">
            Opciones Equivalentes Disponibles ({substitutes.length}):
          </h4>

          {substitutes.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No se hallaron equivalencias exactas en la misma familia con stock inmediato.
            </div>
          ) : (
            <div className="space-y-3">
              {substitutes.map((sub) => {
                const isDifferentMaterial = sub.material !== targetProduct.material;
                const isDifferentLength = sub.dimensions.lengthMm !== targetProduct.dimensions.lengthMm;

                return (
                  <div
                    key={sub.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-slate-900 border border-slate-800 text-amber-300 px-2 py-0.5 rounded font-bold">
                          {sub.sku}
                        </span>
                        <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Stock: {sub.stockCurrent} u.
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {sub.location.code}
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-white">{sub.name}</h5>
                      <div className="text-slate-400 text-xs font-mono">
                        Medida: {sub.dimensions.displayString}
                      </div>

                      {/* Compatibility Differentiator Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {isDifferentMaterial && (
                          <span className="bg-sky-950/80 text-sky-300 border border-sky-800/60 text-[10px] px-2 py-0.5 rounded">
                            Material superior: {sub.material} ({sub.coating})
                          </span>
                        )}
                        {isDifferentLength && (
                          <span className="bg-amber-950/80 text-amber-300 border border-amber-800/60 text-[10px] px-2 py-0.5 rounded">
                            Largo alternativo: {sub.dimensions.lengthMm} mm
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Precio Unitario</span>
                        <span className="text-base font-bold text-white font-mono">
                          ${sub.pricing.unitPrice.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onSelectSubstitute(sub);
                          onClose();
                        }}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Reemplazar & Añadir</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
