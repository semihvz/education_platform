import React from 'react';
import { Layers, Compass } from 'lucide-react';

interface FlashcardTopicSelectorProps {
  onSelectDeck: (topic: string) => void;
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
  onSelectDeck,
}) => {
  return (
    <div className="topic-selector-card">
      <div className="selector-header">
        <div className="selector-title-box">
          <Layers className="sparkle-icon icon-purple" />
          <h2>🎴 Bilgi & Çalışma Kartları (3D Flashcards)</h2>
        </div>
        <p className="selector-desc">
          Konu başlıklarına göre hazırlanmış özel özetli, pratik örnekli ve çevrilebilir 3D bilgi kartlarını inceleyin.
        </p>
      </div>

      {/* Preset Deck Selection Grid */}
      <div className="presets-section">
        <div className="presets-header">
          <Compass className="preset-icon" />
          <h3>Çalışma Kartı Konu Paketleri</h3>
        </div>
        <div className="presets-grid">
          {PRESET_FLASHCARD_TOPICS.map((item) => (
            <div
              key={item.name}
              className="preset-card"
              onClick={() => onSelectDeck(item.name)}
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
