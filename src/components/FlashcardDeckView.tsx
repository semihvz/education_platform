import React, { useState } from 'react';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Bookmark, 
  BookmarkCheck, 
  Shuffle, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Code,
  Layers,
  Award
} from 'lucide-react';
import type { Flashcard } from '../types/quiz';

interface FlashcardDeckViewProps {
  cards: Flashcard[];
  onSaveCard: (card: Flashcard) => void;
  isCardSaved: (cardId: string) => boolean;
  onNewDeckRequest: () => void;
}

export const FlashcardDeckView: React.FC<FlashcardDeckViewProps> = ({
  cards: initialCards,
  onSaveCard,
  isCardSaved,
  onNewDeckRequest,
}) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [learnedMap, setLearnedMap] = useState<Record<string, boolean>>({});

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];
  const isSaved = isCardSaved(currentCard.id);
  const isLearned = !!learnedMap[currentCard.id];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  const toggleLearned = () => {
    setLearnedMap((prev) => ({
      ...prev,
      [currentCard.id]: !prev[currentCard.id],
    }));
  };

  const learnedCount = Object.values(learnedMap).filter(Boolean).length;

  return (
    <div className="flashcard-container">
      {/* Top Deck Info */}
      <div className="deck-header">
        <div className="deck-info-left">
          <span className="topic-badge">
            <Layers className="icon" />
            {currentCard.topic}
          </span>
          <span className="card-counter-badge">
            Kart {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <div className="deck-info-right">
          <span className="learned-stat">
            <Award className="icon-sm icon-gold" />
            {learnedCount} / {cards.length} Öğrenildi
          </span>
          <button className="shuffle-btn" onClick={handleShuffle} title="Kartları Karıştır">
            <Shuffle className="icon-sm" />
            <span>Karıştır</span>
          </button>
        </div>
      </div>

      {/* 3D Flip Card Scene */}
      <div className="card-scene" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`card-3d ${isFlipped ? 'flipped' : ''}`}>
          {/* FRONT SIDE */}
          <div className="card-face card-front">
            <div className="card-top-bar">
              <span className="category-pill">{currentCard.frontCategory}</span>
              {isLearned && (
                <span className="learned-badge">
                  <CheckCircle className="icon-xs" /> Öğrenildi
                </span>
              )}
            </div>

            <div className="card-front-center">
              <Sparkles className="front-sparkle-icon" />
              <h2 className="card-front-title">{currentCard.frontTitle}</h2>
            </div>

            <div className="card-flip-hint">
              <RotateCw className="hint-icon" />
              <span>Açıklamayı görmek için kartı çevirin</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="card-face card-back">
            <div className="card-top-bar">
              <span className="back-badge">
                <BookOpen className="icon-xs" /> Bilgi & Özet
              </span>
              <button 
                className={`card-save-icon-btn ${isSaved ? 'saved' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveCard(currentCard);
                }}
                title="Kartı DB'ye Kaydet"
              >
                {isSaved ? <BookmarkCheck className="icon-sm" /> : <Bookmark className="icon-sm" />}
              </button>
            </div>

            <div className="card-back-body">
              <p className="back-explanation">{currentCard.backExplanation}</p>

              {currentCard.backExample && (
                <div className="back-example-box">
                  <Code className="example-icon" />
                  <div>
                    <strong>Pratik Örnek:</strong>
                    <p>{currentCard.backExample}</p>
                  </div>
                </div>
              )}

              {currentCard.backKeyPoint && (
                <div className="back-key-box">
                  <Lightbulb className="key-icon" />
                  <div>
                    <strong>Hatırlatıcı Not:</strong>
                    <p>{currentCard.backKeyPoint}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="card-flip-hint">
              <RotateCw className="hint-icon" />
              <span>Ön yüze dönmek için tıklayın</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls Toolbar */}
      <div className="deck-controls">
        <button className="nav-arrow-btn" onClick={handlePrev} title="Önceki Kart">
          <ChevronLeft className="icon-lg" />
        </button>

        <button 
          className="flip-action-btn"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCw className="btn-icon" />
          <span>{isFlipped ? 'Ön Yüzü Göster' : 'Kartı Çevir'}</span>
        </button>

        <button 
          className={`learned-toggle-btn ${isLearned ? 'learned' : ''}`}
          onClick={toggleLearned}
        >
          {isLearned ? (
            <>
              <CheckCircle className="btn-icon" />
              <span>Öğrenildi</span>
            </>
          ) : (
            <>
              <Circle className="btn-icon" />
              <span>Öğrendim Olarak İşaretle</span>
            </>
          )}
        </button>

        <button 
          className={`save-card-btn ${isSaved ? 'saved' : ''}`}
          onClick={() => onSaveCard(currentCard)}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="btn-icon" />
              <span>Kaydedildi</span>
            </>
          ) : (
            <>
              <Bookmark className="btn-icon" />
              <span>DB'ye Kaydet</span>
            </>
          )}
        </button>

        <button className="nav-arrow-btn" onClick={handleNext} title="Sonraki Kart">
          <ChevronRight className="icon-lg" />
        </button>
      </div>

      {/* New Deck CTA */}
      <div className="new-deck-box">
        <button className="new-deck-btn" onClick={onNewDeckRequest}>
          <span>Başka Konuda Bilgi Kartı Üret</span>
        </button>
      </div>
    </div>
  );
};
