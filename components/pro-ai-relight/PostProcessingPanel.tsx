import React from 'react';
import type { PostProcessingSettings, Translation } from './types';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange, min = -100, max = 100 }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <span className="text-xs font-mono bg-slate-700 px-2 py-0.5 rounded-md text-slate-300">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
    />
  </div>
);

interface PostProcessingPanelProps {
  settings: PostProcessingSettings;
  setSettings: React.Dispatch<React.SetStateAction<PostProcessingSettings>>;
  t: Translation['postProcessing'];
}

export const PostProcessingPanel: React.FC<PostProcessingPanelProps> = ({ settings, setSettings, t }) => {
  const updateSetting = <K extends keyof PostProcessingSettings>(key: K, value: PostProcessingSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setSettings({
      temperature: 0,
      exposure: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      saturation: 0,
    });
  };

  return (
    <div className="space-y-4 rounded-lg bg-slate-800/50 p-4 border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">{t.title}</h3>
      <div className="space-y-4">
        <Slider label={t.temperature} value={settings.temperature} onChange={(v) => updateSetting('temperature', v)} />
        <Slider label={t.exposure} value={settings.exposure} onChange={(v) => updateSetting('exposure', v)} />
        <Slider label={t.contrast} value={settings.contrast} onChange={(v) => updateSetting('contrast', v)} />
        <Slider label={t.highlights} value={settings.highlights} onChange={(v) => updateSetting('highlights', v)} />
        <Slider label={t.shadows} value={settings.shadows} onChange={(v) => updateSetting('shadows', v)} />
        <Slider label={t.saturation} value={settings.saturation} onChange={(v) => updateSetting('saturation', v)} />
      </div>
      <button
        onClick={resetAll}
        className="w-full mt-4 py-2 px-4 bg-slate-600 text-slate-200 font-semibold rounded-md hover:bg-slate-500 transition-colors"
      >
        {t.resetButton}
      </button>
    </div>
  );
};