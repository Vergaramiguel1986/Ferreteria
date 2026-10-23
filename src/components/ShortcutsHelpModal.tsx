/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Keyboard, Zap } from 'lucide-react';

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'F2', desc: 'Enfocar la barra de búsqueda omnicanal desde cualquier punto' },
    { key: 'F9', desc: 'Emitir comanda actual y generar Código QR para caja' },
    { key: 'F4', desc: 'Abrir módulo de Inflación y Aumento Masivo de Precios (Admin)' },
    { key: 'F8', desc: 'Activar pistola o simulador de lectura de código de barras' },
    { key: 'Esc', desc: 'Limpiar término de búsqueda o cerrar modales activos' },
    { key: 'Enter', desc: 'Añadir ítem seleccionado o disparar búsqueda inmediata' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Atajos de Teclado de Mostrador</h3>
              <p className="text-[11px] text-slate-400">Optimizado para velocidad sin tocar el mouse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-5 space-y-2.5 text-xs">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
            >
              <span className="text-slate-300 flex-1">{item.desc}</span>
              <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold rounded shadow-xs text-xs shrink-0">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Entendido (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
