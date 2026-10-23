/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Barcode, Scan, CheckCircle, Volume2 } from 'lucide-react';
import { Product } from '../types/product';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: Product[];
  onProductScanned: (product: Product) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  catalog,
  onProductScanned
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Audio feedback beep using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // 1.2 kHz POS scanner beep
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // AudioContext may be restricted by browser policy
    }
  };

  const handleScanCode = (code: string) => {
    const clean = code.trim();
    if (!clean) return;

    const found = catalog.find(
      (p) => p.barcode === clean || p.sku.toLowerCase() === clean.toLowerCase()
    );

    if (found) {
      playBeep();
      setMatchedProduct(found);
      setScanMessage(`¡Escaneado con éxito! [${found.sku}]`);
      setTimeout(() => {
        onProductScanned(found);
        onClose();
      }, 700);
    } else {
      setScanMessage(`Código '${clean}' no encontrado en el maestro de artículos.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScanCode(barcodeInput);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Scan className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Lector de Códigos de Barra Industrial</h3>
              <p className="text-[11px] text-slate-400">Compatible con pistola láser USB/Bluetooth y teclado emulado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Simulation Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Visual Red Laser line simulation */}
          <div className="relative h-28 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse"></div>
            <Barcode className="w-20 h-20 text-slate-700 opacity-60" />
            <span className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-wider z-10">
              Apunta la pistola láser al código de barra
            </span>
          </div>

          {/* Scanner Input field */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">
              Entrada del Escáner (EAN-13 o SKU):
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escanee o tipee el código (ej: 7798123456012) + Enter"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-sm focus:border-amber-500 focus:outline-hidden"
              />
              <button
                onClick={() => handleScanCode(barcodeInput)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
              >
                Buscar
              </button>
            </div>
          </div>

          {scanMessage && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 font-mono ${
              matchedProduct ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}>
              {matchedProduct && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              <span>{scanMessage}</span>
            </div>
          )}

          {/* Quick Barcode Testing Buttons */}
          <div>
            <span className="text-slate-400 font-semibold block mb-2 uppercase text-[10px] tracking-wider">
              Simular Lectura Rápida de Códigos de Muestra:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {catalog.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setBarcodeInput(item.barcode);
                    handleScanCode(item.barcode);
                  }}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <div className="font-mono text-amber-300 font-bold text-[11px] truncate">{item.barcode}</div>
                  <div className="text-slate-400 text-[10px] truncate">{item.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Cerrar (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
