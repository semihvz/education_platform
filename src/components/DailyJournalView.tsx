import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Image as ImageIcon, Trash2, Calendar, Tag, Plus, X, Search, Sparkles, ZoomIn, Check } from 'lucide-react';
import type { JournalEntry } from '../types/quiz';
import { loadJournalEntries, addJournalEntry, deleteJournalEntry } from '../services/storageService';

export const DailyJournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New entry form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [photoCaption, setPhotoCaption] = useState('');
  const [mood, setMood] = useState<'verimli' | 'motive' | 'yorgun' | 'odakli' | 'normal'>('verimli');
  const [tagsInput, setTagsInput] = useState('');
  
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  useEffect(() => {
    setEntries(loadJournalEntries());
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Fotoğraf boyutu çok yüksek (Maksimum 8 MB yükleyebilirsiniz).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
    setPhotoCaption('');
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Lütfen günlük başlığı ve açıklamasını doldurunuz.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updated = addJournalEntry({
      title: title.trim(),
      date,
      content: content.trim(),
      photoUrl,
      photoCaption: photoCaption.trim() || undefined,
      mood,
      tags: parsedTags.length > 0 ? parsedTags : undefined
    });

    setEntries(updated);

    // Reset form
    setTitle('');
    setContent('');
    setPhotoUrl(undefined);
    setPhotoCaption('');
    setTagsInput('');
    setMood('verimli');
    setShowForm(false);

    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu günlük yazısını silmek istediğinize emin misiniz?')) {
      const updated = deleteJournalEntry(id);
      setEntries(updated);
    }
  };

  const filteredEntries = entries.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  const getMoodBadge = (m?: string) => {
    switch (m) {
      case 'verimli':
        return <span className="journal-mood-badge mood-green">🎯 Verimli Gün</span>;
      case 'motive':
        return <span className="journal-mood-badge mood-purple">🔥 Yüksek Motivasyon</span>;
      case 'odakli':
        return <span className="journal-mood-badge mood-blue">💡 Odaklı Çalışma</span>;
      case 'yorgun':
        return <span className="journal-mood-badge mood-amber">😴 Yorgun Tempolu</span>;
      default:
        return <span className="journal-mood-badge mood-gray">⚡ Normal Gün</span>;
    }
  };

  return (
    <div className="daily-journal-container">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="save-toast-banner">
          <Check className="toast-icon" />
          <span>Günlük yazısı ve fotoğraf başarıyla kaydedildi!</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="journal-header-card">
        <div className="journal-title-box">
          <div className="journal-icon-bg">
            <BookOpenCheck className="journal-header-icon" />
          </div>
          <div>
            <h2>📓 Çalışma Günlüğü & Not Defteri</h2>
            <p className="journal-header-sub">
              Çözdüğün soruları, günlük net hedeflerini ve çalışma masanın fotoğraflarını kaydet.
            </p>
          </div>
        </div>

        <button 
          className="journal-new-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="btn-icon" /> : <Plus className="btn-icon" />}
          <span>{showForm ? 'Formu Kapat' : 'Yeni Günlük Ekle'}</span>
        </button>
      </div>

      {/* New Journal Entry Form */}
      {showForm && (
        <form onSubmit={handleSubmitEntry} className="journal-entry-form-card">
          <div className="form-card-header">
            <Sparkles className="sparkle-icon" />
            <h3>Günün Notunu & Fotoğrafını Ekle</h3>
          </div>

          <div className="form-grid">
            {/* Title & Date */}
            <div className="form-row">
              <div className="form-group flex-2">
                <label className="form-label">Günlük Başlığı *</label>
                <input
                  type="text"
                  className="journal-input"
                  placeholder="Örn: 9 Eylül AYT Matematik 250 Soru Çözümü & Deneme Netleri"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Tarih</label>
                <div className="input-with-icon">
                  <Calendar className="field-icon" />
                  <input
                    type="date"
                    className="journal-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Mood Selector */}
            <div className="form-group">
              <label className="form-label">Günün Modu / Verimi</label>
              <div className="mood-selection-grid">
                {[
                  { key: 'verimli', label: '🎯 Verimli', color: 'green' },
                  { key: 'motive', label: '🔥 Yüksek Motivasyon', color: 'purple' },
                  { key: 'odakli', label: '💡 Odaklı', color: 'blue' },
                  { key: 'yorgun', label: '😴 Yorgun', color: 'amber' },
                  { key: 'normal', label: '⚡ Normal', color: 'gray' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`mood-select-btn ${mood === item.key ? `active-${item.color}` : ''}`}
                    onClick={() => setMood(item.key as any)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="form-group">
              <label className="form-label">Çalışma Notları, Çözülen Sorular & Hedefler *</label>
              <textarea
                className="journal-textarea"
                rows={5}
                placeholder="Bugün hangi derslerden kaç soru çözdün? Yanlış çıkan soruların mantığı neydi? Yarınki net ve soru hedefin nedir?..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* Photo Upload Section */}
            <div className="form-group photo-upload-group">
              <label className="form-label">📷 Fotoğraf Ekle (Çözülen Soru / Ders Notu / Masa)</label>
              
              {!photoUrl ? (
                <div className="photo-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    id="journal-photo-input"
                    className="hidden-file-input"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="journal-photo-input" className="photo-upload-label">
                    <ImageIcon className="upload-icon" />
                    <span className="upload-title">Fotoğraf Seç veya Yükle</span>
                    <span className="upload-hint">PNG, JPG veya WEBP (Maks 8 MB)</span>
                  </label>
                </div>
              ) : (
                <div className="photo-preview-container">
                  <div className="photo-preview-wrapper">
                    <img src={photoUrl} alt="Günlük Görseli" className="preview-img" />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={handleRemovePhoto}
                      title="Fotoğrafı Kaldır"
                    >
                      <X />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="journal-input caption-input"
                    placeholder="Fotoğraf açıklaması (Örn: Çözülemeyen zor permütasyon sorusu ve AI çözümü)..."
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div className="form-group">
              <label className="form-label">Etiketler (Virgülle Ayırın)</label>
              <div className="input-with-icon">
                <Tag className="field-icon" />
                <input
                  type="text"
                  className="journal-input"
                  placeholder="Örn: AYT Matematik, Paragraf, HacettepeTıp, 250Soru"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="save-entry-btn">
                <BookOpenCheck className="btn-icon" />
                <span>Günlüğe Kaydet</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Journal Entries List Section */}
      <div className="journal-list-section">
        <div className="journal-list-bar">
          <h3>📖 Kayıtlı Günlüklerim ({entries.length})</h3>
          
          <div className="journal-search-box">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Günlüklerde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="journal-empty-box">
            <BookOpenCheck className="empty-icon" />
            <h4>Henüz Günlük Girişi Yok</h4>
            <p>
              {searchQuery
                ? 'Aramanıza uygun günlük bulunamadı.'
                : 'İlk çalışma günlüğünü eklemek için yukarıdaki "Yeni Günlük Ekle" butonuna tıkla!'}
            </p>
          </div>
        ) : (
          <div className="journal-grid">
            {filteredEntries.map((item) => (
              <div key={item.id} className="journal-card">
                <div className="journal-card-header">
                  <div className="journal-card-meta">
                    <span className="journal-date">
                      <Calendar className="date-icon" />
                      {item.date}
                    </span>
                    {getMoodBadge(item.mood)}
                  </div>
                  <button
                    className="delete-entry-btn"
                    onClick={() => handleDelete(item.id)}
                    title="Günlüğü Sil"
                  >
                    <Trash2 />
                  </button>
                </div>

                <h4 className="journal-card-title">{item.title}</h4>

                <p className="journal-card-body">{item.content}</p>

                {/* Attached Photo */}
                {item.photoUrl && (
                  <div className="journal-photo-box">
                    <div 
                      className="photo-img-wrapper"
                      onClick={() => setActiveZoomImage(item.photoUrl!)}
                    >
                      <img src={item.photoUrl} alt={item.title} className="journal-card-img" />
                      <div className="zoom-overlay">
                        <ZoomIn className="zoom-icon" />
                        <span>Büyüt</span>
                      </div>
                    </div>
                    {item.photoCaption && (
                      <p className="journal-photo-caption">📷 {item.photoCaption}</p>
                    )}
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="journal-tags-list">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="journal-tag-pill">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Zoom Modal */}
      {activeZoomImage && (
        <div className="image-zoom-modal-backdrop" onClick={() => setActiveZoomImage(null)}>
          <div className="image-zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-zoom-btn" onClick={() => setActiveZoomImage(null)}>
              <X />
            </button>
            <img src={activeZoomImage} alt="Fotoğraf Önizleme" className="full-zoomed-img" />
          </div>
        </div>
      )}
    </div>
  );
};
