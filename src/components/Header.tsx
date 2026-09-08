import React from 'react';
import { Brain, Flame, Award, Bookmark, Settings, Moon, Sun, BarChart2, Layers, BookOpen, LogIn, LogOut, BookOpenCheck } from 'lucide-react';
import type { UserStats, AppSettings, UserProfile } from '../types/quiz';

interface HeaderProps {
  stats: UserStats;
  settings: AppSettings;
  currentUser: UserProfile | null;
  activeMode: 'embedded-bank' | 'flashcards' | 'journal';
  onSwitchMode: (mode: 'embedded-bank' | 'flashcards' | 'journal') => void;
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
    <>
      <header className="app-header">
        <div className="header-container">
          {/* Brand Logo */}
          <div className="brand" onClick={() => onSwitchMode('embedded-bank')}>
            <div className="logo-icon">
              <Brain className="brain-svg" />
            </div>
            <div className="brand-text">
              <h1 className="title">Optimizasyon<span className="ai-badge">AI</span></h1>
              <p className="subtitle">Öğrenme & Soru Platformu</p>
            </div>
          </div>

          {/* Mode Switcher Tabs (Desktop) */}
          <div className="mode-switcher-tabs desktop-only">
            <button
              className={`mode-tab-btn ${activeMode === 'embedded-bank' ? 'active' : ''}`}
              onClick={() => onSwitchMode('embedded-bank')}
            >
              <BookOpen className="tab-icon" />
              <span>📚 Soru Bankası</span>
            </button>
            <button
              className={`mode-tab-btn ${activeMode === 'flashcards' ? 'active' : ''}`}
              onClick={() => onSwitchMode('flashcards')}
            >
              <Layers className="tab-icon" />
              <span>🎴 Bilgi Kartları</span>
            </button>
            <button
              className={`mode-tab-btn ${activeMode === 'journal' ? 'active' : ''}`}
              onClick={() => onSwitchMode('journal')}
            >
              <BookOpenCheck className="tab-icon" />
              <span>📖 Günlük</span>
            </button>
          </div>

          {/* Stats & Actions Bar */}
          <div className="header-actions">
            {/* Streak Counter */}
            <div className="stat-pill streak-pill" title="Günlük Öğrenme Serisi">
              <Flame className="icon flame-icon" />
              <span className="stat-val">{stats.streakDays} G</span>
            </div>

            {/* XP Counter */}
            <div className="stat-pill xp-pill" title="Toplam XP Puanı">
              <Award className="icon xp-icon" />
              <span className="stat-val">{stats.xp} XP</span>
            </div>

            {/* Stats Button (Desktop) */}
            <button 
              className="action-btn desktop-only"
              onClick={onOpenStats}
              title="İstatistikler ve Konu Başarısı"
            >
              <BarChart2 className="icon" />
            </button>

            {/* Saved Questions Button (Desktop) */}
            <button 
              className="action-btn desktop-only"
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

            {/* Settings Gear (Desktop) */}
            <button 
              className="action-btn desktop-only"
              onClick={onOpenSettings}
              title="Ayarlar"
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
                <span className="login-text">Giriş Yap</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button
          className={`bottom-nav-item ${activeMode === 'embedded-bank' ? 'active' : ''}`}
          onClick={() => onSwitchMode('embedded-bank')}
        >
          <BookOpen className="nav-icon" />
          <span>Sorular</span>
        </button>
        <button
          className={`bottom-nav-item ${activeMode === 'flashcards' ? 'active' : ''}`}
          onClick={() => onSwitchMode('flashcards')}
        >
          <Layers className="nav-icon" />
          <span>Kartlar</span>
        </button>
        <button
          className={`bottom-nav-item ${activeMode === 'journal' ? 'active' : ''}`}
          onClick={() => onSwitchMode('journal')}
        >
          <BookOpenCheck className="nav-icon" />
          <span>Günlük</span>
        </button>
        <button className="bottom-nav-item" onClick={onOpenBookmarks}>
          <Bookmark className="nav-icon" />
          <span>Kaydedilen</span>
        </button>
        <button className="bottom-nav-item" onClick={onOpenStats}>
          <BarChart2 className="nav-icon" />
          <span>İstatistik</span>
        </button>
      </nav>
    </>
  );
};

