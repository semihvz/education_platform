import type { AppSettings, UserStats, SavedQuestionItem, SavedFlashcardItem, Flashcard } from '../types/quiz';

const SETTINGS_KEY = 'mindpulse_settings';
const STATS_KEY = 'mindpulse_stats';
const SAVED_QUESTIONS_KEY = 'mindpulse_saved_questions';
const SAVED_FLASHCARDS_KEY = 'mindpulse_saved_flashcards';
const ACTIVE_USER_KEY = 'mindpulse_active_user';
const USERS_LIST_KEY = 'mindpulse_users';

const DB_NAME = 'MindPulseDB';
const DB_VERSION = 3; // Incremented for users store
const QUESTIONS_STORE = 'saved_questions';
const FLASHCARDS_STORE = 'saved_flashcards';
const USERS_STORE = 'users';

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
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        db.createObjectStore(USERS_STORE, { keyPath: 'email' });
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

export const recordAnswerResult = (topic: string, isCorrect: boolean, timeSpentSeconds: number = 0): UserStats => {
  const stats = loadUserStats();
  stats.totalAnswered += 1;
  if (isCorrect) {
    stats.correctAnswers += 1;
    stats.xp += 15;
  } else {
    stats.xp += 5; // Participation XP
  }

  // Update time tracking
  stats.totalTimeSpentSeconds = (stats.totalTimeSpentSeconds || 0) + timeSpentSeconds;
  stats.averageTimePerQuestion = Math.round(stats.totalTimeSpentSeconds / stats.totalAnswered);

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

// USER AUTHENTICATION & SESSION MANAGEMENT
import type { UserProfile } from '../types/quiz';

export const loadActiveUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error loading active user session:', e);
    return null;
  }
};

export const saveActiveUserSession = (user: UserProfile | null): void => {
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch (e) {
    console.error('Error saving active user session:', e);
  }
};

export const registerUserAccount = async (name: string, email: string, password: string): Promise<UserProfile> => {
  const normalizedEmail = email.trim().toLowerCase();
  
  const newUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: normalizedEmail,
    avatar: '🎓',
    createdAt: Date.now()
  };

  let users: any[] = [];
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    users = raw ? JSON.parse(raw) : [];
  } catch (e) {
    users = [];
  }

  const existing = users.find((u: any) => u.email === normalizedEmail);
  if (existing) {
    throw new Error('Bu e-posta adresiyle kayıtlı zaten bir hesap var.');
  }

  users.push({ ...newUser, password });
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));

  try {
    const db = await openDB();
    const tx = db.transaction(USERS_STORE, 'readwrite');
    const store = tx.objectStore(USERS_STORE);
    store.put({ ...newUser, password });
  } catch (e) {
    console.warn('IndexedDB user save error:', e);
  }

  saveActiveUserSession(newUser);
  return newUser;
};

export const loginUserAccount = async (email: string, password: string): Promise<UserProfile> => {
  const normalizedEmail = email.trim().toLowerCase();
  
  let users: any[] = [];
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    users = raw ? JSON.parse(raw) : [];
  } catch (e) {
    users = [];
  }

  let foundUser = users.find((u: any) => u.email === normalizedEmail && u.password === password);

  if (!foundUser) {
    try {
      const db = await openDB();
      foundUser = await new Promise((resolve) => {
        const tx = db.transaction(USERS_STORE, 'readonly');
        const store = tx.objectStore(USERS_STORE);
        const req = store.get(normalizedEmail);
        req.onsuccess = () => resolve(req.result && req.result.password === password ? req.result : null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.warn('IndexedDB login fetch error:', e);
    }
  }

  if (!foundUser) {
    throw new Error('E-posta adresi veya şifre hatalı!');
  }

  const profile: UserProfile = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    avatar: foundUser.avatar || '🎓',
    createdAt: foundUser.createdAt || Date.now()
  };

  saveActiveUserSession(profile);
  return profile;
};

export const quickDemoLogin = (): UserProfile => {
  const demoUser: UserProfile = {
    id: 'usr_demo_888',
    name: 'Öğrenci Kullanıcı',
    email: 'demo@mindpulse.ai',
    avatar: '⚡',
    createdAt: Date.now()
  };
  saveActiveUserSession(demoUser);
  return demoUser;
};

export const logoutUserAccount = (): void => {
  saveActiveUserSession(null);
};

// JOURNAL STORAGE HANDLERS
import type { JournalEntry } from '../types/quiz';

const JOURNAL_ENTRIES_KEY = 'optimizacion_ai_journal_entries';

export const loadJournalEntries = (): JournalEntry[] => {
  try {
    const raw = localStorage.getItem(JOURNAL_ENTRIES_KEY);
    if (!raw) return [];
    const entries: JournalEntry[] = JSON.parse(raw);
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error('Error loading journal entries:', e);
    return [];
  }
};

export const saveJournalEntries = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Error saving journal entries:', e);
  }
};

export const addJournalEntry = (newEntry: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry[] => {
  const current = loadJournalEntries();
  const entryWithMeta: JournalEntry = {
    ...newEntry,
    id: `jrn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now()
  };
  const updated = [entryWithMeta, ...current];
  saveJournalEntries(updated);
  return updated;
};

export const deleteJournalEntry = (id: string): JournalEntry[] => {
  const current = loadJournalEntries();
  const updated = current.filter(item => item.id !== id);
  saveJournalEntries(updated);
  return updated;
};

