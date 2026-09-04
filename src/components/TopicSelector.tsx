import React, { useState } from 'react';
import { Sparkles, Compass, Zap, BookOpen } from 'lucide-react';
import type { Difficulty } from '../types/quiz';

interface TopicSelectorProps {
  onGenerate: (topic: string, difficulty: Difficulty) => void;
  isLoading: boolean;
}

const PRESET_TOPICS = [
  { name: 'SQL Database', icon: '💾', desc: 'İleri Seviye SQL, Window Functions & CTE (100 Zor Soru)' },
  { name: 'İngilizce Grammar', icon: '🇬🇧', desc: 'Oxford Practice Grammar 100 Soru Bitirme Sınavı' },
  { name: 'Yapay Zeka & LLM', icon: '🤖', desc: 'Derin öğrenme, Transformer & AI' },
  { name: 'Kuantum Fiziği', icon: '⚛️', desc: 'Süperpozisyon, Dolanıklık & Atom' },
  { name: 'Python & Algoritmalar', icon: '🐍', desc: 'Kodlama, Veri yapıları & Yazılım' },
  { name: 'Osmanlı & Dünya Tarihi', icon: '🏛️', desc: 'Tarihi zaferler & Dönüm noktaları' },
  { name: 'Uzay & Astronomi', icon: '🚀', desc: 'Karadelikler, Galaksiler & Evren' },
  { name: 'Felsefe & Mantık', icon: '📜', desc: 'Düşünce tarihi, Etik & Mantık' },
];

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onGenerate, isLoading }) => {
  const [topicInput, setTopicInput] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('intermediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    onGenerate(topicInput.trim(), selectedDifficulty);
  };

  const handleSelectPreset = (name: string) => {
    setTopicInput(name);
    onGenerate(name, selectedDifficulty);
  };

  return (
    <div className="topic-selector-card">
      <div className="selector-header">
        <div className="selector-title-box">
          <Sparkles className="sparkle-icon" />
          <h2>Öğrenmek İstediğin Konuyu Seç</h2>
        </div>
        <p className="selector-desc">
          Yapay zeka istediğin her konuda sana özel 5 şıklı öğretici sorular hazırlar ve detaylıca anlatır.
        </p>
      </div>

      {/* Custom Topic Input */}
      <form onSubmit={handleSubmit} className="custom-topic-form">
        <div className="input-group">
          <BookOpen className="search-input-icon" />
          <input
            type="text"
            className="topic-input"
            placeholder="Örn: Kuantum Bilgisayarlar, Roma İmparatorluğu, JavaScript..."
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
              <span className="spinner-loader">AI Hazırlıyor...</span>
            ) : (
              <>
                <Zap className="btn-icon" />
                <span>Soru Üret</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Difficulty Selector */}
      <div className="difficulty-section">
        <span className="diff-label">Zorluk Seviyesi:</span>
        <div className="diff-buttons">
          {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((level) => {
            const labels = { beginner: 'Başlangıç', intermediate: 'Orta', advanced: 'İleri Seviye' };
            return (
              <button
                key={level}
                type="button"
                className={`diff-btn ${selectedDifficulty === level ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(level)}
                disabled={isLoading}
              >
                {labels[level]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Topics Grid */}
      <div className="presets-section">
        <div className="presets-header">
          <Compass className="preset-icon" />
          <h3>Popüler Öğrenme Konuları</h3>
        </div>
        <div className="presets-grid">
          {PRESET_TOPICS.map((item) => (
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
