'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Switch, NumberField, Tabs, ScrollShadow } from '@heroui/react';
import { Gear, Clock, Globe, Sliders, ChevronLeft, ChevronRight } from '@gravity-ui/icons';
import { getTranslation } from '@/locales/index.js';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  defaultSettings,
}) {
  const [tempSettings, setTempSettings] = useState(settings);

  // --- State Synchronization ---
  useEffect(() => {
    if (isOpen) {
      setTempSettings(settings);
    }
  }, [isOpen, settings]);

  const tempT = getTranslation(tempSettings.language);

  // --- Handlers ---
  const handleResetDefaults = () => {
    if (defaultSettings) {
      setTempSettings((prev) => ({
        ...defaultSettings,
        language: prev.language,
      }));
    }
  };

  const handleSave = () => {
    const sanitizedSettings = {
      ...tempSettings,
      focusTime: Math.min(99, Math.max(1, Number(tempSettings.focusTime) || 1)),
      shortBreakTime: Math.min(99, Math.max(1, Number(tempSettings.shortBreakTime) || 1)),
      longBreakTime: Math.min(99, Math.max(1, Number(tempSettings.longBreakTime) || 1)),
      longBreakInterval: Math.min(16, Math.max(1, Number(tempSettings.longBreakInterval) || 1)),
    };
    onSaveSettings(sanitizedSettings);
  };

  return (
    <Modal.Root isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center">
          <Modal.Dialog className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col max-h-[85vh] overflow-hidden text-neutral-100 outline-none p-0">
            {/* --- Modal Header --- */}
            <Modal.Header className="px-6 py-4.5 border-b border-neutral-800/80 flex flex-row items-center justify-between shrink-0 bg-neutral-900/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-300">
                  <Gear className="w-4 h-4 text-neutral-300" />
                </div>
                <Modal.Heading className="text-base font-bold tracking-wider uppercase text-white font-mono m-0">
                  {tempT.settings.title}
                </Modal.Heading>
              </div>
              <Modal.CloseTrigger
                onPress={onClose}
                aria-label={tempT.settings.title}
                className="static w-8 h-8 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700/40 flex items-center justify-center transition-colors cursor-pointer"
              />
            </Modal.Header>

            {/* --- Modal Content --- */}
            <Modal.Body className="p-0 flex-1 min-h-0 overflow-hidden flex flex-col text-neutral-100">
              <ScrollShadow className="flex-1 min-h-0 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                {/* --- Time Section --- */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{tempT.settings.timeSection}</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Focus Duration */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium text-neutral-400 text-center">
                      {tempT.settings.pomodoro}
                    </label>
                    <NumberField
                      value={tempSettings.focusTime}
                      onChange={(val) => {
                        if (typeof val === 'number' && !isNaN(val)) {
                          setTempSettings((prev) => ({
                            ...prev,
                            focusTime: Math.min(99, Math.max(1, Math.round(val))),
                          }));
                        }
                      }}
                      minValue={1}
                      maxValue={99}
                      aria-label={tempT.settings.pomodoro}
                      className="w-full"
                    >
                      <NumberField.Group className="!grid !grid-cols-[28px_1fr_28px] items-center bg-neutral-800/70 border border-neutral-700/60 hover:border-neutral-600 rounded-2xl !h-11 px-1 shadow-none transition-all focus-within:!border-rose-500 focus-within:!ring-2 focus-within:!ring-rose-500/40 [--focus:#f43f5e] [--field-border-focus:#f43f5e] [--field-focus:transparent] focus-within:!outline-none outline-none">
                        <NumberField.DecrementButton
                          aria-label={`${tempT.settings.pomodoro} -`}
                          className="!w-7 !h-7 flex items-center justify-center justify-self-center rounded-xl bg-transparent hover:bg-neutral-700/60 active:bg-neutral-600 active:scale-95 text-neutral-400 hover:text-white transition-all cursor-pointer !border-0 p-0 shadow-none outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </NumberField.DecrementButton>
                        <NumberField.Input
                          maxLength={2}
                          className="w-full text-center text-base sm:text-lg font-bold text-white bg-transparent border-0 p-0 shadow-none outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <NumberField.IncrementButton
                          aria-label={`${tempT.settings.pomodoro} +`}
                          className="!w-7 !h-7 flex items-center justify-center justify-self-center rounded-xl bg-transparent hover:bg-neutral-700/60 active:bg-neutral-600 active:scale-95 text-neutral-400 hover:text-white transition-all cursor-pointer !border-0 p-0 shadow-none outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </NumberField.IncrementButton>
                      </NumberField.Group>
                    </NumberField>
                  </div>

                  {/* Short Break Duration */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium text-neutral-400 text-center">
                      {tempT.settings.shortBreak}
                    </label>
                    <NumberField
                      value={tempSettings.shortBreakTime}
                      onChange={(val) => {
                        if (typeof val === 'number' && !isNaN(val)) {
                          setTempSettings((prev) => ({
                            ...prev,
                            shortBreakTime: Math.min(99, Math.max(1, Math.round(val))),
                          }));
                        }
                      }}
                      minValue={1}
                      maxValue={99}
                      aria-label={tempT.settings.shortBreak}
                      className="w-full"
                    >
                      <NumberField.Group className="!grid !grid-cols-[28px_1fr_28px] items-center bg-neutral-800/70 border border-neutral-700/60 hover:border-neutral-600 rounded-2xl !h-11 px-1 shadow-none transition-all focus-within:!border-rose-500 focus-within:!ring-2 focus-within:!ring-rose-500/40 [--focus:#f43f5e] [--field-border-focus:#f43f5e] [--field-focus:transparent] focus-within:!outline-none outline-none">
                        <NumberField.DecrementButton
                          aria-label={`${tempT.settings.shortBreak} -`}
                          className="!w-7 !h-7 flex items-center justify-center justify-self-center rounded-xl bg-transparent hover:bg-neutral-700/60 active:bg-neutral-600 active:scale-95 text-neutral-400 hover:text-white transition-all cursor-pointer !border-0 p-0 shadow-none outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </NumberField.DecrementButton>
                        <NumberField.Input
                          maxLength={2}
                          className="w-full text-center text-base sm:text-lg font-bold text-white bg-transparent border-0 p-0 shadow-none outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <NumberField.IncrementButton
                          aria-label={`${tempT.settings.shortBreak} +`}
                          className="!w-7 !h-7 flex items-center justify-center justify-self-center rounded-xl bg-transparent hover:bg-neutral-700/60 active:bg-neutral-600 active:scale-95 text-neutral-400 hover:text-white transition-all cursor-pointer !border-0 p-0 shadow-none outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </NumberField.IncrementButton>
                      </NumberField.Group>
                    </NumberField>
                  </div>

                  {/* Long Break Duration */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium text-neutral-400 text-center">
                      {tempT.settings.longBreak}
                    </label>
                    <NumberField
                      value={tempSettings.longBreakTime}
                      onChange={(val) => {
                        if (typeof val === 'number' && !isNaN(val)) {
                          setTempSettings((prev) => ({
                            ...prev,
                            longBreakTime: Math.min(99, Math.max(1, Math.round(val))),
                          }));
                        }
                      }}
                      minValue={1}
                      maxValue={99}
                      aria-label={tempT.settings.longBreak}
                      className="w-full"
                    >
                      <NumberField.Group className="!grid !grid-cols-[28px_1fr_28px] items-center bg-neutral-800/70 border border-neutral-700/60 hover:border-neutral-600 rounded-2xl !h-11 px-1 shadow-none transition-all focus-within:!border-rose-500 focus-within:!ring-2 focus-within:!ring-rose-500/40 [--focus:#f43f5e] [--field-border-focus:#f43f5e] [--field-focus:transparent] focus-within:!outline-none outline-none">
                        <NumberField.DecrementButton
                          aria-label={`${tempT.settings.longBreak} -`}
                          className="!w-7 !h-7 flex items-center justify-center justify-self-center rounded-xl bg-transparent hover:bg-neutral-700/60 active:bg-neutral-600 active:scale-95 text-neutral-400 hover:text-white transition-all cursor-pointer !border-0 p-0 shadow-none outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </NumberField.DecrementButton>
                        <NumberField.Input
                          maxLength={2}
                          className="w-full text-center text-base sm:text-lg font-bold text-white bg-transparent border-0 p-0 shadow-none outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <NumberField.IncrementButton
                          aria-label={`${tempT.settings.longBreak} +`}
                          className="!w-7 !h-7 flex items-center justify-center justify-self-center rounded-xl bg-transparent hover:bg-neutral-700/60 active:bg-neutral-600 active:scale-95 text-neutral-400 hover:text-white transition-all cursor-pointer !border-0 p-0 shadow-none outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </NumberField.IncrementButton>
                      </NumberField.Group>
                    </NumberField>
                  </div>
                </div>
              </div>

              {/* --- Automation & Interval Section --- */}
              <div className="flex flex-col gap-2.5">
                {/* Auto Start Breaks */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700/60 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-200">
                      {tempT.settings.autoStartBreaks}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {tempT.settings.autoStartBreaksDesc}
                    </span>
                  </div>
                  <Switch
                    isSelected={tempSettings.autoStartBreaks}
                    onChange={(isSelected) =>
                      setTempSettings((prev) => ({
                        ...prev,
                        autoStartBreaks: isSelected,
                      }))
                    }
                    aria-label={tempT.settings.autoStartBreaks}
                    className="[--switch-control-bg-checked:#e11d48] [--switch-control-bg-checked-hover:#be123c] [--switch-control-bg:#404040] [--switch-control-bg-hover:#525252] cursor-pointer"
                  >
                    <Switch.Content className="cursor-pointer p-0">
                      <Switch.Control>
                        <Switch.Thumb className="!bg-white shadow-md" />
                      </Switch.Control>
                    </Switch.Content>
                  </Switch>
                </div>

                {/* Auto Start Pomodoros */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700/60 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-200">
                      {tempT.settings.autoStartPomodoros}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {tempT.settings.autoStartPomodorosDesc}
                    </span>
                  </div>
                  <Switch
                    isSelected={tempSettings.autoStartPomodoros}
                    onChange={(isSelected) =>
                      setTempSettings((prev) => ({
                        ...prev,
                        autoStartPomodoros: isSelected,
                      }))
                    }
                    aria-label={tempT.settings.autoStartPomodoros}
                    className="[--switch-control-bg-checked:#e11d48] [--switch-control-bg-checked-hover:#be123c] [--switch-control-bg:#404040] [--switch-control-bg-hover:#525252] cursor-pointer"
                  >
                    <Switch.Content className="cursor-pointer p-0">
                      <Switch.Control>
                        <Switch.Thumb className="!bg-white shadow-md" />
                      </Switch.Control>
                    </Switch.Content>
                  </Switch>
                </div>

                {/* Long Break Interval */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700/60 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-200">
                      {tempT.settings.longBreakInterval}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {tempT.settings.longBreakIntervalDesc}
                    </span>
                  </div>
                  <NumberField
                    value={tempSettings.longBreakInterval}
                    onChange={(val) => {
                      if (typeof val === 'number' && !isNaN(val)) {
                        setTempSettings((prev) => ({
                          ...prev,
                          longBreakInterval: Math.min(16, Math.max(1, Math.round(val))),
                        }));
                      }
                    }}
                    minValue={1}
                    maxValue={16}
                    aria-label={tempT.settings.longBreakInterval}
                    className="w-auto"
                  >
                    <NumberField.Group className="!flex items-center gap-1 bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600 rounded-xl p-1 !h-auto shadow-none transition-all focus-within:!border-rose-500 focus-within:!ring-2 focus-within:!ring-rose-500/40 [--focus:#f43f5e] [--field-border-focus:#f43f5e] [--field-focus:transparent] focus-within:!outline-none outline-none">
                      <NumberField.DecrementButton
                        aria-label={`${tempT.settings.longBreakInterval} -`}
                        className="!w-7 !h-7 flex items-center justify-center rounded-lg hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-300 font-bold transition-all cursor-pointer !border-0 bg-transparent p-0 shadow-none outline-none focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                      <NumberField.Input
                        maxLength={2}
                        className="w-6 text-center font-mono font-bold text-sm text-white bg-transparent border-0 p-0 shadow-none outline-none focus:outline-none"
                      />
                      <NumberField.IncrementButton
                        aria-label={`${tempT.settings.longBreakInterval} +`}
                        className="!w-7 !h-7 flex items-center justify-center rounded-lg hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-300 font-bold transition-all cursor-pointer !border-0 bg-transparent p-0 shadow-none outline-none focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </NumberField.Group>
                  </NumberField>
                </div>

                <br />
                
                {/* --- General Section --- */}
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
                  <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{tempT.settings.generalSection}</span>
                </div>

                {/* Language Setting */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700/60 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-neutral-400" />
                      {tempT.settings.language}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {tempT.settings.languageDesc}
                    </span>
                  </div>
                  <Tabs
                    aria-label={tempT.settings.language}
                    selectedKey={tempSettings.language}
                    onSelectionChange={(key) =>
                      setTempSettings((prev) => ({ ...prev, language: String(key) }))
                    }
                    className="w-auto"
                  >
                    <Tabs.ListContainer className="bg-neutral-800/60 p-1.5 rounded-2xl border border-neutral-700/40">
                      <Tabs.List aria-label={tempT.settings.language} className="grid grid-cols-2 gap-1.5 p-0">
                        <Tabs.Tab
                          id="en"
                          className={`py-1.5 px-3 text-xs md:text-sm rounded-xl text-center transition-all duration-200 cursor-pointer select-none outline-none ${
                            tempSettings.language === 'en'
                              ? 'bg-rose-600/25 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950/50 font-semibold'
                              : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                          }`}
                        >
                          English
                        </Tabs.Tab>
                        <Tabs.Tab
                          id="it"
                          className={`py-1.5 px-3 text-xs md:text-sm rounded-xl text-center transition-all duration-200 cursor-pointer select-none outline-none ${
                            tempSettings.language === 'it'
                              ? 'bg-rose-600/25 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950/50 font-semibold'
                              : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                          }`}
                        >
                          Italiano
                        </Tabs.Tab>
                      </Tabs.List>
                    </Tabs.ListContainer>
                  </Tabs>
                </div>
              </div>
              </ScrollShadow>
            </Modal.Body>

            {/* --- Modal Footer --- */}
            <Modal.Footer className="px-6 py-4.5 border-t border-neutral-800/80 bg-neutral-900/80 backdrop-blur-xl flex flex-row items-center justify-between shrink-0 z-10 shadow-lg shadow-black/40 mt-0">
              <Button
                variant="ghost"
                size="sm"
                onPress={handleResetDefaults}
                className="h-auto p-0 bg-transparent hover:bg-transparent text-xs text-neutral-400 hover:text-neutral-200 font-medium underline-offset-4 hover:underline transition-colors cursor-pointer shadow-none"
              >
                {tempT.settings.resetDefaults}
              </Button>
              <Button
                size="md"
                radius="lg"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 shadow-lg shadow-rose-900/40 cursor-pointer"
                onPress={handleSave}
              >
                {tempT.settings.save}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
