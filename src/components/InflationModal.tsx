/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Módulo Crítico de Gestión de Precios e Inflación Dinámica
 */

import React, { useState } from 'react';
import { X, TrendingUp, Upload, DollarSign, RefreshCw, CheckCircle, AlertTriangle, FileSpreadsheet, History, ShieldAlert } from 'lucide-react';
import { Product, UserRole } from '../types/product';
import { CATEGORIES_LIST } from '../data/catalog';
import { applyMassivePriceIncrease, importPricesFromCsvText, loadInflationLogs, InflationLog, resetCatalogToFactory } from '../services/storageService';

interface InflationModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: Product[];
  onCatalogUpdated: (newCatalog: Product[]) => void;
  userRole: UserRole;
}

export const InflationModal: React.FC<InflationModalProps> = ({
  isOpen,
  onClose,
  catalog,
  onCatalogUpdated,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState<'massive' | 'import' | 'history'>('massive');
  
  // Massive increase state
  const [percentage, setPercentage] = useState<string>('15');
  const [scope, setScope] = useState<'global' | 'category' | 'supplier'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES_LIST[1] || 'Tornillería y Fijaciones');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('Fijaciones Industriales Tel S.A.');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // CSV Import state
  const [csvContent, setCsvContent] = useState<string>(
`# FORMATO: SKU, NUEVO_PRECIO
TOR-T1-4225-ZC, 0.15
BUL-HEX-88-M12X50, 1.10
TAR-NYL-UNIV-8MM, 0.10
DIS-COR-INOX-115X10, 1.65`
  );
  const [importReport, setImportReport] = useState<{ updated: number; errors: string[] } | null>(null);

  const logs = loadInflationLogs();

  if (!isOpen) return null;

  // Extract unique suppliers
  const suppliers = Array.from(new Set(catalog.map(p => p.traceability.supplierName)));

  const handleApplyMassive = () => {
    const pct = parseFloat(percentage);
    if (isNaN(pct) || pct === 0) {
      alert('Por favor ingrese un porcentaje válido.');
      return;
    }

    const targetVal = scope === 'category' ? selectedCategory : scope === 'supplier' ? selectedSupplier : undefined;
    const { updatedCatalog, affectedCount } = applyMassivePriceIncrease(
      catalog,
      pct,
      scope,
      targetVal,
      'Administrador Mostrador'
    );

    onCatalogUpdated(updatedCatalog);
    setSuccessBanner(`¡Aumento del +${pct}% aplicado con éxito a ${affectedCount} productos en tiempo real!`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleCsvImport = () => {
    if (!csvContent.trim()) return;
    const { updatedCatalog, updatedCount, errors } = importPricesFromCsvText(
      catalog,
      csvContent,
      'Administrador Importador'
    );

    if (updatedCount > 0) {
      onCatalogUpdated(updatedCatalog);
    }
    setImportReport({ updated: updatedCount, errors });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvContent(text);
      }
    };
    reader.readAsText(file);
  };

  const handleResetCatalog = () => {
    if (confirm('¿Restablecer el catálogo completo a los precios y stocks de fábrica originales?')) {
      const reset = resetCatalogToFactory();
      onCatalogUpdated(reset);
      setSuccessBanner('Catálogo restablecido a valores iniciales de fábrica.');
      setTimeout(() => setSuccessBanner(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Módulo de Gestión de Precios e Inflación</h3>
              <p className="text-[11px] text-slate-400">Actualización en tiempo real con sincronización instantánea a terminales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Role Notice or Warning */}
        {userRole !== 'admin' && (
          <div className="bg-amber-950/60 border-b border-amber-800/60 px-5 py-2.5 flex items-center gap-2 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Modo de Solo Lectura:</strong> Requiere ROL Administrador para ejecutar aumentos masivos o importaciones.
            </span>
          </div>
        )}

        {/* Success Alert */}
        {successBanner && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-5 py-2.5 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-medium">{successBanner}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('massive')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'massive'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Aumento Masivo Porcentual</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'import'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Importación de Listas (Excel/CSV)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico de Ajustes</span>
          </button>
        </div>

        {/* Tab 1: Massive Increase */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'massive' && (
            <div className="space-y-4 max-w-xl">
              <p className="text-slate-300 leading-relaxed">
                Ajuste los precios de lista y fraccionamientos de forma porcentual para amortiguar la depreciación monetaria o aumentos de flete.
              </p>

              {/* Scope Selection */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase text-[10px] tracking-wider">
                  Alcance del Aumento:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setScope('category')}
                    className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      scope === 'category'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Por Categoría
                  </button>
                  <button
                    onClick={() => setScope('supplier')}
                    className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      scope === 'supplier'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Por Proveedor
                  </button>
                  <button
                    onClick={() => setScope('global')}
                    className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      scope === 'global'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Global (+Todo)
                  </button>
                </div>
              </div>

              {/* Conditional Target selector */}
              {scope === 'category' && (
                <div>
                  <label className="block text-slate-400 mb-1">Seleccionar Categoría:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-amber-500"
                  >
                    {CATEGORIES_LIST.filter(c => c !== 'Todas las Categorías').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {scope === 'supplier' && (
                <div>
                  <label className="block text-slate-400 mb-1">Seleccionar Proveedor:</label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-amber-500"
                  >
                    {suppliers.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Percentage input */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Porcentaje de Incremento (%):
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.5"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="Ej: 15"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 pl-3 pr-8 text-white font-mono text-base font-bold focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-3 text-slate-400 font-bold font-mono">%</span>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1">
                    {['+5%', '+10%', '+15%', '+20%'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPercentage(p.replace(/[+%]/g, ''))}
                        className="px-2.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-mono text-xs cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Impact Simulation preview */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-amber-400 font-bold uppercase tracking-wider font-sans text-xs mb-1">
                  Simulación de Impacto:
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ejemplo ítem $10.00:</span>
                  <span className="text-white font-bold">
                    ${(10 * (1 + (parseFloat(percentage) || 0) / 100)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ejemplo ítem $100.00:</span>
                  <span className="text-white font-bold">
                    ${(100 * (1 + (parseFloat(percentage) || 0) / 100)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleApplyMassive}
                disabled={userRole !== 'admin'}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Aplicar Aumento Inmediato (+{percentage}%)</span>
              </button>
            </div>
          )}

          {/* Tab 2: CSV Import */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Pegue las filas de la nueva lista del proveedor o cargue un archivo CSV con las columnas <code className="text-amber-300 font-mono">SKU</code> y <code className="text-amber-300 font-mono">NUEVO_PRECIO</code>.
              </p>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                    Datos Tabulados / CSV:
                  </label>
                  <label className="text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1 font-mono text-[11px]">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Cargar archivo .csv</span>
                    <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCsvImport}
                  disabled={userRole !== 'admin'}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Procesar e Importar Precios</span>
                </button>
              </div>

              {importReport && (
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Se actualizaron {importReport.updated} productos correctamente.</span>
                  </div>
                  {importReport.errors.length > 0 && (
                    <div className="text-rose-400 pt-1 space-y-0.5">
                      {importReport.errors.map((err, i) => (
                        <div key={i}>• {err}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: History & Logs */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Auditoría de Modificaciones de Precios:
              </h4>

              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{log.targetName}</span>
                        {log.percentage > 0 && (
                          <span className="text-amber-400 font-mono">+{log.percentage}%</span>
                        )}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5 font-mono">
                        {log.timestamp} · Operador: {log.user}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-300">
                        {log.itemsAffected} artículos
                      </span>
                      <span className="block text-[10px] text-emerald-400">Aplicado</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Factory Reset */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <button
            onClick={handleResetCatalog}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Restablecer catálogo a valores de prueba originales"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer Catálogo Semilla</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
