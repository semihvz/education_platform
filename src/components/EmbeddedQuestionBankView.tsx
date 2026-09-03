import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Question } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { ExplanationCard } from './ExplanationCard';

interface EmbeddedQuestionBankViewProps {
  questions: Question[];
  onAnswerSubmit: (question: Question, optionId: string) => void;
  onSaveQuestion: (question: Question, userAnswerId: string) => void;
  isQuestionSaved: (questionId: string) => boolean;
}

export const EmbeddedQuestionBankView: React.FC<EmbeddedQuestionBankViewProps> = ({
  questions,
  onAnswerSubmit,
  onSaveQuestion,
  isQuestionSaved,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  if (!questions || questions.length === 0) {
    return (
      <div className="embedded-empty-box">
        <BookOpen className="icon" />
        <h3>Gömülü Soru Bulunamadı</h3>
        <p>Sistemde kayıtlı gömülü soru bulunmamaktadır.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = userAnswers[currentQ.id] || null;
  const isSaved = isQuestionSaved(currentQ.id);

  const handleSelectOption = (optionId: string) => {
    if (currentAnswer !== null) return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
    onAnswerSubmit(currentQ, optionId);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleJumpToIndex = (idx: number) => {
    setCurrentIndex(idx);
  };

  return (
    <div className="embedded-bank-container">
      {/* Top Bank Info Bar */}
      <div className="embedded-bank-header">
        <div className="bank-title-info">
          <BookOpen className="bank-icon" />
          <div>
            <h2>📚 Gömülü Soru Bankası (Oxford 100 Sınavı)</h2>
            <p className="bank-subtitle">
              Soru {currentIndex + 1} / {questions.length} • {currentQ.topic}
            </p>
          </div>
        </div>

        {/* Quick Navigator Pill */}
        <div className="bank-nav-controls">
          <button 
            className="nav-arrow-btn" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            title="Önceki Soru"
          >
            <ChevronLeft />
          </button>

          <select 
            className="question-jump-select"
            value={currentIndex}
            onChange={(e) => handleJumpToIndex(Number(e.target.value))}
          >
            {questions.map((q, idx) => {
              const isAns = userAnswers[q.id] !== undefined;
              return (
                <option key={q.id} value={idx}>
                  Soru {idx + 1} {isAns ? '✓' : ''}
                </option>
              );
            })}
          </select>

          <button 
            className="nav-arrow-btn" 
            onClick={handleNext} 
            disabled={currentIndex === questions.length - 1}
            title="Sonraki Soru"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Embedded Question Card */}
      <div className="embedded-quiz-body">
        <QuestionCard
          question={currentQ}
          onAnswerSubmit={handleSelectOption}
          answeredOptionId={currentAnswer}
        />

        {/* Explanation view if answered */}
        {currentAnswer !== null && (
          <ExplanationCard
            question={currentQ}
            userAnswerId={currentAnswer}
            isSaved={isSaved}
            onToggleSave={() => onSaveQuestion(currentQ, currentAnswer)}
            onNextQuestion={handleNext}
          />
        )}
      </div>
    </div>
  );
};
