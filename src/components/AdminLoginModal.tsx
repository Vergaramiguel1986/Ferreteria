/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modal de Login de Administrador para Acceso al Backoffice Protegido
 */

import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';
import { validateAdminLogin } from '../services/storageService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor complete ambos campos.');
      return;
    }

    const isValid = validateAdminLogin(username, password);
    if (isValid) {
      setError(null);
      setPassword('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Credenciales incorrectas. Verifique usuario y contraseña.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Acceso Administrador</h3>
              <p className="text-[10px] text-slate-400">Backoffice de Gestión Integral</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase text-[10px] tracking-wider">
              Usuario:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder="Admin"
              autoFocus
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-white font-mono text-sm focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase text-[10px] tracking-wider">
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-white font-mono text-sm focus:outline-hidden"
            />
          </div>

          {/* Default credentials hint for ease of use */}
          <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg font-mono text-[11px] text-slate-400 flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-semibold block">Credenciales predeterminadas:</span>
              <span>Usuario: <strong className="text-white">Admin</strong> · Clave: <strong className="text-white">admin123</strong></span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ingresar al Backoffice</span>
          </button>
        </form>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 text-center text-[10px] text-slate-500">
          Terminal de mostrador bloqueada para vendedores sin clave.
        </div>
      </div>
    </div>
  );
};
