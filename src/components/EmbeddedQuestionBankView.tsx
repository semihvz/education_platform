import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Database, Globe, Calculator, GraduationCap } from 'lucide-react';
import type { Question } from '../types/quiz';
import { shuffleQuestionOptions } from '../services/aiService';
import { QuestionCard } from './QuestionCard';
import { ExplanationCard } from './ExplanationCard';

interface EmbeddedQuestionBankViewProps {
  questions: Question[];
  onAnswerSubmit: (question: Question, optionId: string, solveTimeSeconds: number) => void;
  onSaveQuestion: (question: Question, userAnswerId: string) => void;
  isQuestionSaved: (questionId: string) => boolean;
}

export const EmbeddedQuestionBankView: React.FC<EmbeddedQuestionBankViewProps> = ({
  questions,
  onAnswerSubmit,
  onSaveQuestion,
  isQuestionSaved,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [userAnswerTimes, setUserAnswerTimes] = useState<Record<string, number>>({});

  // Dynamically extract unique topics and counts
  const availableTopics = useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach(q => {
      counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return Object.entries(counts).map(([topic, count]) => ({ topic, count }));
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (!selectedTopic || selectedTopic === 'ALL') return questions;
    return questions.filter(q => q.topic.toLowerCase() === selectedTopic.toLowerCase());
  }, [questions, selectedTopic]);

  const handleTopicChange = (topicKey: string) => {
    setSelectedTopic(topicKey);
    setCurrentIndex(0);
  };

  const rawQ = filteredQuestions[currentIndex];
  
  // Dynamically shuffle options randomly on every view/render
  const currentQ = useMemo(() => {
    if (!rawQ) return null;
    return shuffleQuestionOptions(rawQ);
  }, [rawQ?.id, currentIndex, selectedTopic]);

  if (!questions || questions.length === 0 || !currentQ) {
    return (
      <div className="embedded-empty-box">
        <BookOpen className="icon" />
        <h3>Gömülü Soru Bulunamadı</h3>
        <p>Sistemde kayıtlı gömülü soru bulunmamaktadır.</p>
      </div>
    );
  }

  const currentAnswer = userAnswers[currentQ.id] || null;
  const currentSolveTime = userAnswerTimes[currentQ.id] || 0;
  const isSaved = isQuestionSaved(currentQ.id);

  const handleSelectOption = (optionId: string, solveTimeSeconds: number) => {
    if (currentAnswer !== null) return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
    setUserAnswerTimes(prev => ({ ...prev, [currentQ.id]: solveTimeSeconds }));
    onAnswerSubmit(currentQ, optionId, solveTimeSeconds);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleJumpToIndex = (idx: number) => {
    setCurrentIndex(idx);
  };

  const getTopicIcon = (tName: string) => {
    if (tName.includes('Matematik')) return <Calculator className="tab-icon" />;
    if (tName.includes('SQL')) return <Database className="tab-icon" />;
    if (tName.includes('Grammar') || tName.includes('İngilizce')) return <Globe className="tab-icon" />;
    return <GraduationCap className="tab-icon" />;
  };

  return (
    <div className="embedded-bank-container">
      {/* Category Filter Pills */}
      <div className="bank-topic-filter-tabs">
        <button
          className={`filter-tab-btn ${selectedTopic === 'ALL' ? 'active' : ''}`}
          onClick={() => handleTopicChange('ALL')}
        >
          <BookOpen className="tab-icon" />
          <span>Tüm Sorular ({questions.length})</span>
        </button>

        {availableTopics.map(({ topic, count }) => (
          <button
            key={topic}
            className={`filter-tab-btn ${selectedTopic === topic ? 'active' : ''}`}
            onClick={() => handleTopicChange(topic)}
          >
            {getTopicIcon(topic)}
            <span>{topic} ({count})</span>
          </button>
        ))}
      </div>

      {/* Top Bank Info Bar */}
      <div className="embedded-bank-header">
        <div className="bank-title-info">
          <BookOpen className="bank-icon" />
          <div>
            <h2>📚 Gömülü Soru Bankası</h2>
            <p className="bank-subtitle">
              Soru {currentIndex + 1} / {filteredQuestions.length} • {currentQ.topic}
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
            {filteredQuestions.map((q, idx) => {
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
            disabled={currentIndex === filteredQuestions.length - 1}
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
            solveTimeSeconds={currentSolveTime}
            onToggleSave={() => onSaveQuestion(currentQ, currentAnswer)}
            onNextQuestion={handleNext}
          />
        )}
      </div>
    </div>
  );
};
