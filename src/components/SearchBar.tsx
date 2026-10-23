/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, Barcode, X, Zap, CornerDownLeft } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  latencyMs: number;
  totalMatches: number;
  onOpenBarcodeScanner: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  latencyMs,
  totalMatches,
  onOpenBarcodeScanner,
  inputRef
}) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onQueryChange(transcript);
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onQueryChange]);

  const toggleVoiceSearch = () => {
    if (!voiceSupported) {
      alert('Tu navegador no soporta entrada de voz por SpeechRecognition API nativa.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Voice start failed or already active:', err);
      }
    }
  };

  const sampleShortcuts = [
    { label: 'T1 Mecha (4.2x25)', query: 't1 mecha' },
    { label: 'Bulón 8.8 M12x50', query: 'bulon m12' },
    { label: 'Tarugo Nylon 8mm', query: 'tarugo 8' },
    { label: 'Disco Corte 115mm', query: 'disco 115' },
    { label: 'Línea Inoxidable', query: 'inox' }
  ];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-3 lg:px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        
        {/* Main Search Input Container */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-5 h-5 text-amber-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar por Nombre, SKU, Medida (ej: 10x2, M12, 115mm), Ubicación (P3-E2) o Código de Barras..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg pl-11 pr-32 py-2.5 text-sm lg:text-base text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-all font-mono"
          />

          {/* Right Action Cluster Inside Input */}
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {query && (
              <button
                onClick={() => onQueryChange('')}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Limpiar búsqueda (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice Input Button */}
            <button
              onClick={toggleVoiceSearch}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isListening ? 'Escuchando... hable ahora' : 'Búsqueda por Voz (Dictar producto)'}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Barcode Scanner Modal Trigger */}
            <button
              onClick={onOpenBarcodeScanner}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Escanear Código de Barras (F8)"
            >
              <Barcode className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Escanear</span>
            </button>
          </div>
        </div>

        {/* Latency & Match Benchmark Badge */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md text-slate-300 font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>{latencyMs.toFixed(1)} ms</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              <strong className="text-white">{totalMatches}</strong> productos
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 font-mono">
            <span>Enfocar:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">F2</kbd>
          </div>
        </div>
      </div>

      {/* Suggested Quick Term Tags (Buttons / Tabs) */}
      <div className="max-w-7xl mx-auto mt-2.5 flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
        <span className="text-slate-500 shrink-0 text-[11px] uppercase tracking-wider font-semibold">
          Frecuentes:
        </span>
        {sampleShortcuts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onQueryChange(chip.query)}
            className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 border border-slate-700/60 font-mono text-[11px]"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
