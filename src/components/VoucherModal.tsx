/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Printer, CheckCircle, Copy, Check } from 'lucide-react';
import { OrderVoucher, StoreSettings } from '../types/product';
import { DEFAULT_SETTINGS } from '../services/storageService';

interface VoucherModalProps {
  voucher: OrderVoucher | null;
  onClose: () => void;
  storeSettings?: StoreSettings;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ voucher, onClose, storeSettings = DEFAULT_SETTINGS }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (voucher) {
      QRCode.toDataURL(voucher.paymentQrData, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [voucher]);

  if (!voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">Comanda Lista para Cobro</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div
            ref={ticketRef}
            className="bg-white text-slate-950 p-6 rounded-xl shadow-inner font-mono text-xs space-y-3"
          >
            {/* Ticket Header */}
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <h2 className="text-sm font-extrabold uppercase tracking-tight leading-tight">
                {storeSettings.storeName}
              </h2>
              <p className="text-[10px] text-slate-600 mt-0.5">{storeSettings.taxId}</p>
              <p className="text-[9px] text-slate-500">{storeSettings.address}</p>
              <p className="text-[9px] text-slate-500">Tel: {storeSettings.phone}</p>
              
              <div className="mt-2 text-xs font-bold bg-slate-100 py-1 rounded inline-block px-3">
                {voucher.code}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{voucher.timestamp}</p>
              <p className="text-[10px] text-slate-500">Operador: {voucher.sellerName}</p>
            </div>

            {/* QR Code Centerpiece */}
            <div className="flex flex-col items-center justify-center py-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR para Cobro en Caja"
                  className="w-36 h-36 rounded-lg border border-slate-300 p-1"
                />
              ) : (
                <div className="w-36 h-36 bg-slate-100 animate-pulse rounded-lg" />
              )}
              <span className="text-[10px] text-slate-600 mt-1.5 font-bold uppercase tracking-wider">
                Presente este QR en Caja
              </span>
            </div>

            {/* Line Items Breakdown */}
            <div className="border-t border-b border-dashed border-slate-300 py-2.5 space-y-1.5">
              <div className="flex justify-between font-bold text-[10px] uppercase text-slate-600 pb-1">
                <span>Cant / Art.</span>
                <span>Ubicación</span>
                <span>Total</span>
              </div>
              {voucher.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-[11px] gap-2">
                  <div className="flex-1 leading-tight">
                    <span className="font-bold">{item.quantity}x</span> {item.product.name.slice(0, 22)}...
                    <div className="text-[9px] text-slate-500">{item.product.sku}</div>
                  </div>
                  <span className="font-bold text-amber-800 shrink-0 text-[10px] bg-amber-50 px-1 rounded">
                    {item.product.location.code}
                  </span>
                  <span className="font-bold shrink-0">
                    ${(item.appliedPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="space-y-1 text-right pt-1">
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Subtotal Neto:</span>
                <span>${voucher.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>IVA ({Math.round(storeSettings.defaultVatRate * 100)}%):</span>
                <span>${voucher.vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-slate-300 text-slate-900">
                <span>TOTAL A PAGAR:</span>
                <span>${voucher.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Custom footer text from Settings */}
            <div className="pt-2 text-center border-t border-dashed border-slate-300 space-y-1">
              <p className="text-[9px] text-slate-500 leading-tight">
                {storeSettings.ticketFooter}
              </p>
              <div className="tracking-[0.25em] font-extrabold text-slate-800 text-[10px] py-0.5">
                || | |||| | ||| || |||| | | |||
              </div>
              <span className="text-[8px] text-slate-400">{voucher.paymentQrData.slice(0, 32)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Código'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
            >
              Nueva Venta (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
