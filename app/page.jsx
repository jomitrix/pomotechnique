'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@heroui/react';
import PomodoroTimer from '@/components/PomodoroTimer';
import SettingsModal from '@/components/SettingsModal';
import DebugPanel from '@/components/DebugPanel';
import { getTranslation, DEFAULT_LANGUAGE } from '@/locales/index.js';

// --- Configuration & Constants ---
const DEFAULT_SETTINGS = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  language: DEFAULT_LANGUAGE,
};

const getDurations = (settings, isDebug) => {
  const mult = isDebug ? 1 : 60;
  return {
    focus: Math.min(99, Math.max(1, settings.focusTime)) * mult,
    short: Math.min(99, Math.max(1, settings.shortBreakTime)) * mult,
    long: Math.min(99, Math.max(1, settings.longBreakTime)) * mult,
  };
};

export default function PomodoroApp() {
  // --- State & Refs ---
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [mode, setMode] = useState('focus');
  const [isDebug, setIsDebug] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  const timerRef = useRef(null);

  const durations = getDurations(settings, isDebug);
  const t = getTranslation(settings.language);

  // --- Debug Activation (Console & Keystroke) ---
  useEffect(() => {
    const activateDebug = () => {
      setShowDebug(true);
      console.log(
        '%c[Pomotechnique] 🛠️ Debug panel ON until refresh.',
        'color: #f59e0b; font-size: 13px; font-weight: bold;'
      );
      return 'Debug panel attivato!';
    };

    // 1. DevTools Console: 'debug' or 'debug()'
    try {
      Object.defineProperty(window, 'debug', {
        get() {
          activateDebug();
          return activateDebug;
        },
        set(val) {
          if (val) activateDebug();
        },
        configurable: true,
      });
    } catch {
      window.debug = activateDebug;
    }

    // 2. Keystroke Sequence: 'debug'
    let keyBuffer = '';
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.key && e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);
        if (keyBuffer.endsWith('debug')) {
          activateDebug();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      try {
        delete window.debug;
      } catch {
        
      }
    };
  }, []);

  // --- Document Language Sync ---
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = settings.language || DEFAULT_LANGUAGE;
    }
  }, [settings.language]);

  // --- Audio Feedback ---
  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Ignore audio block
    }
  }, []);

  // --- Local Storage Hydration ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pomotechnique_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          focusTime: Math.min(99, Math.max(1, Number(parsed.focusTime) || DEFAULT_SETTINGS.focusTime)),
          shortBreakTime: Math.min(99, Math.max(1, Number(parsed.shortBreakTime) || DEFAULT_SETTINGS.shortBreakTime)),
          longBreakTime: Math.min(99, Math.max(1, Number(parsed.longBreakTime) || DEFAULT_SETTINGS.longBreakTime)),
          longBreakInterval: Math.min(16, Math.max(1, Number(parsed.longBreakInterval) || DEFAULT_SETTINGS.longBreakInterval)),
        };
        setSettings(merged);
        const initialDurations = getDurations(merged, isDebug);
        setTimeLeft(initialDurations[mode]);
      }
    } catch {
      // Ignore parse/storage access error
    }
  }, []);

  // --- Handlers & Timer Actions ---
  const saveSettings = (newSettings) => {
    const sanitized = {
      ...newSettings,
      focusTime: Math.min(99, Math.max(1, Number(newSettings.focusTime) || DEFAULT_SETTINGS.focusTime)),
      shortBreakTime: Math.min(99, Math.max(1, Number(newSettings.shortBreakTime) || DEFAULT_SETTINGS.shortBreakTime)),
      longBreakTime: Math.min(99, Math.max(1, Number(newSettings.longBreakTime) || DEFAULT_SETTINGS.longBreakTime)),
      longBreakInterval: Math.min(16, Math.max(1, Number(newSettings.longBreakInterval) || DEFAULT_SETTINGS.longBreakInterval)),
    };
    setSettings(sanitized);
    setIsSettingsOpen(false);
    try {
      localStorage.setItem('pomotechnique_settings', JSON.stringify(sanitized));
    } catch {
      // Ignore storage error
    }

    if (!isRunning) {
      const updatedDurations = getDurations(sanitized, isDebug);
      setTimeLeft(updatedDurations[mode]);
    }
  };

  const switchMode = useCallback(
    (newMode) => {
      setIsRunning(false);
      setMode(newMode);
      const targetDurations = getDurations(settings, isDebug);
      setTimeLeft(targetDurations[newMode]);
    },
    [isDebug, settings]
  );

  // --- Timer Engine ---
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playBeep();

            let shouldAutoStart = false;
            let nextMode = 'focus';
            if (mode === 'focus') {
              const nextCycles = completedCycles + 1;
              setCompletedCycles(nextCycles);
              const interval = Math.max(1, settings.longBreakInterval);
              const isLongBreak = nextCycles % interval === 0;
              nextMode = isLongBreak ? 'long' : 'short';
              shouldAutoStart = settings.autoStartBreaks;
            } else {
              nextMode = 'focus';
              shouldAutoStart = settings.autoStartPomodoros;
            }

            setMode(nextMode);
            setIsRunning(shouldAutoStart);
            const targetDurations = getDurations(settings, isDebug);
            return targetDurations[nextMode];
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, completedCycles, isDebug, settings, playBeep]);

  // --- Document Title Sync ---
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const labels = { focus: t.modes.focus, short: t.modes.short, long: t.modes.long };
    document.title = `${formatted} - ${labels[mode]} | Pomotechnique`;
  }, [timeLeft, mode, isDebug, t]);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const skipToNextPhase = () => {
    setIsRunning(false);
    const targetDurations = getDurations(settings, isDebug);
    if (mode === 'focus') {
      const nextCycles = completedCycles + 1;
      setCompletedCycles(nextCycles);
      const interval = Math.max(1, settings.longBreakInterval);
      const nextMode = nextCycles % interval === 0 ? 'long' : 'short';
      setMode(nextMode);
      setTimeLeft(targetDurations[nextMode]);
    } else {
      setMode('focus');
      setTimeLeft(targetDurations.focus);
    }
  };

  const toggleDebugMode = () => {
    setIsRunning(false);
    setIsDebug((prev) => {
      const next = !prev;
      const targetDurations = getDurations(settings, next);
      setTimeLeft((currentTime) => {
        if (next) {
          return Math.min(targetDurations[mode], Math.max(1, Math.round(currentTime / 60)));
        } else {
          return Math.min(targetDurations[mode], currentTime * 60);
        }
      });
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 selection:bg-rose-500/30">
      {/* --- Main Timer --- */}
      <PomodoroTimer
        mode={mode}
        onSelectMode={switchMode}
        timeLeft={timeLeft}
        totalDuration={durations[mode]}
        isRunning={isRunning}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onNextPhase={skipToNextPhase}
        completedCycles={completedCycles}
        onOpenSettings={() => setIsSettingsOpen(true)}
        t={t}
      />

      {/* --- Footer --- */}
      <footer className="mt-6 text-xs text-neutral-500 font-mono flex items-center gap-2">
        <Link 
          className="text-neutral-500 hover:text-neutral-300 transition-colors" 
          href="https://github.com/jomitrix/pomotechnique"
          isExternal
        >
          Pomotechnique
        </Link>
        <span>&bull;</span>
        <Link 
          className="text-neutral-500 hover:text-neutral-300 transition-colors" 
          href="https://github.com/jomitrix"
          isExternal
        >
          JOMITRIX
        </Link>
      </footer>

      {/* --- Settings Modal --- */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={saveSettings}
        defaultSettings={DEFAULT_SETTINGS}
      />

      {/* --- Debug Panel --- */}
      {showDebug && (
        <DebugPanel
          isDebug={isDebug}
          onToggleDebug={toggleDebugMode}
          onSkipTo3s={() => setTimeLeft(3)}
          onResetCycles={() => setCompletedCycles(0)}
          t={t}
        />
      )}
    </main>
  );
}