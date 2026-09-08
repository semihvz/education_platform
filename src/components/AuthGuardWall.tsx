import React from 'react';
import { Lock, LogIn, Zap, ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';
import { quickDemoLogin } from '../services/storageService';
import type { UserProfile } from '../types/quiz';

interface AuthGuardWallProps {
  onOpenAuth: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthGuardWall: React.FC<AuthGuardWallProps> = ({ onOpenAuth, onLoginSuccess }) => {
  const handleDemoLogin = () => {
    const user = quickDemoLogin();
    onLoginSuccess(user);
  };

  return (
    <div className="auth-guard-wall">
      <div className="guard-card">
        {/* Lock Shield Icon */}
        <div className="guard-icon-box">
          <Lock className="guard-lock-icon" />
        </div>

        <h2>🔒 İçeriğe Erişim İçin Giriş Yapın</h2>
        <p className="guard-desc">
          OPTIMIZATION LIFE platformunda yer alan <strong>260+ Gömülü Soru Bankası</strong> (Matematik, Oxford İngilizce & İleri Seviye SQL), 3D Bilgi Kartları ve Çalışma Günlüğüne erişmek için oturum açmanız gerekmektedir.
        </p>

        {/* Feature Highlights Grid */}
        <div className="guard-features-grid">
          <div className="guard-feature-item">
            <BookOpen className="feat-icon text-indigo" />
            <div>
              <strong>260+ Gömülü Soru</strong>
              <span>Matematik, Oxford & SQL Testleri</span>
            </div>
          </div>
          <div className="guard-feature-item">
            <Sparkles className="feat-icon text-purple" />
            <div>
              <strong>KaTeX & Formüller</strong>
              <span>Gelişmiş matematiksel denklem desteği</span>
            </div>
          </div>
          <div className="guard-feature-item">
            <Layers className="feat-icon text-amber" />
            <div>
              <strong>3D Bilgi Kartları</strong>
              <span>Görsel formüller ve hızlı tekrar</span>
            </div>
          </div>
          <div className="guard-feature-item">
            <ShieldCheck className="feat-icon text-green" />
            <div>
              <strong>Kişisel İlerleme</strong>
              <span>XP puanları, seriler ve kaydedilenler</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="guard-actions">
          <button className="guard-primary-btn" onClick={onOpenAuth}>
            <LogIn className="btn-icon" />
            <span>Giriş Yap / Kayıt Ol</span>
          </button>

          <button className="guard-demo-btn" onClick={handleDemoLogin}>
            <Zap className="btn-icon" />
            <span>⚡ Hızlı Demo Girişi (Saniyeler İçinde Dene)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
