import React from 'react';
import type { RelightSettings, Language, Translation } from './types';
import { PhotoUploader } from '../PhotoUploader';
import { LanguageIcon } from '../icons/LanguageIcon';
import { LIGHT_COLORS } from './constants';
import { ColorPicker } from './ColorPicker';

interface ControlPanelProps {
  settings: RelightSettings;
  setSettings: React.Dispatch<React.SetStateAction<RelightSettings>>;
  onImageUpload: (file: File) => void;
  onRelight: () => void;
  isRelighting: boolean;
  hasUploadedImage: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation['controls'];
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4 rounded-lg bg-white dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-700">
    <h3 className="font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
    {children}
  </div>
);

const ButtonGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-3 gap-2">{children}</div>
);

const Button: React.FC<{ onClick: () => void; isActive: boolean; disabled?: boolean; children: React.ReactNode }> = ({ onClick, isActive, children, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow'
        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  setSettings,
  onImageUpload,
  onRelight,
  isRelighting,
  hasUploadedImage,
  language,
  setLanguage,
  t,
}) => {
  const updateSetting = <K extends keyof RelightSettings>(key: K, value: RelightSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const isBacklightDisabled = settings.lightType !== 'one-light';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pro AI Relight</h1>
        <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            title={t.languageTooltip}
        >
            <LanguageIcon className="w-5 h-5"/>
            {language.toUpperCase()}
        </button>
      </div>

      <PhotoUploader onImageUpload={onImageUpload} previewUrl={null} />

      <Section title={t.backlightDirection.title}>
        <div className={isBacklightDisabled ? 'opacity-50' : ''}>
          <ButtonGroup>
            <Button onClick={() => updateSetting('backlightDirection', 'left')} isActive={settings.backlightDirection === 'left'} disabled={isBacklightDisabled}>{t.backlightDirection.left}</Button>
            <Button onClick={() => updateSetting('backlightDirection', 'middle')} isActive={settings.backlightDirection === 'middle'} disabled={isBacklightDisabled}>{t.backlightDirection.middle}</Button>
            <Button onClick={() => updateSetting('backlightDirection', 'right')} isActive={settings.backlightDirection === 'right'} disabled={isBacklightDisabled}>{t.backlightDirection.right}</Button>
          </ButtonGroup>
        </div>
      </Section>

      <Section title={t.lightType.title}>
        <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => updateSetting('lightType', 'natural')} isActive={settings.lightType === 'natural'}>{t.lightType.natural}</Button>
            <Button onClick={() => updateSetting('lightType', 'one-light')} isActive={settings.lightType === 'one-light'}>{t.lightType.oneLight}</Button>
            <Button onClick={() => updateSetting('lightType', 'two-lights')} isActive={settings.lightType === 'two-lights'}>{t.lightType.twoLights}</Button>
            <Button onClick={() => updateSetting('lightType', 'three-lights')} isActive={settings.lightType === 'three-lights'}>{t.lightType.threeLights}</Button>
        </div>
        
        {settings.lightType === 'one-light' && (
            <ColorPicker label={t.lightColor.light1} colors={LIGHT_COLORS} selectedColor={settings.lightColor1} onSelect={color => updateSetting('lightColor1', color)} />
        )}
        {settings.lightType === 'two-lights' && (
            <div className='space-y-2'>
                <ColorPicker label={t.lightColor.light1} colors={LIGHT_COLORS} selectedColor={settings.lightColor1} onSelect={color => updateSetting('lightColor1', color)} />
                <ColorPicker label={t.lightColor.light2} colors={LIGHT_COLORS} selectedColor={settings.lightColor2} onSelect={color => updateSetting('lightColor2', color)} />
            </div>
        )}
        {settings.lightType === 'three-lights' && (
            <div className='space-y-2'>
                <ColorPicker label={t.lightColor.light1} colors={LIGHT_COLORS} selectedColor={settings.lightColor1} onSelect={color => updateSetting('lightColor1', color)} />
                <ColorPicker label={t.lightColor.light2} colors={LIGHT_COLORS} selectedColor={settings.lightColor2} onSelect={color => updateSetting('lightColor2', color)} />
                <ColorPicker label={t.lightColor.light3} colors={LIGHT_COLORS} selectedColor={settings.lightColor3} onSelect={color => updateSetting('lightColor3', color)} />
            </div>
        )}

      </Section>

      <Section title={t.quality.title}>
        <ButtonGroup>
            <Button onClick={() => updateSetting('quality', 'standard')} isActive={settings.quality === 'standard'}>{t.quality.standard}</Button>
            <Button onClick={() => updateSetting('quality', '2k')} isActive={settings.quality === '2k'}>{t.quality.q2k}</Button>
            <Button onClick={() => updateSetting('quality', '4k')} isActive={settings.quality === '4k'}>{t.quality.q4k}</Button>
        </ButtonGroup>
      </Section>

      <Section title={t.customPrompt.title}>
        <textarea
          value={settings.customPrompt}
          onChange={(e) => updateSetting('customPrompt', e.target.value)}
          placeholder={t.customPrompt.placeholder}
          className="w-full h-20 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800 dark:text-slate-200"
        />
      </Section>

      <button
        onClick={onRelight}
        disabled={!hasUploadedImage || isRelighting}
        className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center text-base shadow-lg shadow-blue-500/30"
      >
        {isRelighting ? (
            <>
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-3"></div>
                {t.relightingButton}
            </>
        ) : t.relightButton}
      </button>
    </div>
  );
};
