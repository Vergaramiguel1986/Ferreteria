/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Disc, Wrench, Hammer, Paintbrush, Package, Boxes, Filter } from 'lucide-react';
import { CategoryItem } from '../types/product';
import { APPLICATION_FILTERS } from '../data/catalog';

interface CategorySidebarProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedApplication: string;
  onSelectApplication: (app: string) => void;
  stockFilter: 'all' | 'inStock' | 'lowStock' | 'outOfStock';
  onStockFilterChange: (filter: 'all' | 'inStock' | 'lowStock' | 'outOfStock') => void;
  stockCounts: {
    total: number;
    green: number;
    yellow: number;
    red: number;
  };
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedApplication,
  onSelectApplication,
  stockFilter,
  onStockFilterChange,
  stockCounts
}) => {
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('tornill') || lower.includes('fijaci')) return <Layers className="w-4 h-4 text-amber-400" />;
    if (lower.includes('abrasiv') || lower.includes('corte') || lower.includes('disco')) return <Disc className="w-4 h-4 text-sky-400" />;
    if (lower.includes('herramient') || lower.includes('punta')) return <Wrench className="w-4 h-4 text-emerald-400" />;
    if (lower.includes('clav') || lower.includes('neumat')) return <Hammer className="w-4 h-4 text-purple-400" />;
    if (lower.includes('pintur') || lower.includes('quimic') || lower.includes('sellador')) return <Paintbrush className="w-4 h-4 text-rose-400" />;
    return <Boxes className="w-4 h-4 text-amber-400" />;
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-6 shrink-0 overflow-y-auto">
      {/* Category Tree */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Familias de Productos
        </h3>
        <div className="flex flex-col gap-1">
          {/* Option: All Categories */}
          <button
            onClick={() => onSelectCategory('Todas las Categorías')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              selectedCategory === 'Todas las Categorías'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="truncate">Todas las Categorías</span>
          </button>

          {/* Dynamic Categories from Backoffice */}
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.name)}
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Traffic Light System (Semáforo de Disponibilidad) */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Semáforo de Stock</span>
          <span className="text-[10px] text-slate-500 font-mono">Regla Mostrador</span>
        </h3>

        <div className="flex flex-col gap-1">
          {/* All */}
          <button
            onClick={() => onStockFilterChange('all')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
              stockFilter === 'all'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <span>Todos los Estados</span>
            <span className="font-mono text-[11px] tabular-nums">{stockCounts.total}</span>
          </button>

          {/* Green: > 50 */}
          <button
            onClick={() => onStockFilterChange('inStock')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
              stockFilter === 'inStock'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-emerald-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
              <span>Holgado (&gt;50 u.)</span>
            </span>
            <span className="font-mono text-[11px] text-emerald-400 font-semibold tabular-nums">
              {stockCounts.green}
            </span>
          </button>

          {/* Yellow: 1 to 49 */}
          <button
            onClick={() => onStockFilterChange('lowStock')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
              stockFilter === 'lowStock'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-amber-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs"></span>
              <span>Crítico (1 a 49 u.)</span>
            </span>
            <span className="font-mono text-[11px] text-amber-400 font-semibold tabular-nums">
              {stockCounts.yellow}
            </span>
          </button>

          {/* Red: 0 */}
          <button
            onClick={() => onStockFilterChange('outOfStock')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
              stockFilter === 'outOfStock'
                ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-rose-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs"></span>
              <span>Agotado (0 u.)</span>
            </span>
            <span className="font-mono text-[11px] text-rose-400 font-semibold tabular-nums">
              {stockCounts.red}
            </span>
          </button>
        </div>
      </div>

      {/* Application Facet Filter */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Superficie / Aplicación
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {APPLICATION_FILTERS.map((app) => {
            const isActive = selectedApplication === app;
            return (
              <button
                key={app}
                onClick={() => onSelectApplication(app)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer font-medium ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {app}
              </button>
            );
          })}
        </div>
      </div>

      {/* Warehouse Quick Key / Legend */}
      <div className="mt-auto pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5 font-mono">
        <p className="font-semibold text-slate-300">Nomenclatura Pasillo:</p>
        <p className="flex justify-between">
          <span>P1-P3:</span>
          <span className="text-slate-300">Tornillería & Fijaciones</span>
        </p>
        <p className="flex justify-between">
          <span>P4:</span>
          <span className="text-slate-300">Discos & Abrasivos</span>
        </p>
        <p className="flex justify-between">
          <span>P5:</span>
          <span className="text-slate-300">Herramientas & Químicos</span>
        </p>
      </div>
    </aside>
  );
};
