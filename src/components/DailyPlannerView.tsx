import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  X, 
  Target, 
  BookOpen, 
  FileText,
  RotateCcw
} from 'lucide-react';
import type { DailyPlanTask } from '../types/quiz';
import { 
  loadPlannerTasks, 
  addPlannerTask, 
  togglePlannerTask, 
  deletePlannerTask,
  clearCompletedPlannerTasks 
} from '../services/storageService';

export const DailyPlannerView: React.FC = () => {
  const [tasks, setTasks] = useState<DailyPlanTask[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Matematik');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'yuksek' | 'orta' | 'dusuk'>('yuksek');
  const [targetMinutes, setTargetMinutes] = useState<number>(30);
  const [category, setCategory] = useState<'soru' | 'konu' | 'deneme' | 'tekrar' | 'diger'>('soru');
  const [notes, setNotes] = useState('');

  // Filter States
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'all'>('today');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'yuksek' | 'orta' | 'dusuk'>('all');

  useEffect(() => {
    setTasks(loadPlannerTasks());
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen görev başlığını giriniz.');
      return;
    }

    const updated = addPlannerTask({
      title: title.trim(),
      subject,
      date,
      priority,
      targetMinutes: Number(targetMinutes) || 30,
      category,
      notes: notes.trim() || undefined
    });

    setTasks(updated);

    // Reset Form
    setTitle('');
    setNotes('');
    setShowForm(false);
    showToast('Yeni çalışma görevi planlara eklendi! 🎯');
  };

  const handleToggleTask = (id: string, currentStatus: boolean) => {
    const updated = togglePlannerTask(id);
    setTasks(updated);
    if (!currentStatus) {
      showToast('Tebrikler! Görevi tamamladın! 🔥');
    }
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      const updated = deletePlannerTask(id);
      setTasks(updated);
      showToast('Görev silindi.');
    }
  };

  const handleClearCompleted = () => {
    if (window.confirm('Tamamlanan tüm görevler temizlensin mi?')) {
      const updated = clearCompletedPlannerTasks();
      setTasks(updated);
      showToast('Tamamlanan görevler temizlendi.');
    }
  };

  const handleAddQuickPreset = (presetTitle: string, presetSubject: string, presetCategory: 'soru' | 'konu' | 'deneme' | 'tekrar', presetMinutes: number) => {
    const updated = addPlannerTask({
      title: presetTitle,
      subject: presetSubject,
      date: todayStr,
      priority: 'yuksek',
      targetMinutes: presetMinutes,
      category: presetCategory,
      notes: 'Hızlı Ekleme İle Oluşturuldu'
    });
    setTasks(updated);
    showToast(`"${presetTitle}" bugünkü planına eklendi! 🚀`);
  };

  const showToast = (msg: string) => {
    setSaveSuccessToast(msg);
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  // Filter Tasks Logic
  const filteredTasks = tasks.filter((task) => {
    // Date filter
    if (dateFilter === 'today' && task.date !== todayStr) return false;
    if (dateFilter === 'tomorrow' && task.date !== tomorrowStr) return false;

    // Status filter
    if (statusFilter === 'pending' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    return true;
  });

  // Calculate Progress Stats for current view
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const totalTodayCount = todayTasks.length;
  const completedTodayCount = todayTasks.filter(t => t.completed).length;
  const completionPercentage = totalTodayCount > 0 ? Math.round((completedTodayCount / totalTodayCount) * 100) : 0;

  const totalEstimatedMinutes = todayTasks.reduce((acc, t) => acc + (t.targetMinutes || 0), 0);
  const completedMinutes = todayTasks.filter(t => t.completed).reduce((acc, t) => acc + (t.targetMinutes || 0), 0);

  const getSubjectBadgeClass = (subj: string) => {
    switch (subj) {
      case 'Matematik': return 'subj-badge-math';
      case 'Fizik': return 'subj-badge-physics';
      case 'Kimya': return 'subj-badge-chemistry';
      case 'Biyoloji': return 'subj-badge-biology';
      case 'Türkçe': return 'subj-badge-turkish';
      case 'Tarih/Coğrafya': return 'subj-badge-social';
      default: return 'subj-badge-default';
    }
  };

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'soru': return <Target className="cat-icon" />;
      case 'konu': return <BookOpen className="cat-icon" />;
      case 'deneme': return <FileText className="cat-icon" />;
      case 'tekrar': return <RotateCcw className="cat-icon" />;
      default: return <Sparkles className="cat-icon" />;
    }
  };

  return (
    <div className="daily-planner-container">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="save-toast-banner">
          <CheckCircle2 className="toast-icon" />
          <span>{saveSuccessToast}</span>
        </div>
      )}

      {/* Header Card */}
      <div className="planner-header-card">
        <div className="planner-title-box">
          <div className="planner-icon-bg">
            <CheckSquare className="planner-header-icon" />
          </div>
          <div>
            <h2>📋 Günlük Çalışma Planları & Yapılacaklar</h2>
            <p className="planner-header-sub">
              Günlük YKS çalışma hedeflerini planla, soru ve konu hedeflerini sırayla tamamla!
            </p>
          </div>
        </div>

        <div className="planner-header-actions">
          {tasks.some(t => t.completed) && (
            <button 
              className="planner-clear-btn"
              onClick={handleClearCompleted}
              title="Tamamlananları Temizle"
            >
              <Trash2 className="btn-icon-sm" />
              <span>Tamamlananları Temizle</span>
            </button>
          )}

          <button 
            className="planner-new-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X className="btn-icon" /> : <Plus className="btn-icon" />}
            <span>{showForm ? 'Kapat' : 'Yeni Görev Ekle'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Daily Summary Bar */}
      <div className="planner-summary-card">
        <div className="summary-main-row">
          <div className="summary-stat-group">
            <div className="stat-flame-box">
              <Flame className="flame-icon" />
              <span className="flame-percentage">{completionPercentage}%</span>
            </div>
            <div className="stat-text-meta">
              <span className="stat-title">Bugünkü Plan Başarısı</span>
              <span className="stat-subtitle">
                {completedTodayCount} / {totalTodayCount} Görev Tamamlandı
              </span>
            </div>
          </div>

          <div className="summary-stat-time">
            <Clock className="time-icon text-indigo" />
            <div>
              <span className="stat-time-val">{completedMinutes} / {totalEstimatedMinutes} Dk</span>
              <span className="stat-subtitle">Planlanan Çalışma Süresi</span>
            </div>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="planner-progress-track">
          <div 
            className="planner-progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Quick Add Presets (Hızlı Plan Ekleme Rutinleri) */}
      <div className="planner-presets-card">
        <span className="presets-label">⚡ Hızlı Hedef Rutinleri:</span>
        <div className="presets-scroll-row">
          <button 
            type="button" 
            className="preset-pill-btn"
            onClick={() => handleAddQuickPreset('30 AYT Matematik Soru Çözümü', 'Matematik', 'soru', 45)}
          >
            <Plus className="preset-add-icon" />
            <span>+ 30 AYT Mat Soru</span>
          </button>

          <button 
            type="button" 
            className="preset-pill-btn"
            onClick={() => handleAddQuickPreset('1 Adet TYT Branş Denemesi', 'Genel', 'deneme', 60)}
          >
            <Plus className="preset-add-icon" />
            <span>+ 1 TYT Deneme Çöz</span>
          </button>

          <button 
            type="button" 
            className="preset-pill-btn"
            onClick={() => handleAddQuickPreset('20 Paragraf Rutin Çözümü', 'Türkçe', 'soru', 25)}
          >
            <Plus className="preset-add-icon" />
            <span>+ 20 Paragraf Rutini</span>
          </button>

          <button 
            type="button" 
            className="preset-pill-btn"
            onClick={() => handleAddQuickPreset('Fizik Formül & Konu Tekrarı', 'Fizik', 'tekrar', 30)}
          >
            <Plus className="preset-add-icon" />
            <span>+ Fizik Konu Tekrarı</span>
          </button>

          <button 
            type="button" 
            className="preset-pill-btn"
            onClick={() => handleAddQuickPreset('Biyoloji Sistemler Testi', 'Biyoloji', 'soru', 35)}
          >
            <Plus className="preset-add-icon" />
            <span>+ Biyoloji Testi</span>
          </button>
        </div>
      </div>

      {/* New Task Creation Form */}
      {showForm && (
        <form onSubmit={handleCreateTask} className="planner-form-card">
          <div className="form-card-header">
            <Sparkles className="sparkle-icon" />
            <h3>Yeni Çalışma Görevi / Hedefi Planla</h3>
          </div>

          <div className="form-grid">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Görev / Hedef Başlığı *</label>
              <input
                type="text"
                className="journal-input"
                placeholder="Örn: AYT Matematik Türev 30 Soru Çöz ve Yanlışları İncele"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Subject & Category */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Ders / Alan</label>
                <select 
                  className="journal-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="Matematik">📐 Matematik</option>
                  <option value="Fizik">⚡ Fizik</option>
                  <option value="Kimya">🧪 Kimya</option>
                  <option value="Biyoloji">🧬 Biyoloji</option>
                  <option value="Türkçe">📚 Türkçe</option>
                  <option value="Tarih/Coğrafya">🌍 Tarih / Coğrafya</option>
                  <option value="Genel">🎯 Genel / Deneme</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Kategori</label>
                <select 
                  className="journal-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="soru">🎯 Soru Çözümü</option>
                  <option value="konu">📖 Konu Çalışması</option>
                  <option value="deneme">📝 Deneme Çözümü</option>
                  <option value="tekrar">🔄 Konu Tekrarı</option>
                  <option value="diger">⚡ Diğer</option>
                </select>
              </div>
            </div>

            {/* Date, Priority & Minutes */}
            <div className="form-row">
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

              <div className="form-group flex-1">
                <label className="form-label">Öncelik</label>
                <select 
                  className="journal-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="yuksek">🔴 Yüksek Öncelik</option>
                  <option value="orta">🟡 Orta Öncelik</option>
                  <option value="dusuk">🔵 Düşük Öncelik</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Tahmini Süre (Dakika)</label>
                <div className="input-with-icon">
                  <Clock className="field-icon" />
                  <input
                    type="number"
                    min="5"
                    max="600"
                    step="5"
                    className="journal-input"
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="form-group">
              <label className="form-label">Detay Notlar / Önemli İpuçları (Opsiyonel)</label>
              <textarea
                className="journal-textarea"
                rows={2}
                placeholder="Örn: Sayfa 120-145 arası soru bankasından çözülecek."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="form-actions">
              <button type="submit" className="save-entry-btn">
                <CheckSquare className="btn-icon" />
                <span>Görevi Planlara Ekle</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="planner-filter-bar">
        <div className="filter-group-row">
          {/* Date Filter Tabs */}
          <div className="filter-tab-pills">
            <button
              className={`filter-pill-btn ${dateFilter === 'today' ? 'active' : ''}`}
              onClick={() => setDateFilter('today')}
            >
              📅 Bugün ({tasks.filter(t => t.date === todayStr).length})
            </button>
            <button
              className={`filter-pill-btn ${dateFilter === 'tomorrow' ? 'active' : ''}`}
              onClick={() => setDateFilter('tomorrow')}
            >
              🌅 Yarın ({tasks.filter(t => t.date === tomorrowStr).length})
            </button>
            <button
              className={`filter-pill-btn ${dateFilter === 'all' ? 'active' : ''}`}
              onClick={() => setDateFilter('all')}
            >
              🗂️ Tüm Planlar ({tasks.length})
            </button>
          </div>

          {/* Priority & Status Filters */}
          <div className="filter-select-group">
            <select
              className="planner-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Durum: Tümü</option>
              <option value="pending">⏳ Yapılacaklar (Bekleyen)</option>
              <option value="completed">✅ Tamamlananlar</option>
            </select>

            <select
              className="planner-select-sm"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
            >
              <option value="all">Öncelik: Tümü</option>
              <option value="yuksek">🔴 Yüksek Öncelik</option>
              <option value="orta">🟡 Orta Öncelik</option>
              <option value="dusuk">🔵 Düşük Öncelik</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="planner-task-list">
        {filteredTasks.length === 0 ? (
          <div className="planner-empty-box">
            <CheckSquare className="empty-icon" />
            <h4>Görev Bulunamadı</h4>
            <p>
              Seçili filtrelere uygun planlanmış bir çalışma görevi bulunmuyor.
              Yukarıdaki "Yeni Görev Ekle" butonuna basarak veya hızlı hedeflerden seçerek planını oluştur!
            </p>
          </div>
        ) : (
          <div className="task-cards-grid">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-card-item ${task.completed ? 'completed-item' : ''}`}
              >
                {/* Custom Checkbox */}
                <button
                  type="button"
                  className={`task-checkbox-btn ${task.completed ? 'checked' : ''}`}
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  title={task.completed ? 'Görevi Bekliyor Yap' : 'Görevi Tamamla'}
                >
                  {task.completed ? (
                    <CheckSquare className="check-icon" />
                  ) : (
                    <Square className="uncheck-icon" />
                  )}
                </button>

                {/* Main Content */}
                <div className="task-content-body">
                  <div className="task-top-meta">
                    <span className={`subject-pill ${getSubjectBadgeClass(task.subject)}`}>
                      {task.subject}
                    </span>

                    {task.category && (
                      <span className="category-pill">
                        {getCategoryIcon(task.category)}
                        <span>{task.category.toUpperCase()}</span>
                      </span>
                    )}

                    {/* Priority Badge */}
                    {task.priority === 'yuksek' && (
                      <span className="priority-pill priority-high">🔴 Yüksek</span>
                    )}
                    {task.priority === 'orta' && (
                      <span className="priority-pill priority-med">🟡 Orta</span>
                    )}
                    {task.priority === 'dusuk' && (
                      <span className="priority-pill priority-low">🔵 Düşük</span>
                    )}

                    {task.targetMinutes && (
                      <span className="time-badge">
                        <Clock className="time-icon-xs" />
                        {task.targetMinutes} dk
                      </span>
                    )}
                  </div>

                  <h4 className="task-title-text">{task.title}</h4>

                  {task.notes && (
                    <p className="task-notes-text">💡 {task.notes}</p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  className="task-delete-btn"
                  onClick={() => handleDeleteTask(task.id)}
                  title="Görevi Sil"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
