import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import type { UserProfile } from '../types/quiz';
import { loginUserAccount, registerUserAccount, quickDemoLogin } from '../services/storageService';

interface AuthModalProps {
  onLoginSuccess: (user: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form State
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!emailInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    if (mode === 'signup' && !nameInput.trim()) {
      setErrorMsg('Lütfen ad ve soyadınızı girin.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const newUser = await registerUserAccount(nameInput, emailInput, passwordInput);
        onLoginSuccess(newUser);
      } else {
        const loggedInUser = await loginUserAccount(emailInput, passwordInput);
        onLoginSuccess(loggedInUser);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = quickDemoLogin();
    onLoginSuccess(demoUser);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <LogIn className="modal-icon text-indigo" />
            <div>
              <h2>{mode === 'login' ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}</h2>
              <p className="modal-subtitle">Optimizasyon AI Öğrenme Platformu</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-bar">
          <button
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMsg(null); }}
          >
            <LogIn className="tab-icon" />
            <span>Giriş Yap</span>
          </button>
          <button
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
          >
            <UserPlus className="tab-icon" />
            <span>Kayıt Ol</span>
          </button>
        </div>

        {/* Form Error Banner */}
        {errorMsg && (
          <div className="auth-error-banner">
            <AlertCircle className="icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-field-group">
              <label htmlFor="auth-name">Ad Soyad</label>
              <div className="input-with-icon">
                <User className="field-icon" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Ahmet Yılmaz"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field-group">
            <label htmlFor="auth-email">E-Posta Adresi</label>
            <div className="input-with-icon">
              <Mail className="field-icon" />
              <input
                id="auth-email"
                type="email"
                placeholder="ornek@domain.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label htmlFor="auth-password">Şifre</label>
            <div className="input-with-icon">
              <Lock className="field-icon" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner-loader">İşlem Yapılıyor...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="btn-icon" />
                <span>Giriş Yap</span>
              </>
            ) : (
              <>
                <UserPlus className="btn-icon" />
                <span>Hesabımı Oluştur</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>VEYA</span>
        </div>

        {/* Quick Demo Login Action */}
        <button type="button" className="demo-login-btn" onClick={handleDemoLogin}>
          <Zap className="btn-icon" />
          <span>⚡ Hızlı Demo Girişi Yap (Tek Tıkla Dene)</span>
        </button>
      </div>
    </div>
  );
};
