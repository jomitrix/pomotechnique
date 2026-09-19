'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Tabs } from '@heroui/react';
import { ArrowRotateLeft, ForwardStepFill, Gear, Clock } from '@gravity-ui/icons';

export default function PomodoroTimer({
  mode,
  onSelectMode,
  timeLeft,
  totalDuration,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onNextPhase,
  completedCycles,
  onOpenSettings,
  t,
}) {
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });
  const boxRef = useRef(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = totalDuration > 0
    ? Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100))
    : 0;

  // --- Theme Configuration ---
  const theme = {
    focus: {
      buttonBg: 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/50 shadow-lg text-white border-none',
      pauseBg: 'bg-neutral-700 hover:bg-neutral-600 shadow-neutral-900/50 shadow-lg text-white border-none',
      activeTab: 'bg-rose-600/25 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950/50 font-semibold',
      fillHex: '#f43f5e',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500',
    },
    short: {
      buttonBg: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/50 shadow-lg text-white border-none',
      pauseBg: 'bg-neutral-700 hover:bg-neutral-600 shadow-neutral-900/50 shadow-lg text-white border-none',
      activeTab: 'bg-cyan-600/25 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50 font-semibold',
      fillHex: '#06b6d4',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      dot: 'bg-cyan-400',
    },
    long: {
      buttonBg: 'bg-violet-600 hover:bg-violet-500 shadow-violet-900/50 shadow-lg text-white border-none',
      pauseBg: 'bg-neutral-700 hover:bg-neutral-600 shadow-neutral-900/50 shadow-lg text-white border-none',
      activeTab: 'bg-violet-600/25 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-950/50 font-semibold',
      fillHex: '#8b5cf6',
      badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      dot: 'bg-violet-400',
    },
  }[mode] || {
    buttonBg: 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/50 shadow-lg text-white border-none',
    pauseBg: 'bg-neutral-700 hover:bg-neutral-600 shadow-neutral-900/50 shadow-lg text-white border-none',
    activeTab: 'bg-rose-600/25 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950/50 font-semibold',
    fillHex: '#f43f5e',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500',
  };

  // --- Perimeter Calculation ---
  useEffect(() => {
    if (!boxRef.current) return;
    const updateSize = () => {
      if (boxRef.current) {
        const { clientWidth, clientHeight } = boxRef.current;
        setBoxSize({ width: clientWidth, height: clientHeight });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  const strokeWidth = 4;
  const radius = 26;
  const w = Math.max(0, boxSize.width - strokeWidth);
  const h = Math.max(0, boxSize.height - strokeWidth);
  const r = Math.min(radius, w / 2, h / 2);
  const x = strokeWidth / 2;
  const y = strokeWidth / 2;

  const pathD =
    boxSize.width > 0 && boxSize.height > 0
      ? `M ${x + w / 2} ${y} ` +
        `L ${x + w - r} ${y} ` +
        `A ${r} ${r} 0 0 1 ${x + w} ${y + r} ` +
        `L ${x + w} ${y + h - r} ` +
        `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} ` +
        `L ${x + r} ${y + h} ` +
        `A ${r} ${r} 0 0 1 ${x} ${y + h - r} ` +
        `L ${x} ${y + r} ` +
        `A ${r} ${r} 0 0 1 ${x + r} ${y} ` +
        `Z`
      : '';

  const perimeter = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
  const strokeDashoffset = perimeter - (progress / 100) * perimeter;

  return (
    <div className="w-full max-w-md rounded-3xl bg-neutral-900/80 border border-neutral-800/80 p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-6">
      {/* --- Header --- */}
      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icon.png`} alt="Pomotechnique logo" className="w-4 h-4" />
          <span>Pomotechnique</span>
        </div>

        <Button
          isIconOnly
          size="sm"
          radius="full"
          aria-label={t.settings.title}
          title={t.settings.title}
          className="w-8 h-8 bg-neutral-800/60 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700/50 shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
          onPress={onOpenSettings}
        >
          <Gear className="w-4 h-4" />
        </Button>
      </div>

      {/* --- Mode Selection --- */}
      <Tabs
        aria-label="Timer Modes"
        selectedKey={mode}
        onSelectionChange={(key) => onSelectMode(String(key))}
        className="w-full"
      >
        <Tabs.ListContainer className="w-full bg-neutral-800/60 p-1.5 rounded-2xl border border-neutral-700/40">
          <Tabs.List aria-label="Timer Modes List" className="grid grid-cols-3 gap-1.5 w-full">
            <Tabs.Tab
              id="focus"
              className={`py-2 px-3 text-xs md:text-sm rounded-xl text-center transition-all cursor-pointer select-none ${
                mode === 'focus'
                  ? theme.activeTab
                  : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
              }`}
            >
              {t.modes.focus}
            </Tabs.Tab>

            <Tabs.Tab
              id="short"
              className={`py-2 px-3 text-xs md:text-sm rounded-xl text-center transition-all cursor-pointer select-none ${
                mode === 'short'
                  ? theme.activeTab
                  : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
              }`}
            >
              {t.modes.short}
            </Tabs.Tab>

            <Tabs.Tab
              id="long"
              className={`py-2 px-3 text-xs md:text-sm rounded-xl text-center transition-all cursor-pointer select-none ${
                mode === 'long'
                  ? theme.activeTab
                  : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
              }`}
            >
              {t.modes.long}
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      {/* --- Timer Display & Progress Ring --- */}
      <div
        ref={boxRef}
        className="relative w-full py-8 px-6 flex items-center justify-center rounded-3xl bg-neutral-950/40 my-1 overflow-hidden"
      >
        {boxSize.width > 0 && boxSize.height > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            width={boxSize.width}
            height={boxSize.height}
          >
            <path
              d={pathD}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth={strokeWidth}
            />
            <path
              d={pathD}
              fill="none"
              stroke={theme.fillHex}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={perimeter}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${theme.fillHex}90)`,
              }}
            />
          </svg>
        )}

        <div className="text-7xl md:text-8xl font-bold tracking-tight text-white tabular-nums select-none z-10">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      {/* --- Timer Controls --- */}
      <div className="relative flex items-center justify-center w-full mt-2 gap-3.5">
        <Button
          isIconOnly
          size="lg"
          radius="full"
          aria-label={t.controls.reset}
          title={t.controls.reset}
          className="w-14 h-14 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/50 shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
          onPress={onResetTimer}
        >
          <ArrowRotateLeft className="w-5 h-5" />
        </Button>

        <Button
          size="lg"
          radius="full"
          className={`w-44 sm:w-48 h-14 text-base font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer ${
            isRunning ? theme.pauseBg : theme.buttonBg
          }`}
          onPress={onToggleTimer}
        >
          {isRunning ? t.controls.pause : t.controls.start}
        </Button>

        <Button
          isIconOnly
          size="lg"
          radius="full"
          aria-label={t.controls.next}
          title={t.controls.next}
          className="w-14 h-14 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/50 shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
          onPress={onNextPhase}
        >
          <ForwardStepFill className="w-5 h-5" />
        </Button>
      </div>

      {/* --- Completed Cycles Badge --- */}
      <div className="flex items-center gap-2 pt-1">
        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border ${theme.badge}`}>
          <span className={`w-2 h-2 rounded-full ${theme.dot} ${isRunning ? 'animate-pulse' : ''}`} />
          {t.status.completed}: {completedCycles}
        </span>
      </div>
    </div>
  );
}
