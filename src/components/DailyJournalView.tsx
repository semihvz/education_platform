import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Image as ImageIcon, Video, Trash2, Calendar, Tag, Plus, X, Search, Sparkles, ZoomIn, Check, Link } from 'lucide-react';
import type { JournalEntry } from '../types/quiz';
import { loadJournalEntries, addJournalEntry, deleteJournalEntry } from '../services/storageService';

const getEmbedVideoUrl = (url: string) => {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
};

export const DailyJournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New entry form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [photoCaption, setPhotoCaption] = useState('');
  
  // Video attachment state
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [videoCaption, setVideoCaption] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('upload');

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
      alert('Photo file size is too large (Maximum size is 8 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Video file size is too large (Maximum size is 25 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    setVideoUrl(videoUrlInput.trim());
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
    setPhotoCaption('');
  };

  const handleRemoveVideo = () => {
    setVideoUrl(undefined);
    setVideoCaption('');
    setVideoUrlInput('');
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in the journal entry title and study notes.');
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
      videoUrl,
      videoCaption: videoCaption.trim() || undefined,
      mood,
      tags: parsedTags.length > 0 ? parsedTags : undefined
    });

    setEntries(updated);

    // Reset form
    setTitle('');
    setContent('');
    setPhotoUrl(undefined);
    setPhotoCaption('');
    setVideoUrl(undefined);
    setVideoCaption('');
    setVideoUrlInput('');
    setTagsInput('');
    setMood('verimli');
    setShowForm(false);

    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
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
        return <span className="journal-mood-badge mood-green">🎯 Productive Day</span>;
      case 'motive':
        return <span className="journal-mood-badge mood-purple">🔥 High Motivation</span>;
      case 'odakli':
        return <span className="journal-mood-badge mood-blue">💡 Focused Session</span>;
      case 'yorgun':
        return <span className="journal-mood-badge mood-amber">😴 Tired Pace</span>;
      default:
        return <span className="journal-mood-badge mood-gray">⚡ Normal Day</span>;
    }
  };

  return (
    <div className="daily-journal-container">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="save-toast-banner">
          <Check className="toast-icon" />
          <span>Journal entry and attached photo saved successfully!</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="journal-header-card">
        <div className="journal-title-box">
          <div className="journal-icon-bg">
            <BookOpenCheck className="journal-header-icon" />
          </div>
          <div>
            <h2>📓 Study Journal & Daily Notes</h2>
            <p className="journal-header-sub">
              Record your daily study notes, net targets, and attach workspace/question photos.
            </p>
          </div>
        </div>

        <button 
          className="journal-new-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="btn-icon" /> : <Plus className="btn-icon" />}
          <span>{showForm ? 'Close Form' : 'Add New Entry'}</span>
        </button>
      </div>

      {/* New Journal Entry Form */}
      {showForm && (
        <form onSubmit={handleSubmitEntry} className="journal-entry-form-card">
          <div className="form-card-header">
            <Sparkles className="sparkle-icon" />
            <h3>Add Daily Study Note & Photo</h3>
          </div>

          <div className="form-grid">
            {/* Title & Date */}
            <div className="form-row">
              <div className="form-group flex-2">
                <label className="form-label">Entry Title *</label>
                <input
                  type="text"
                  className="journal-input"
                  placeholder="e.g., Sep 9 AYT Math 250 Questions Solved & Practice Net Score"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Date</label>
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
              <label className="form-label">Daily Study Mood / Efficiency</label>
              <div className="mood-selection-grid">
                {[
                  { key: 'verimli', label: '🎯 Productive', color: 'green' },
                  { key: 'motive', label: '🔥 High Motivation', color: 'purple' },
                  { key: 'odakli', label: '💡 Focused', color: 'blue' },
                  { key: 'yorgun', label: '😴 Tired', color: 'amber' },
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
              <label className="form-label">Study Notes, Practice Questions & Goals *</label>
              <textarea
                className="journal-textarea"
                rows={5}
                placeholder="What subjects did you practice today? How many questions were solved? Key takeaways learned?..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* Photo Upload Section */}
            <div className="form-group photo-upload-group">
              <label className="form-label">📷 Attach Photo (Question / Notes / Workspace)</label>
              
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
                    <span className="upload-title">Select or Drop Photo</span>
                    <span className="upload-hint">PNG, JPG or WEBP (Max 8 MB)</span>
                  </label>
                </div>
              ) : (
                <div className="photo-preview-container">
                  <div className="photo-preview-wrapper">
                    <img src={photoUrl} alt="Journal Attachment" className="preview-img" />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={handleRemovePhoto}
                      title="Remove Photo"
                    >
                      <X />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="journal-input caption-input"
                    placeholder="Photo caption (e.g. Tough permutation question solution)..."
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Video Attachment Section */}
            <div className="form-group photo-upload-group">
              <label className="form-label">🎥 Attach Video (File Upload or YouTube / MP4 Link)</label>

              {!videoUrl ? (
                <div className="video-attachment-card">
                  <div className="video-mode-switcher">
                    <button
                      type="button"
                      className={`video-mode-btn ${videoMode === 'upload' ? 'active' : ''}`}
                      onClick={() => setVideoMode('upload')}
                    >
                      <Video className="btn-icon-sm" />
                      <span>Upload Video File</span>
                    </button>
                    <button
                      type="button"
                      className={`video-mode-btn ${videoMode === 'url' ? 'active' : ''}`}
                      onClick={() => setVideoMode('url')}
                    >
                      <Link className="btn-icon-sm" />
                      <span>Paste Video Link</span>
                    </button>
                  </div>

                  {videoMode === 'upload' ? (
                    <div className="photo-dropzone">
                      <input
                        type="file"
                        accept="video/*"
                        id="journal-video-input"
                        className="hidden-file-input"
                        onChange={handleVideoFileUpload}
                      />
                      <label htmlFor="journal-video-input" className="photo-upload-label">
                        <Video className="upload-icon text-indigo" />
                        <span className="upload-title">Select Video File</span>
                        <span className="upload-hint">MP4, WebM or MOV (Max 25 MB)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="video-url-input-group">
                      <div className="input-with-icon">
                        <Link className="field-icon" />
                        <input
                          type="url"
                          className="journal-input"
                          placeholder="Paste YouTube or video link (e.g. https://www.youtube.com/watch?v=...)"
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="attach-url-btn"
                        onClick={handleAddVideoUrl}
                      >
                        Attach Video
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="video-preview-container">
                  <div className="video-preview-wrapper">
                    {getEmbedVideoUrl(videoUrl) ? (
                      <iframe
                        src={getEmbedVideoUrl(videoUrl)!}
                        title="Video Preview"
                        className="preview-iframe"
                        allowFullScreen
                      />
                    ) : (
                      <video controls src={videoUrl} className="preview-video" />
                    )}
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={handleRemoveVideo}
                      title="Remove Video"
                    >
                      <X />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="journal-input caption-input"
                    placeholder="Video caption (e.g. Solution walkthrough video)..."
                    value={videoCaption}
                    onChange={(e) => setVideoCaption(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div className="form-group">
              <label className="form-label">Tags (Separate with commas)</label>
              <div className="input-with-icon">
                <Tag className="field-icon" />
                <input
                  type="text"
                  className="journal-input"
                  placeholder="e.g. AYTMath, Practice, MedSchoolTarget, 250Questions"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="save-entry-btn">
                <BookOpenCheck className="btn-icon" />
                <span>Save Journal Entry</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Journal Entries List Section */}
      <div className="journal-list-section">
        <div className="journal-list-bar">
          <h3>📖 My Journal Entries ({entries.length})</h3>
          
          <div className="journal-search-box">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="journal-empty-box">
            <BookOpenCheck className="empty-icon" />
            <h4>No Journal Entries Found</h4>
            <p>
              {searchQuery
                ? 'No journal entries match your search query.'
                : 'Click "Add New Entry" above to record your first study journal with photos and videos!'}
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
                    title="Delete Entry"
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
                        <span>Zoom</span>
                      </div>
                    </div>
                    {item.photoCaption && (
                      <p className="journal-photo-caption">📷 {item.photoCaption}</p>
                    )}
                  </div>
                )}

                {/* Attached Video */}
                {item.videoUrl && (
                  <div className="journal-video-box">
                    {getEmbedVideoUrl(item.videoUrl) ? (
                      <iframe
                        src={getEmbedVideoUrl(item.videoUrl)!}
                        title={item.title}
                        className="journal-card-iframe"
                        allowFullScreen
                      />
                    ) : (
                      <video controls src={item.videoUrl} className="journal-card-video" />
                    )}
                    {item.videoCaption && (
                      <p className="journal-video-caption">🎥 {item.videoCaption}</p>
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
            <img src={activeZoomImage} alt="Full Zoom Preview" className="full-zoomed-img" />
          </div>
        </div>
      )}
    </div>
  );
};
