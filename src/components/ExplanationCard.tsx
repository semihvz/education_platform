import React, { useEffect } from 'react';
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
  Lightbulb
} from 'lucide-react';
import type { Question } from '../types/quiz';

interface ExplanationCardProps {
  question: Question;
  userAnswerId: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onNextQuestion: () => void;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  question,
  userAnswerId,
  isSaved,
  onToggleSave,
  onNextQuestion,
}) => {
  const isCorrect = userAnswerId === question.correctOptionId;

  useEffect(() => {
    if (isCorrect) {
      // Confetti burst for correct answer
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
      </div>

      {/* Explanation Details */}
      <div className="explanation-body">
        {/* Section 1: Why Correct */}
        <div className="explain-section section-correct">
          <div className="section-header">
            <Sparkles className="sec-icon icon-green" />
            <h4>1. Neden Doğru Cevap ({question.correctOptionId})?</h4>
          </div>
          <p className="sec-content">{question.explanation.whyCorrect}</p>
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
                  <span className="wrong-opt-text">{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Topic Summary & Key Takeaway */}
        <div className="explain-section section-summary">
          <div className="section-header">
            <BookOpen className="sec-icon icon-amber" />
            <h4>3. Konu Özeti & Ders Notu ({question.topic})</h4>
          </div>
          <p className="sec-content">{question.explanation.topicSummary}</p>
          
          {question.explanation.keyTakeaway && (
            <div className="takeaway-box">
              <Lightbulb className="takeaway-icon" />
              <div>
                <strong>Altın Kural / Özet:</strong>
                <p>{question.explanation.keyTakeaway}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Toolbar */}
      <div className="explanation-actions">
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
          <span>Yeni Soru Üret</span>
        </button>
      </div>
    </div>
  );
};
