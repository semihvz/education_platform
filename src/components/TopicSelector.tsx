import React, { useState } from 'react';
import { Sparkles, Compass, Zap, BookOpen } from 'lucide-react';
import type { Difficulty } from '../types/quiz';

interface TopicSelectorProps {
  onGenerate: (topic: string, difficulty: Difficulty) => void;
  isLoading: boolean;
}

const PRESET_TOPICS = [
  { name: 'Mathematics', icon: '📐', desc: 'Logarithms, Factorials & Algebra Questions' },
  { name: 'SQL Database', icon: '💾', desc: 'Advanced SQL, Window Functions & CTE (100 Challenging Questions)' },
  { name: 'English Grammar', icon: '🇬🇧', desc: 'Oxford Practice Grammar Master Test' },
  { name: 'Artificial Intelligence & LLM', icon: '🤖', desc: 'Deep Learning, Transformers & Neural Networks' },
  { name: 'Quantum Physics', icon: '⚛️', desc: 'Superposition, Entanglement & Atomic Models' },
  { name: 'Python & Algorithms', icon: '🐍', desc: 'Data Structures, Asyncio & Software Architecture' },
  { name: 'World History', icon: '🏛️', desc: 'Historic Milestones, Empires & Revolutions' },
  { name: 'Space & Astronomy', icon: '🚀', desc: 'Black Holes, Galaxies & Universe Physics' },
  { name: 'Philosophy & Logic', icon: '📜', desc: 'History of Thought, Ethics & Formal Logic' },
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
          <h2>Select Topic to Learn</h2>
        </div>
        <p className="selector-desc">
          AI generates custom 5-option practice questions with detailed step-by-step explanations on any subject.
        </p>
      </div>

      {/* Custom Topic Input */}
      <form onSubmit={handleSubmit} className="custom-topic-form">
        <div className="input-group">
          <BookOpen className="search-input-icon" />
          <input
            type="text"
            className="topic-input"
            placeholder="e.g. Quantum Computing, Roman Empire, JavaScript..."
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
              <span className="spinner-loader">AI Generating...</span>
            ) : (
              <>
                <Zap className="btn-icon" />
                <span>Generate Questions</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Difficulty Selector */}
      <div className="difficulty-section">
        <span className="diff-label">Difficulty Level:</span>
        <div className="diff-buttons">
          {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((level) => {
            const labels = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
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

      {/* Preset Topics & Combobox */}
      <div className="presets-section">
        <div className="presets-header">
          <Compass className="preset-icon" />
          <h3>Popular Learning Topics</h3>
        </div>

        {/* Ders Başlıkları Combobox */}
        <div className="bank-topic-combobox-wrapper" style={{ marginBottom: '1rem' }}>
          <label htmlFor="preset-topic-combobox" className="combobox-label">
            <Compass className="combobox-icon" />
            <span>Select Preset Topic:</span>
          </label>
          <select
            id="preset-topic-combobox"
            className="subject-combobox-select"
            onChange={(e) => {
              if (e.target.value) handleSelectPreset(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>-- Select a Topic --</option>
            {PRESET_TOPICS.map((item) => (
              <option key={item.name} value={item.name}>
                {item.icon} {item.name} ({item.desc})
              </option>
            ))}
          </select>
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
