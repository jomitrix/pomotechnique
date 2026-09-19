'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Flask, Xmark } from '@gravity-ui/icons';

export default function DebugPanel({
  isDebug,
  onToggleDebug,
  onSkipTo3s,
  onResetCycles,
  t,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="w-64 bg-neutral-900/95 border border-neutral-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
              <Flask className="w-4 h-4 text-amber-400" />
              <span>{t.debug.panelTitle}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-neutral-200 p-0.5 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label={t.debug.close}
            >
              <Xmark className="w-4 h-4" />
            </button>
          </div>

          {/* --- Action Buttons --- */}
          <div className="flex flex-col gap-1.5">
            <Button
              size="sm"
              radius="lg"
              className={`w-full justify-between text-xs font-medium border transition-all ${
                isDebug
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-neutral-800/90 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
              }`}
              onPress={onToggleDebug}
            >
              <span>⏱️ {t.debug.minToSec}</span>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-950/70 border border-neutral-700/50">
                {isDebug ? t.debug.toggleOn : t.debug.toggleOff}
              </span>
            </Button>

            <Button
              size="sm"
              radius="lg"
              className="w-full justify-between text-xs font-medium bg-neutral-800/90 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 transition-all"
              onPress={onSkipTo3s}
            >
              <span>⚡ {t.debug.skip3s}</span>
              <span className="font-mono text-[10px] text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-950/70">
                00:03
              </span>
            </Button>

            <Button
              size="sm"
              radius="lg"
              className="w-full justify-between text-xs font-medium bg-neutral-800/90 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 transition-all"
              onPress={onResetCycles}
            >
              <span>🔄 {t.debug.resetCycles}</span>
              <span className="font-mono text-[10px] text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-950/70">
                0
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* --- Floating Trigger --- */}
      <Button
        size="sm"
        radius="full"
        aria-label={t.debug.panelTitle}
        className={`shadow-2xl border backdrop-blur-md transition-all duration-200 font-mono text-xs flex items-center gap-2 px-3.5 py-2 cursor-pointer ${
          isDebug
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 ring-1 ring-amber-500/50'
            : 'bg-neutral-900/90 text-neutral-400 border-neutral-700/80 hover:text-neutral-200 hover:bg-neutral-800'
        }`}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Flask className="w-4 h-4 text-amber-400" />
        <span>{t.debug.button}</span>
        {isDebug ? (
          <span className="inline-flex items-center gap-1 font-bold text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
            {t.debug.activeBadge}
          </span>
        ) : null}
      </Button>
    </aside>
  );
}
