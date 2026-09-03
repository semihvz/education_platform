import React, { useState } from 'react';
import { X, Key, Cpu, Volume2, ExternalLink, Save, Check } from 'lucide-react';
import type { AppSettings } from '../types/quiz';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [selectedModel, setSelectedModel] = useState(settings.selectedModel);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      apiKey: apiKey.trim(),
      selectedModel,
      soundEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Key className="icon icon-purple" />
            <h3>Uygulama & AI Ayarları</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        <form onSubmit={handleSave} className="settings-form">
          {/* Gemini API Key */}
          <div className="form-group">
            <label className="form-label">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="api-link"
              >
                Ücretsiz Key Al <ExternalLink className="link-icon" />
              </a>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="AI Key yapıştırın (Boş kalırsa akıllı simülatör çalışır)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="form-help">
              API anahtarınız tarayıcınızda güvenli bir şekilde saklanır. Girilmezse dahili akıllı AI simülatörü devreye girer.
            </p>
          </div>

          {/* Model Selection */}
          <div className="form-group">
            <label className="form-label">
              <Cpu className="icon-sm" />
              <span>Gemini Model Seçimi</span>
            </label>
            <select
              className="form-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (En Hızlı & Öğretici - Tavsiye Edilen)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standart Hızlı)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Karmaşık & Derin Sorular)</option>
            </select>
          </div>

          {/* Audio Settings */}
          <div className="form-group">
            <label className="form-label">
              <Volume2 className="icon-sm" />
              <span>Ses Efektleri (Doğru / Yanlış Sesleri)</span>
            </label>
            <button
              type="button"
              className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? 'Açık' : 'Kapalı'}
            </button>
          </div>

          {/* Save Button */}
          <div className="modal-actions">
            <button type="submit" className="save-settings-btn">
              {savedSuccess ? (
                <>
                  <Check className="btn-icon" />
                  <span>Kaydedildi!</span>
                </>
              ) : (
                <>
                  <Save className="btn-icon" />
                  <span>Ayarları Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
