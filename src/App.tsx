import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmbeddedQuestionBankView } from './components/EmbeddedQuestionBankView';
import { FlashcardTopicSelector } from './components/FlashcardTopicSelector';
import { FlashcardDeckView } from './components/FlashcardDeckView';
import { SettingsModal } from './components/SettingsModal';
import { SavedQuestionsModal } from './components/SavedQuestionsModal';
import { StatsDashboard } from './components/StatsDashboard';
import { AuthModal } from './components/AuthModal';
import { AuthGuardWall } from './components/AuthGuardWall';

import type { Question, AppSettings, UserStats, SavedQuestionItem, Flashcard, SavedFlashcardItem, UserProfile } from './types/quiz';
import { getPreloadedFlashcards, getPreloadedQuestions } from './services/aiService';
import { 
  loadSettings, 
  saveSettings, 
  loadUserStats, 
  recordAnswerResult, 
  loadSavedQuestionsFromDB, 
  toggleSaveQuestionToDB,
  loadSavedFlashcardsFromDB,
  toggleSaveFlashcardToDB,
  loadActiveUser,
  logoutUserAccount
} from './services/storageService';
import { audioService } from './services/audioService';

export function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(loadActiveUser);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestionItem[]>([]);
  const [savedFlashcards, setSavedFlashcards] = useState<SavedFlashcardItem[]>([]);

  // 2 Modes: 'embedded-bank' | 'flashcards'
  const [activeMode, setActiveMode] = useState<'embedded-bank' | 'flashcards'>('embedded-bank');

  // Embedded Question Bank State
  const [embeddedQuestions] = useState<Question[]>(() => getPreloadedQuestions());
  
  // Flashcards State
  const [currentDeck, setCurrentDeck] = useState<Flashcard[] | null>(null);

  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Modals
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Sync theme attribute & load DB saved items
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    loadSavedQuestionsFromDB().then((items) => setSavedQuestions(items));
    loadSavedFlashcardsFromDB().then((items) => setSavedFlashcards(items));
  }, [settings.theme]);

  // Select preloaded Flashcard Deck
  const handleSelectFlashcardDeck = (topic: string) => {
    audioService.playClickSound(settings.soundEnabled);
    const deck = getPreloadedFlashcards(topic, 5);
    setCurrentDeck(deck);
  };

  // Handle user submitting answer in Quiz mode
  const handleAnswerSubmit = (question: Question, optionId: string) => {
    const isCorrect = optionId === question.correctOptionId;

    if (isCorrect) {
      audioService.playCorrectSound(settings.soundEnabled);
      audioService.triggerHaptic('success');
    } else {
      audioService.playIncorrectSound(settings.soundEnabled);
      audioService.triggerHaptic('warning');
    }

    const updatedStats = recordAnswerResult(question.topic, isCorrect);
    setStats(updatedStats);
  };

  // DB Save / Bookmark toggle for Questions
  const handleToggleSaveQuestion = async (q: Question, ansId: string) => {
    const isCorrect = ansId === q.correctOptionId;

    const item: SavedQuestionItem = {
      question: q,
      userAnswerId: ansId,
      savedAt: Date.now(),
      wasCorrect: isCorrect
    };

    const { isSaved, updatedList } = await toggleSaveQuestionToDB(item);
    setSavedQuestions(updatedList);

    setSaveToast(isSaved ? 'Soru veritabanına kaydedildi! 💾' : 'Soru kütüphaneden çıkarıldı.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // DB Save / Bookmark toggle for Flashcards
  const handleToggleSaveFlashcard = async (card: Flashcard) => {
    const { isSaved, updatedList } = await toggleSaveFlashcardToDB(card);
    setSavedFlashcards(updatedList);

    setSaveToast(isSaved ? 'Çalışma kartı veritabanına kaydedildi! 🎴' : 'Kart kütüphaneden çıkarıldı.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const isCurrentQuestionSaved = (qId: string) => {
    return savedQuestions.some(item => item.question.id === qId);
  };

  const isFlashcardSaved = (cardId: string) => {
    return savedFlashcards.some(item => item.card.id === cardId);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleReviewSavedQuestion = (_item: SavedQuestionItem) => {
    setActiveMode('embedded-bank');
  };

  const handleRemoveSavedQuestionItem = async (item: SavedQuestionItem) => {
    const { updatedList } = await toggleSaveQuestionToDB(item);
    setSavedQuestions(updatedList);
  };

  const handleRemoveSavedFlashcardItem = async (item: SavedFlashcardItem) => {
    const { updatedList } = await toggleSaveFlashcardToDB(item.card);
    setSavedFlashcards(updatedList);
  };

  return (
    <div className="app-root">
      <Header
        stats={stats}
        settings={settings}
        currentUser={currentUser}
        activeMode={activeMode}
        onSwitchMode={(mode) => {
          audioService.playClickSound(settings.soundEnabled);
          setActiveMode(mode);
        }}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setShowSettings(true)}
        onOpenBookmarks={() => setShowBookmarks(true)}
        onOpenStats={() => setShowStats(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => {
          logoutUserAccount();
          setCurrentUser(null);
          setSaveToast('Çıkış yapıldı.');
          setTimeout(() => setSaveToast(null), 2500);
        }}
      />

      {/* Database Save Notification Toast */}
      {saveToast && (
        <div className="toast-notification">
          <span>{saveToast}</span>
        </div>
      )}

      <main className="main-container">
        {!currentUser ? (
          <AuthGuardWall
            onOpenAuth={() => setShowAuthModal(true)}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setSaveToast(`Hoş geldin, ${user.name}! 👋`);
              setTimeout(() => setSaveToast(null), 2500);
            }}
          />
        ) : (
          <>

            {/* 2. ALAN: GOMULU SORULARI GOSTER / COZ (100 OXFORD SINAVI) */}
            {activeMode === 'embedded-bank' && (
              <EmbeddedQuestionBankView
                questions={embeddedQuestions}
                onAnswerSubmit={handleAnswerSubmit}
                onSaveQuestion={handleToggleSaveQuestion}
                isQuestionSaved={isCurrentQuestionSaved}
              />
            )}

            {/* 3. ALAN: BILGI KARTLARI (FLASHCARD SYSTEM) */}
            {activeMode === 'flashcards' && (
              <>
                {!currentDeck && (
                  <FlashcardTopicSelector
                    onSelectDeck={handleSelectFlashcardDeck}
                  />
                )}

                {currentDeck && (
                  <FlashcardDeckView
                    cards={currentDeck}
                    onSaveCard={handleToggleSaveFlashcard}
                    isCardSaved={isFlashcardSaved}
                    onNewDeckRequest={() => setCurrentDeck(null)}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showBookmarks && (
        <SavedQuestionsModal
          questionItems={savedQuestions}
          flashcardItems={savedFlashcards}
          onRemoveQuestionItem={handleRemoveSavedQuestionItem}
          onRemoveFlashcardItem={handleRemoveSavedFlashcardItem}
          onSelectQuestionForReview={handleReviewSavedQuestion}
          onClose={() => setShowBookmarks(false)}
        />
      )}

      {showStats && (
        <StatsDashboard
          stats={stats}
          onClose={() => setShowStats(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            setSaveToast(`Hoş geldin, ${user.name}! 👋`);
            setTimeout(() => setSaveToast(null), 2500);
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default App;
