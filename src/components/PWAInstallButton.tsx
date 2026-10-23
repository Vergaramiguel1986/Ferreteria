/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled || justInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        PWA Instalada
      </span>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          const res = await install();
          if (res) setJustInstalled(true);
        }}
        className="inline-flex items-center gap-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3 py-1.5 text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
        title="Instalar App en Mostrador (Acceso directo escritorio)"
      >
        <Download className="w-3.5 h-3.5" />
        Instalar PWA
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          Instalar en iPad/iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <h3 className="text-base font-bold text-white">Instalar en iPad / Mostrador Móvil</h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                1. Toca el botón <strong>Compartir</strong> en la barra de Safari.<br />
                2. Baja y selecciona <strong>Agregar a pantalla de inicio</strong>.<br />
                3. Tendrás acceso ultrarrápido offline sin barra de navegador.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-md bg-amber-500 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
