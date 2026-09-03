import type { AppSettings, UserStats, SavedQuestionItem, SavedFlashcardItem, Flashcard } from '../types/quiz';

const SETTINGS_KEY = 'mindpulse_settings';
const STATS_KEY = 'mindpulse_stats';
const SAVED_QUESTIONS_KEY = 'mindpulse_saved_questions';
const SAVED_FLASHCARDS_KEY = 'mindpulse_saved_flashcards';

const DB_NAME = 'MindPulseDB';
const DB_VERSION = 2; // Incremented for flashcards store
const QUESTIONS_STORE = 'saved_questions';
const FLASHCARDS_STORE = 'saved_flashcards';

// IndexedDB Helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(QUESTIONS_STORE)) {
        db.createObjectStore(QUESTIONS_STORE, { keyPath: 'question.id' });
      }
      if (!db.objectStoreNames.contains(FLASHCARDS_STORE)) {
        db.createObjectStore(FLASHCARDS_STORE, { keyPath: 'card.id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const defaultSettings: AppSettings = {
  apiKey: '',
  selectedModel: 'gemini-2.5-flash',
  soundEnabled: true,
  theme: 'dark',
};

export const defaultStats: UserStats = {
  totalAnswered: 0,
  correctAnswers: 0,
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  topicMastery: {},
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch (e) {
    console.error('Error loading settings:', e);
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
};

export const loadUserStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    const stats: UserStats = JSON.parse(raw);
    
    // Check streak
    const today = new Date().toISOString().split('T')[0];
    const lastActive = new Date(stats.lastActiveDate);
    const now = new Date(today);
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1 && stats.lastActiveDate !== today) {
      stats.streakDays += 1;
      stats.lastActiveDate = today;
    } else if (diffDays > 1) {
      stats.streakDays = 1;
      stats.lastActiveDate = today;
    }

    return stats;
  } catch (e) {
    console.error('Error loading user stats:', e);
    return defaultStats;
  }
};

export const saveUserStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving user stats:', e);
  }
};

export const recordAnswerResult = (topic: string, isCorrect: boolean): UserStats => {
  const stats = loadUserStats();
  stats.totalAnswered += 1;
  if (isCorrect) {
    stats.correctAnswers += 1;
    stats.xp += 15;
  } else {
    stats.xp += 5; // Participation XP
  }

  // Update topic mastery
  if (!stats.topicMastery[topic]) {
    stats.topicMastery[topic] = { total: 0, correct: 0 };
  }
  stats.topicMastery[topic].total += 1;
  if (isCorrect) {
    stats.topicMastery[topic].correct += 1;
  }

  saveUserStats(stats);
  return stats;
};

// Questions DB Load & Save
export const loadSavedQuestions = (): SavedQuestionItem[] => {
  try {
    const raw = localStorage.getItem(SAVED_QUESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading saved questions:', e);
    return [];
  }
};

export const loadSavedQuestionsFromDB = async (): Promise<SavedQuestionItem[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(QUESTIONS_STORE, 'readonly');
      const store = tx.objectStore(QUESTIONS_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        const results: SavedQuestionItem[] = request.result || [];
        results.sort((a, b) => b.savedAt - a.savedAt);
        localStorage.setItem(SAVED_QUESTIONS_KEY, JSON.stringify(results));
        resolve(results);
      };
      request.onerror = () => {
        resolve(loadSavedQuestions());
      };
    });
  } catch (e) {
    console.warn('IndexedDB read error, falling back to localStorage:', e);
    return loadSavedQuestions();
  }
};

export const toggleSaveQuestionToDB = async (savedItem: SavedQuestionItem): Promise<{ isSaved: boolean; updatedList: SavedQuestionItem[] }> => {
  const currentList = loadSavedQuestions();
  const index = currentList.findIndex(item => item.question.id === savedItem.question.id);
  
  let isSaved = false;
  if (index >= 0) {
    currentList.splice(index, 1);
    isSaved = false;
  } else {
    currentList.unshift(savedItem);
    isSaved = true;
  }

  try {
    localStorage.setItem(SAVED_QUESTIONS_KEY, JSON.stringify(currentList));
  } catch (e) {
    console.error('Error saving question to localStorage:', e);
  }

  try {
    const db = await openDB();
    const tx = db.transaction(QUESTIONS_STORE, 'readwrite');
    const store = tx.objectStore(QUESTIONS_STORE);

    if (isSaved) {
      store.put(savedItem);
    } else {
      store.delete(savedItem.question.id);
    }
  } catch (e) {
    console.warn('IndexedDB write error:', e);
  }

  return { isSaved, updatedList: currentList };
};

// FLASHCARDS DB LOAD & SAVE
export const loadSavedFlashcards = (): SavedFlashcardItem[] => {
  try {
    const raw = localStorage.getItem(SAVED_FLASHCARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading saved flashcards:', e);
    return [];
  }
};

export const loadSavedFlashcardsFromDB = async (): Promise<SavedFlashcardItem[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(FLASHCARDS_STORE, 'readonly');
      const store = tx.objectStore(FLASHCARDS_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        const results: SavedFlashcardItem[] = request.result || [];
        results.sort((a, b) => b.savedAt - a.savedAt);
        localStorage.setItem(SAVED_FLASHCARDS_KEY, JSON.stringify(results));
        resolve(results);
      };
      request.onerror = () => {
        resolve(loadSavedFlashcards());
      };
    });
  } catch (e) {
    console.warn('IndexedDB flashcard read error:', e);
    return loadSavedFlashcards();
  }
};

export const toggleSaveFlashcardToDB = async (card: Flashcard): Promise<{ isSaved: boolean; updatedList: SavedFlashcardItem[] }> => {
  const currentList = loadSavedFlashcards();
  const index = currentList.findIndex(item => item.card.id === card.id);
  
  let isSaved = false;
  if (index >= 0) {
    currentList.splice(index, 1);
    isSaved = false;
  } else {
    const newItem: SavedFlashcardItem = { card, savedAt: Date.now() };
    currentList.unshift(newItem);
    isSaved = true;
  }

  try {
    localStorage.setItem(SAVED_FLASHCARDS_KEY, JSON.stringify(currentList));
  } catch (e) {
    console.error('Error saving flashcards to localStorage:', e);
  }

  try {
    const db = await openDB();
    const tx = db.transaction(FLASHCARDS_STORE, 'readwrite');
    const store = tx.objectStore(FLASHCARDS_STORE);

    if (isSaved) {
      store.put({ card, savedAt: Date.now() });
    } else {
      store.delete(card.id);
    }
  } catch (e) {
    console.warn('IndexedDB flashcard write error:', e);
  }

  return { isSaved, updatedList: currentList };
};
