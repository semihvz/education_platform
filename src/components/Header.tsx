import React from 'react';
import { Brain, Flame, Award, Bookmark, Settings, Moon, Sun, BarChart2, HelpCircle, Layers, BookOpen, LogIn, LogOut } from 'lucide-react';
import type { UserStats, AppSettings, UserProfile } from '../types/quiz';

interface HeaderProps {
  stats: UserStats;
  settings: AppSettings;
  currentUser: UserProfile | null;
  activeMode: 'ai-quiz' | 'embedded-bank' | 'flashcards';
  onSwitchMode: (mode: 'ai-quiz' | 'embedded-bank' | 'flashcards') => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenSettings: () => void;
  onOpenBookmarks: () => void;
  onOpenStats: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  settings,
  currentUser,
  activeMode,
  onSwitchMode,
  onUpdateSettings,
  onOpenSettings,
  onOpenBookmarks,
  onOpenStats,
  onOpenAuth,
  onLogout,
}) => {
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: nextTheme });
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="brand" onClick={() => onSwitchMode('ai-quiz')}>
          <div className="logo-icon">
            <Brain className="brain-svg" />
          </div>
          <div className="brand-text">
            <h1 className="title">MindPulse<span className="ai-badge">AI</span></h1>
            <p className="subtitle">Öğrenme & Soru Platformu</p>
          </div>
        </div>

        {/* 3 Mode Switcher Tabs */}
        <div className="mode-switcher-tabs">
          <button
            className={`mode-tab-btn ${activeMode === 'ai-quiz' ? 'active' : ''}`}
            onClick={() => onSwitchMode('ai-quiz')}
          >
            <HelpCircle className="tab-icon" />
            <span>🤖 AI ile Soru Üret</span>
          </button>
          <button
            className={`mode-tab-btn ${activeMode === 'embedded-bank' ? 'active' : ''}`}
            onClick={() => onSwitchMode('embedded-bank')}
          >
            <BookOpen className="tab-icon" />
            <span>📚 Gömülü Sorular (100 Oxford)</span>
          </button>
          <button
            className={`mode-tab-btn ${activeMode === 'flashcards' ? 'active' : ''}`}
            onClick={() => onSwitchMode('flashcards')}
          >
            <Layers className="tab-icon" />
            <span>🎴 Bilgi Kartları</span>
          </button>
        </div>

        {/* Stats & Actions Bar */}
        <div className="header-actions">
          {/* Streak Counter */}
          <div className="stat-pill streak-pill" title="Günlük Öğrenme Serisi">
            <Flame className="icon flame-icon" />
            <span className="stat-val">{stats.streakDays} Gün</span>
          </div>

          {/* XP Counter */}
          <div className="stat-pill xp-pill" title="Toplam XP Puanı">
            <Award className="icon xp-icon" />
            <span className="stat-val">{stats.xp} XP</span>
          </div>

          {/* Stats Button */}
          <button 
            className="action-btn"
            onClick={onOpenStats}
            title="İstatistikler ve Konu Başarısı"
          >
            <BarChart2 className="icon" />
          </button>

          {/* Saved Questions Button */}
          <button 
            className="action-btn"
            onClick={onOpenBookmarks}
            title="Kaydedilen Soru ve Kartlarım"
          >
            <Bookmark className="icon" />
          </button>

          {/* Theme Toggle */}
          <button 
            className="action-btn"
            onClick={toggleTheme}
            title="Koyu / Açık Tema"
          >
            {settings.theme === 'dark' ? <Sun className="icon sun-icon" /> : <Moon className="icon" />}
          </button>

          {/* Settings Gear */}
          <button 
            className="action-btn"
            onClick={onOpenSettings}
            title="Ayarlar & Gemini API Key"
          >
            <Settings className="icon" />
          </button>

          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div className="user-profile-badge" title={`Giriş Yapıldı: ${currentUser.email}`}>
              <span className="user-avatar">{currentUser.avatar || '🎓'}</span>
              <span className="user-name">{currentUser.name}</span>
              <button className="user-logout-btn" onClick={onLogout} title="Çıkış Yap">
                <LogOut className="icon-sm" />
              </button>
            </div>
          ) : (
            <button className="auth-login-btn" onClick={onOpenAuth} title="Giriş Yap / Kayıt Ol">
              <LogIn className="btn-icon" />
              <span>Giriş Yap</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
