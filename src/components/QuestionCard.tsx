import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import type { Question } from '../types/quiz';
import { FormattedMathText } from './FormattedMathText';

interface QuestionCardProps {
  question: Question;
  onAnswerSubmit: (selectedOptionId: string) => void;
  answeredOptionId: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerSubmit,
  answeredOptionId,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(answeredOptionId);

  const handleOptionClick = (id: string) => {
    if (answeredOptionId !== null) return; // Prevent changing after submission
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (!selectedId || answeredOptionId !== null) return;
    onAnswerSubmit(selectedId);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'beginner': return { label: 'Başlangıç', class: 'diff-beginner' };
      case 'intermediate': return { label: 'Orta Seviye', class: 'diff-intermediate' };
      case 'advanced': return { label: 'İleri Seviye', class: 'diff-advanced' };
      default: return { label: diff, class: '' };
    }
  };

  const diffInfo = getDifficultyBadge(question.difficulty);

  return (
    <div className="question-card">
      {/* Top Meta info */}
      <div className="question-meta">
        <span className="topic-badge">
          <Layers className="icon" />
          {question.topic}
        </span>
        <span className={`diff-badge ${diffInfo.class}`}>
          {diffInfo.label}
        </span>
        <span className="choice-count-badge">5 Şıklı Soru</span>
      </div>

      {/* Question Prompt */}
      <div className="question-prompt">
        <HelpCircle className="prompt-icon" />
        <h2 className="prompt-text">
          <FormattedMathText text={question.questionText} />
        </h2>
      </div>

      {/* Visual SVG Diagram (if available) */}
      {question.svgDiagram && (
        <div className="visual-diagram-box">
          <div 
            className="svg-diagram-container"
            dangerouslySetInnerHTML={{ __html: question.svgDiagram }}
          />
        </div>
      )}

      {/* 5 Choices Grid */}
      <div className="options-list">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isSubmitted = answeredOptionId !== null;
          const isCorrect = option.id === question.correctOptionId;
          const isUserChoice = answeredOptionId === option.id;

          let optionStateClass = '';
          if (isSubmitted) {
            if (isCorrect) {
              optionStateClass = 'option-correct';
            } else if (isUserChoice && !isCorrect) {
              optionStateClass = 'option-wrong';
            } else {
              optionStateClass = 'option-dimmed';
            }
          } else if (isSelected) {
            optionStateClass = 'option-selected';
          }

          return (
            <div
              key={option.id}
              className={`option-card ${optionStateClass}`}
              onClick={() => handleOptionClick(option.id)}
            >
              <div className="option-badge">{option.id}</div>
              <div className="option-text">
                <FormattedMathText text={option.text} />
              </div>
              <div className="option-status-icon">
                {isSubmitted && isCorrect && <CheckCircle2 className="correct-icon" />}
                {isSubmitted && isUserChoice && !isCorrect && <span className="wrong-x">✕</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {answeredOptionId === null && (
        <div className="submit-box">
          <button
            className="submit-btn"
            disabled={!selectedId}
            onClick={handleSubmit}
          >
            <span>Cevabı Gönder ve Anlatımı Oku</span>
            <ArrowRight className="btn-icon" />
          </button>
        </div>
      )}
    </div>
  );
};
