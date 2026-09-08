import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  HelpCircle, 
  Bookmark, 
  BookmarkCheck, 
  RefreshCw, 
  Sparkles,
  Lightbulb,
  GraduationCap,
  X,
  FileText,
  AlertTriangle,
  Check,
  Clock
} from 'lucide-react';
import type { Question } from '../types/quiz';
import { FormattedMathText } from './FormattedMathText';

interface ExplanationCardProps {
  question: Question;
  userAnswerId: string;
  isSaved: boolean;
  solveTimeSeconds?: number;
  onToggleSave: () => void;
  onNextQuestion: () => void;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  question,
  userAnswerId,
  isSaved,
  solveTimeSeconds,
  onToggleSave,
  onNextQuestion,
}) => {
  const isCorrect = userAnswerId === question.correctOptionId;
  const [showFullLessonModal, setShowFullLessonModal] = useState<boolean>(false);

  useEffect(() => {
    if (isCorrect) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isCorrect]);

  return (
    <div className="explanation-card">
      {/* Result Status Banner */}
      <div className={`result-banner ${isCorrect ? 'banner-success' : 'banner-warning'}`}>
        <div className="banner-left">
          {isCorrect ? (
            <CheckCircle className="banner-icon icon-success" />
          ) : (
            <XCircle className="banner-icon icon-warning" />
          )}
          <div>
            <h3>{isCorrect ? 'Tebrikler! Doğru Yanıt' : 'Yanıtınız Hatalı — Öğrenme Fırsatı!'}</h3>
            <p>
              {isCorrect 
                ? `+15 XP kazandınız! ${question.correctOptionId} şıkkı tam olarak doğru cevaptır.` 
                : `Seçtiğiniz Şık: ${userAnswerId} | Doğru Şık: ${question.correctOptionId}`}
            </p>
          </div>
        </div>

        {solveTimeSeconds !== undefined && solveTimeSeconds > 0 && (
          <div className="solve-time-badge" title="Bu Sorunun Çözüm Süresi">
            <Clock className="time-icon" />
            <span>Çözüm Süresi: <strong>{solveTimeSeconds} sn</strong></span>
          </div>
        )}
      </div>

      {/* Explanation Details */}
      <div className="explanation-body">
        {/* Section 1: Why Correct */}
        <div className="explain-section section-correct">
          <div className="section-header">
            <Sparkles className="sec-icon icon-green" />
            <h4>1. Neden Doğru Cevap ({question.correctOptionId})?</h4>
          </div>
          <p className="sec-content">
            <FormattedMathText text={question.explanation.whyCorrect} />
          </p>
        </div>

        {/* Section 2: Why Others are Wrong */}
        {question.explanation.whyOthersIncorrect && Object.keys(question.explanation.whyOthersIncorrect).length > 0 && (
          <div className="explain-section section-others">
            <div className="section-header">
              <HelpCircle className="sec-icon icon-purple" />
              <h4>2. Diğer Seçenekler Neden Yanlış?</h4>
            </div>
            <div className="wrong-options-grid">
              {Object.entries(question.explanation.whyOthersIncorrect).map(([optId, text]) => (
                <div key={optId} className="wrong-opt-item">
                  <span className="wrong-opt-badge">Şık {optId}</span>
                  <span className="wrong-opt-text">
                    <FormattedMathText text={text} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Topic Summary Note */}
        <div className="explain-section section-summary">
          <div className="section-header">
            <BookOpen className="sec-icon icon-blue" />
            <h4>3. Özet Ders Notu ({question.topic})</h4>
          </div>
          <p className="sec-content">
            <FormattedMathText text={question.explanation.topicSummary} />
          </p>
        </div>

        {/* Section 4: Key Takeaway */}
        <div className="explain-section section-takeaway">
          <div className="section-header">
            <Lightbulb className="sec-icon icon-amber" />
            <h4>4. Akılda Kalması Gereken Altın Kural</h4>
          </div>
          <p className="sec-content takeaway-text">
            <FormattedMathText text={question.explanation.keyTakeaway || ""} />
          </p>
        </div>
      </div>

      {/* Bottom Action Toolbar */}
      <div className="explanation-actions">
        <button 
          className="lesson-explain-btn"
          onClick={() => setShowFullLessonModal(true)}
        >
          <GraduationCap className="btn-icon" />
          <span>📖 Konuyu Tam Olarak Anlat</span>
        </button>

        <button 
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={onToggleSave}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="btn-icon" />
              <span>Soru Kaydedildi</span>
            </>
          ) : (
            <>
              <Bookmark className="btn-icon" />
              <span>Soruyu Kaydet</span>
            </>
          )}
        </button>

        <button className="next-btn" onClick={onNextQuestion}>
          <RefreshCw className="btn-icon" />
          <span>Sonraki Soru</span>
        </button>
      </div>

      {/* FULL LESSON EXPLANATION MODAL */}
      {showFullLessonModal && (
        <div className="modal-overlay" onClick={() => setShowFullLessonModal(false)}>
          <div className="modal-content full-lesson-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <GraduationCap className="modal-icon text-indigo" />
                <div>
                  <h2>📖 Kapsamlı Konu Anlatım Rehberi</h2>
                  <p className="modal-subtitle">{question.topic} — İleri Seviye Ders Analizi</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowFullLessonModal(false)}>
                <X />
              </button>
            </div>

            <div className="modal-body full-lesson-body">
              {/* Section A: Core Theoretical Foundation */}
              <div className="lesson-block">
                <div className="lesson-block-title">
                  <FileText className="block-icon text-blue" />
                  <h3>1. Konunun Mantığı ve Teorik Altyapısı</h3>
                </div>
                <p className="lesson-text">
                  {question.explanation.topicSummary}
                </p>
                <div className="lesson-highlight-box">
                  <strong>🎯 Sorunun Doğru Çözüm Anahtarı ({question.correctOptionId}):</strong>
                  <p>{question.explanation.whyCorrect}</p>
                </div>
              </div>

              {/* Section B: Exam Tips & Pitfalls */}
              <div className="lesson-block">
                <div className="lesson-block-title">
                  <AlertTriangle className="block-icon text-amber" />
                  <h3>2. Sınavlarda En Çok Yapılan Hatalar ve Çeldiriciler</h3>
                </div>
                <div className="pitfalls-list">
                  {Object.entries(question.explanation.whyOthersIncorrect || {}).map(([optId, text]) => (
                    <div key={optId} className="pitfall-card">
                      <div className="pitfall-badge">Şık {optId} Çeldirici Tuzağı</div>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section C: Golden Rule / Takeaway */}
              <div className="lesson-block">
                <div className="lesson-block-title">
                  <Check className="block-icon text-green" />
                  <h3>3. Altın Kural ve Hafıza Notu</h3>
                </div>
                <div className="golden-takeaway-card">
                  <Lightbulb className="takeaway-big-icon" />
                  <div>
                    <h4>Unutmamanız Gereken Ana Kural:</h4>
                    <p>{question.explanation.keyTakeaway || "Bu konuda temel mantık adımlarını sırasıyla izleyin ve çeldirici ifadelerdeki istisnalara dikkat edin."}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="primary-modal-btn" onClick={() => setShowFullLessonModal(false)}>
                Anladım, Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
