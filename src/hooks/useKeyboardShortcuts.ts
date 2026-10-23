/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

interface ShortcutHandlers {
  onFocusSearch?: () => void;
  onEmitVoucher?: () => void;
  onClearOrEscape?: () => void;
  onToggleInflation?: () => void;
  onToggleBarcodeScan?: () => void;
  onToggleVoiceSearch?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F2: Focus Search
      if (e.key === 'F2') {
        e.preventDefault();
        handlers.onFocusSearch?.();
        return;
      }

      // F9: Emit Voucher / Checkout
      if (e.key === 'F9') {
        e.preventDefault();
        handlers.onEmitVoucher?.();
        return;
      }

      // F4: Manage Prices / Inflation
      if (e.key === 'F4') {
        e.preventDefault();
        handlers.onToggleInflation?.();
        return;
      }

      // F8: Barcode scanner simulator / input
      if (e.key === 'F8') {
        e.preventDefault();
        handlers.onToggleBarcodeScan?.();
        return;
      }

      // Escape: Clear or Close
      if (e.key === 'Escape') {
        handlers.onClearOrEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
