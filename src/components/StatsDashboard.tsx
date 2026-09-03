import React from 'react';
import { X, Award, Flame, CheckCircle, Target, BookOpen, BarChart2 } from 'lucide-react';
import type { UserStats } from '../types/quiz';

interface StatsDashboardProps {
  stats: UserStats;
  onClose: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, onClose }) => {
  const accuracyPercentage = stats.totalAnswered > 0
    ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100)
    : 0;

  // Level calculation: Every 100 XP is 1 level
  const userLevel = Math.floor(stats.xp / 100) + 1;
  const currentLevelXp = stats.xp % 100;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <BarChart2 className="icon icon-green" />
            <h3>Öğrenme Analitiği & Başarı Karnesi</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        {/* Level & XP Banner */}
        <div className="level-banner">
          <div className="level-badge">
            <Award className="level-icon" />
            <div>
              <span className="level-title">Seviye {userLevel} Öğrenci</span>
              <span className="level-subtitle">Toplam {stats.xp} XP Kazanıldı</span>
            </div>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${currentLevelXp}%` }}></div>
            <span className="xp-bar-text">{currentLevelXp} / 100 XP (Sonraki Seviye)</span>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <Flame className="stat-icon icon-flame" />
            <div className="stat-info">
              <span className="stat-number">{stats.streakDays} Gün</span>
              <span className="stat-label">Öğrenme Serisi</span>
            </div>
          </div>

          <div className="stat-card">
            <CheckCircle className="stat-icon icon-green" />
            <div className="stat-info">
              <span className="stat-number">{stats.correctAnswers} / {stats.totalAnswered}</span>
              <span className="stat-label">Doğru Soru Sayısı</span>
            </div>
          </div>

          <div className="stat-card">
            <Target className="stat-icon icon-purple" />
            <div className="stat-info">
              <span className="stat-number">%{accuracyPercentage}</span>
              <span className="stat-label">Doğruluk Oranı</span>
            </div>
          </div>
        </div>

        {/* Topic Mastery Section */}
        <div className="topic-mastery-section">
          <div className="section-title">
            <BookOpen className="sec-icon" />
            <h4>Konu Bazlı Başarı Oranları</h4>
          </div>

          {Object.keys(stats.topicMastery).length === 0 ? (
            <div className="empty-mastery">
              <p>Henüz çözülmüş soru kaydı yok. Soru çözdükçe konu başarı analiziniz burada görünecektir.</p>
            </div>
          ) : (
            <div className="mastery-list">
              {Object.entries(stats.topicMastery).map(([topic, data]) => {
                const perc = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={topic} className="mastery-item">
                    <div className="mastery-info">
                      <span className="mastery-topic-name">{topic}</span>
                      <span className="mastery-stats-text">
                        {data.correct}/{data.total} Soru Doğru (%{perc})
                      </span>
                    </div>
                    <div className="mastery-progress-bg">
                      <div
                        className={`mastery-progress-fill ${perc >= 70 ? 'fill-high' : perc >= 40 ? 'fill-mid' : 'fill-low'}`}
                        style={{ width: `${perc}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
