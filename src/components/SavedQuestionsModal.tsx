import React, { useState } from 'react';
import { X, Bookmark, Trash2, ArrowRight, BookOpen, Layers, HelpCircle, Sparkles } from 'lucide-react';
import type { SavedQuestionItem, SavedFlashcardItem } from '../types/quiz';

interface SavedQuestionsModalProps {
  questionItems: SavedQuestionItem[];
  flashcardItems: SavedFlashcardItem[];
  onRemoveQuestionItem: (item: SavedQuestionItem) => void;
  onRemoveFlashcardItem: (card: SavedFlashcardItem) => void;
  onSelectQuestionForReview: (item: SavedQuestionItem) => void;
  onClose: () => void;
}

export const SavedQuestionsModal: React.FC<SavedQuestionsModalProps> = ({
  questionItems,
  flashcardItems,
  onRemoveQuestionItem,
  onRemoveFlashcardItem,
  onSelectQuestionForReview,
  onClose,
}) => {
  const [tab, setTab] = useState<'questions' | 'flashcards'>('questions');
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  const filteredQuestions = questionItems.filter(item => {
    if (filter === 'correct') return item.wasCorrect;
    if (filter === 'wrong') return !item.wasCorrect;
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Bookmark className="icon icon-amber" />
            <h3>Kaydedilen İçeriklerim & DB Kütüphanesi</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        {/* Tab Switcher: Questions vs Flashcards */}
        <div className="saved-main-tabs">
          <button
            className={`saved-tab-btn ${tab === 'questions' ? 'active' : ''}`}
            onClick={() => setTab('questions')}
          >
            <HelpCircle className="tab-icon-sm" />
            <span>Kaydedilen Sorular ({questionItems.length})</span>
          </button>
          <button
            className={`saved-tab-btn ${tab === 'flashcards' ? 'active' : ''}`}
            onClick={() => setTab('flashcards')}
          >
            <Layers className="tab-icon-sm" />
            <span>Kaydedilen Kartlar ({flashcardItems.length})</span>
          </button>
        </div>

        {/* QUESTIONS TAB */}
        {tab === 'questions' && (
          <>
            <div className="saved-filter-bar">
              <button
                className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Tümü ({questionItems.length})
              </button>
              <button
                className={`filter-pill ${filter === 'wrong' ? 'active' : ''}`}
                onClick={() => setFilter('wrong')}
              >
                Yanlış Yanıtladıklarım ({questionItems.filter(i => !i.wasCorrect).length})
              </button>
              <button
                className={`filter-pill ${filter === 'correct' ? 'active' : ''}`}
                onClick={() => setFilter('correct')}
              >
                Doğru Yanıtladıklarım ({questionItems.filter(i => i.wasCorrect).length})
              </button>
            </div>

            <div className="saved-list">
              {filteredQuestions.length === 0 ? (
                <div className="empty-saved-state">
                  <BookOpen className="empty-icon" />
                  <p>Henüz kaydedilmiş soru bulunmuyor.</p>
                </div>
              ) : (
                filteredQuestions.map((item) => (
                  <div key={item.question.id} className="saved-card">
                    <div className="saved-card-header">
                      <span className="topic-badge-sm">
                        <Layers className="icon-xs" />
                        {item.question.topic}
                      </span>
                      <span className={`status-badge-sm ${item.wasCorrect ? 'status-correct' : 'status-wrong'}`}>
                        {item.wasCorrect ? 'Doğru Yanıtlandı' : 'Yanlış Yanıtlandı'}
                      </span>
                    </div>

                    <p className="saved-question-text">{item.question.questionText}</p>

                    <div className="saved-card-footer">
                      <span className="saved-date">
                        {new Date(item.savedAt).toLocaleDateString('tr-TR')}
                      </span>
                      <div className="saved-actions">
                        <button
                          className="remove-btn"
                          onClick={() => onRemoveQuestionItem(item)}
                          title="Sil"
                        >
                          <Trash2 className="icon-xs" />
                          <span>Sil</span>
                        </button>
                        <button
                          className="review-btn"
                          onClick={() => {
                            onSelectQuestionForReview(item);
                            onClose();
                          }}
                        >
                          <span>İncele & Tekrar Çöz</span>
                          <ArrowRight className="icon-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* FLASHCARDS TAB */}
        {tab === 'flashcards' && (
          <div className="saved-list">
            {flashcardItems.length === 0 ? (
              <div className="empty-saved-state">
                <Sparkles className="empty-icon" />
                <p>Henüz kaydedilmiş çalışma kartı (Flashcard) bulunmuyor.</p>
                <span>Bilgi kartı modunda "DB'ye Kaydet" butonuna basarak kartlarınızı buraya ekleyebilirsiniz.</span>
              </div>
            ) : (
              flashcardItems.map((item) => (
                <div key={item.card.id} className="saved-card">
                  <div className="saved-card-header">
                    <span className="topic-badge-sm">
                      <Layers className="icon-xs" />
                      {item.card.topic}
                    </span>
                    <span className="category-pill">{item.card.frontCategory}</span>
                  </div>

                  <h4 className="saved-card-title">{item.card.frontTitle}</h4>
                  <p className="saved-card-desc">{item.card.backExplanation}</p>
                  {item.card.backKeyPoint && (
                    <div className="saved-card-keypoint">
                      <strong>Not:</strong> {item.card.backKeyPoint}
                    </div>
                  )}

                  <div className="saved-card-footer">
                    <span className="saved-date">
                      {new Date(item.savedAt).toLocaleDateString('tr-TR')}
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveFlashcardItem(item)}
                    >
                      <Trash2 className="icon-xs" />
                      <span>Kütüphaneden Sil</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
