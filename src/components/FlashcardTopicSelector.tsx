import React, { useState } from 'react';
import { Layers, Zap, Compass, Sparkles } from 'lucide-react';

interface FlashcardTopicSelectorProps {
  onGenerateDeck: (topic: string) => void;
  isLoading: boolean;
}

const PRESET_FLASHCARD_TOPICS = [
  { name: 'TYT Matematik Formülleri', icon: '📐', desc: 'Fonksiyonlar, Mutlak Değer, Permütasyon' },
  { name: 'İngilizce Grammar Rules', icon: '🇬🇧', desc: 'Inversion, Subjunctive & Conditionals' },
  { name: 'Kuantum Fiziği & Atom', icon: '⚛️', desc: 'Süperpozisyon, Dolanıklık, Foton' },
  { name: 'Yapay Zeka & LLM', icon: '🤖', desc: 'Transformer, Attention, Embeddings' },
  { name: 'Python & Veri Yapıları', icon: '🐍', desc: 'Asyncio, Decorators, Generative' },
  { name: 'Osmanlı & Dünya Tarihi', icon: '🏛️', desc: 'Tarihi Olaylar & Dönüm Noktaları' },
];

export const FlashcardTopicSelector: React.FC<FlashcardTopicSelectorProps> = ({
  onGenerateDeck,
  isLoading,
}) => {
  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    onGenerateDeck(topicInput.trim());
  };

  const handleSelectPreset = (name: string) => {
    setTopicInput(name);
    onGenerateDeck(name);
  };

  return (
    <div className="topic-selector-card">
      <div className="selector-header">
        <div className="selector-title-box">
          <Layers className="sparkle-icon icon-purple" />
          <h2>AI Çalışma Kartları (Flashcards)</h2>
        </div>
        <p className="selector-desc">
          İstediğin konuda görseller, pratik örnekler ve özet bilgi içeren çevrilebilir 3D çalışma kartları üret.
        </p>
      </div>

      {/* Custom Input */}
      <form onSubmit={handleSubmit} className="custom-topic-form">
        <div className="input-group">
          <Sparkles className="search-input-icon" />
          <input
            type="text"
            className="topic-input"
            placeholder="Örn: Docker & Kubernetes, Dünya Haritası, Kuantum Bilgisayarlar..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="generate-btn"
            disabled={isLoading || !topicInput.trim()}
          >
            {isLoading ? (
              <span className="spinner-loader">Kartlar Hazırlanıyor...</span>
            ) : (
              <>
                <Zap className="btn-icon" />
                <span>Kartları Üret</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Topics */}
      <div className="presets-section">
        <div className="presets-header">
          <Compass className="preset-icon" />
          <h3>Popüler Bilgi Kartı Konuları</h3>
        </div>
        <div className="presets-grid">
          {PRESET_FLASHCARD_TOPICS.map((item) => (
            <div
              key={item.name}
              className="preset-card"
              onClick={() => handleSelectPreset(item.name)}
            >
              <span className="preset-emoji">{item.icon}</span>
              <div className="preset-info">
                <span className="preset-name">{item.name}</span>
                <span className="preset-desc">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
