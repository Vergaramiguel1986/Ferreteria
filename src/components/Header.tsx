/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, Keyboard, Wifi, WifiOff, ShieldCheck, Lock, LogOut, Sliders } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { UserRole } from '../types/product';

interface HeaderProps {
  currentRole: UserRole;
  onOpenLogin: () => void;
  onLogoutAdmin: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenBackoffice: () => void;
  onOpenShortcuts: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onOpenLogin,
  onLogoutAdmin,
  cartCount,
  onOpenCart,
  onOpenBackoffice,
  onOpenShortcuts,
  isOnline
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-8 sticky top-0 z-40 select-none">
      {/* Zone 1: Brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-lg lg:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-amber-500 rounded-xs inline-block"></span>
          <span>FerreFast</span>
          <span className="text-amber-400 font-mono text-sm tracking-normal font-semibold">POS</span>
        </a>

        {/* Current Role Indicator Tag */}
        {currentRole === 'admin' ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono text-[11px]">
            <span>Mostrador (Vendedor)</span>
          </span>
        )}
      </div>

      {/* Zone 2: Navigation Links & Shortcuts */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={onOpenShortcuts}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 text-xs"
          title="Ver Atajos de Teclado (F2, F9, F8, F4, Esc)"
        >
          <Keyboard className="w-4 h-4 text-slate-400" />
          <span>Atajos de Teclado</span>
          <span className="font-mono text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-amber-300">F2 · F9</span>
        </button>

        {currentRole === 'admin' && (
          <button
            onClick={onOpenBackoffice}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 text-xs"
            title="Abrir Backoffice de Administración (F4)"
          >
            <Sliders className="w-4 h-4" />
            <span>Panel Backoffice (F4)</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono whitespace-nowrap shrink-0">
          {isOnline ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3.5 h-3.5" />
              <span>En Línea</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Modo Offline (Caché local activa)</span>
            </span>
          )}
        </div>
      </nav>

      {/* Zone 3: Security Login/Logout + PWA Install + Cart */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Discrete Admin Access button vs Active session logout */}
        {currentRole === 'seller' ? (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
            title="Ingreso protegido para Administrador (Usuario y Contraseña)"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Acceso Admin</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenBackoffice}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backoffice</span>
            </button>
            <button
              onClick={onLogoutAdmin}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 text-xs transition-colors cursor-pointer"
              title="Cerrar sesión de administrador y volver a modo vendedor"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        )}

        <PWAInstallButton />

        {/* Comanda Rápida CTA */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Comanda</span>
          <span className="font-mono bg-slate-950 text-amber-400 text-[11px] px-1.5 py-0.2 rounded-full font-bold tabular-nums">
            {cartCount}
          </span>
          <span className="hidden md:inline font-mono text-[10px] text-slate-900/80 font-normal">
            (F9)
          </span>
        </button>
      </div>
    </header>
  );
};
