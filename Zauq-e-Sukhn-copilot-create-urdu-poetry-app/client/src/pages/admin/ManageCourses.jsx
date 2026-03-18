import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { coursesData } from '../../data/courses';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const emptyLesson = { title: '', titleUrdu: '', content: '', contentUrdu: '', examples: [], duration: '' };
const emptyCourse = { title: '', titleUrdu: '', description: '', descriptionUrdu: '', order: 1, lessons: [] };

const ManageCourses = () => {
  const [courses, setCourses] = useState(coursesData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyCourse);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [openLessonIdx, setOpenLessonIdx] = useState(-1);

  useEffect(() => {
    api.get('/courses').then(res => {
      const data = res.data.courses || res.data;
      if (Array.isArray(data) && data.length > 0) setCourses(data);
    }).catch(() => {});
  }, []);

  const openAdd = () => { setForm(emptyCourse); setEditing(null); setOpenLessonIdx(-1); setShowForm(true); };
  const openEdit = (c) => {
    // Ensure each lesson has all expected fields
    const lessons = (c.lessons || []).map(l => ({
      title: l.title || '',
      titleUrdu: l.titleUrdu || '',
      content: l.content || '',
      contentUrdu: l.contentUrdu || '',
      examples: l.examples || [],
      duration: l.duration || '',
    }));
    setForm({ ...c, lessons });
    setEditing(c._id || c.id);
    setOpenLessonIdx(-1);
    setShowForm(true);
  };

  // Lesson CRUD helpers
  const addLesson = () => {
    const updated = [...(form.lessons || []), { ...emptyLesson }];
    setForm({ ...form, lessons: updated });
    setOpenLessonIdx(updated.length - 1);
  };

  const updateLesson = (idx, field, value) => {
    const updated = form.lessons.map((l, i) => i === idx ? { ...l, [field]: value } : l);
    setForm({ ...form, lessons: updated });
  };

  const removeLesson = (idx) => {
    const updated = form.lessons.filter((_, i) => i !== idx);
    setForm({ ...form, lessons: updated });
    setOpenLessonIdx(-1);
  };

  const moveLessonUp = (idx) => {
    if (idx === 0) return;
    const updated = [...form.lessons];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    setForm({ ...form, lessons: updated });
    setOpenLessonIdx(idx - 1);
  };

  const moveLessonDown = (idx) => {
    if (idx >= form.lessons.length - 1) return;
    const updated = [...form.lessons];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    setForm({ ...form, lessons: updated });
    setOpenLessonIdx(idx + 1);
  };

  // Example helpers for a lesson
  const addExample = (lessonIdx) => {
    const updated = form.lessons.map((l, i) =>
      i === lessonIdx ? { ...l, examples: [...(l.examples || []), { urdu: '', poet: '', translation: '' }] } : l
    );
    setForm({ ...form, lessons: updated });
  };

  const updateExample = (lessonIdx, exIdx, field, value) => {
    const updated = form.lessons.map((l, i) =>
      i === lessonIdx ? {
        ...l,
        examples: l.examples.map((ex, j) => j === exIdx ? { ...ex, [field]: value } : ex),
      } : l
    );
    setForm({ ...form, lessons: updated });
  };

  const removeExample = (lessonIdx, exIdx) => {
    const updated = form.lessons.map((l, i) =>
      i === lessonIdx ? { ...l, examples: l.examples.filter((_, j) => j !== exIdx) } : l
    );
    setForm({ ...form, lessons: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const res = await api.put(`/courses/${editing}`, form);
        setCourses(prev => prev.map(c => (c._id || c.id) === editing ? (res.data.course || res.data) : c));
        setMsg('Updated!');
      } else {
        const res = await api.post('/courses', form);
        setCourses(prev => [...prev, res.data.course || res.data]);
        setMsg('Added!');
      }
      setShowForm(false);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error.');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => (c._id || c.id) !== id));
      setMsg('Deleted.');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Error.'); setTimeout(() => setMsg(''), 3000); }
  };

  return (
    <div className="min-h-screen bg-page-alt py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-accent text-sm mb-2 inline-block hover:underline">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-heading">Manage Courses</h1>
          </div>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 py-2 px-4 text-sm">
            <FiPlus className="w-4 h-4" /> Add Course
          </button>
        </div>

        {msg && <div className={msg.includes('Error') ? 'alert-error mb-4' : 'alert-success mb-4'}>{msg}</div>}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-thead">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">#</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">عنوان</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Order</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Lessons</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {courses.map((c, idx) => (
                  <tr key={c._id || c.id} className="hover:bg-hover transition-colors">
                    <td className="px-5 py-3 text-muted">{c.order || idx + 1}</td>
                    <td className="px-5 py-3 font-medium text-heading">{c.title}</td>
                    <td className="px-5 py-3 text-body" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}>{c.titleUrdu}</td>
                    <td className="px-5 py-3 text-muted">{c.order || 0}</td>
                    <td className="px-5 py-3 text-muted">{c.lessons?.length || 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-hover rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c._id || c.id)} className="p-1.5 text-red-600 hover:bg-hover rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-modal rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-theme">
                <h2 className="text-lg font-bold text-heading">{editing ? 'Edit Course' : 'Add Course'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-hover rounded-lg text-muted"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Title</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">عنوان (اردو)</label>
                    <input value={form.titleUrdu} onChange={e => setForm({ ...form, titleUrdu: e.target.value })} className="input-field" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="input-field" min="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-1">تفصیل (اردو)</label>
                  <textarea value={form.descriptionUrdu} onChange={e => setForm({ ...form, descriptionUrdu: e.target.value })} rows={3} className="input-field resize-none" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
                </div>

                {/* ── Lessons Section ─────────────────────────────────────── */}
                <div className="border border-theme rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-heading">
                      Lessons ({(form.lessons || []).length})
                    </h3>
                    <button type="button" onClick={addLesson} className="btn-gold flex items-center gap-1 py-1 px-3 text-xs">
                      <FiPlus className="w-3 h-3" /> Add Lesson
                    </button>
                  </div>

                  {(!form.lessons || form.lessons.length === 0) && (
                    <p className="text-muted text-xs text-center py-4">No lessons yet. Click "Add Lesson" to get started.</p>
                  )}

                  <div className="space-y-2">
                    {(form.lessons || []).map((lesson, idx) => (
                      <div key={idx} className="border border-theme rounded-lg overflow-hidden">
                        {/* Lesson Header (clickable) */}
                        <button
                          type="button"
                          onClick={() => setOpenLessonIdx(openLessonIdx === idx ? -1 : idx)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-hover transition-colors"
                        >
                          <div className="flex items-center gap-2 text-left min-w-0">
                            <span className="w-6 h-6 bg-tag text-tag rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-medium text-heading truncate">
                              {lesson.title || lesson.titleUrdu || `Lesson ${idx + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {idx > 0 && (
                              <span onClick={(e) => { e.stopPropagation(); moveLessonUp(idx); }} className="p-1 text-muted hover:text-accent cursor-pointer">
                                <FiChevronUp className="w-3.5 h-3.5" />
                              </span>
                            )}
                            {idx < form.lessons.length - 1 && (
                              <span onClick={(e) => { e.stopPropagation(); moveLessonDown(idx); }} className="p-1 text-muted hover:text-accent cursor-pointer">
                                <FiChevronDown className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <span
                              onClick={(e) => { e.stopPropagation(); removeLesson(idx); }}
                              className="p-1 text-red-500 hover:text-red-400 cursor-pointer"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </span>
                            {openLessonIdx === idx
                              ? <FiChevronUp className="w-4 h-4 text-accent" />
                              : <FiChevronDown className="w-4 h-4 text-muted" />}
                          </div>
                        </button>

                        {/* Lesson Expanded Body */}
                        {openLessonIdx === idx && (
                          <div className="px-4 pb-4 pt-2 border-t border-theme space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-body mb-1">Title</label>
                                <input
                                  value={lesson.title}
                                  onChange={e => updateLesson(idx, 'title', e.target.value)}
                                  className="input-field text-sm"
                                  placeholder="Lesson title"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-body mb-1">عنوان (اردو)</label>
                                <input
                                  value={lesson.titleUrdu}
                                  onChange={e => updateLesson(idx, 'titleUrdu', e.target.value)}
                                  className="input-field text-sm"
                                  dir="rtl"
                                  style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                                  placeholder="سبق کا عنوان"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-body mb-1">Content</label>
                              <textarea
                                value={lesson.content}
                                onChange={e => updateLesson(idx, 'content', e.target.value)}
                                rows={3}
                                className="input-field text-sm resize-none"
                                placeholder="Lesson content..."
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-body mb-1">مواد (اردو)</label>
                              <textarea
                                value={lesson.contentUrdu}
                                onChange={e => updateLesson(idx, 'contentUrdu', e.target.value)}
                                rows={3}
                                className="input-field text-sm resize-none"
                                dir="rtl"
                                style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                                placeholder="سبق کا مواد..."
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-body mb-1">Duration</label>
                              <input
                                value={lesson.duration}
                                onChange={e => updateLesson(idx, 'duration', e.target.value)}
                                className="input-field text-sm"
                                placeholder="e.g. 30 min"
                              />
                            </div>

                            {/* Examples */}
                            <div className="border border-theme rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-heading">Examples ({(lesson.examples || []).length})</label>
                                <button type="button" onClick={() => addExample(idx)} className="text-xs text-accent hover:underline flex items-center gap-1">
                                  <FiPlus className="w-3 h-3" /> Add
                                </button>
                              </div>
                              {(!lesson.examples || lesson.examples.length === 0) && (
                                <p className="text-muted text-xs text-center py-2">No examples</p>
                              )}
                              <div className="space-y-2">
                                {(lesson.examples || []).map((ex, exIdx) => (
                                  <div key={exIdx} className="bg-hover rounded-lg p-2.5 space-y-2">
                                    <div className="flex gap-2">
                                      <input
                                        value={typeof ex === 'string' ? ex : (ex.urdu || '')}
                                        onChange={e => {
                                          if (typeof ex === 'string') {
                                            const updated = form.lessons.map((l, i) =>
                                              i === idx ? { ...l, examples: l.examples.map((x, j) => j === exIdx ? e.target.value : x) } : l
                                            );
                                            setForm({ ...form, lessons: updated });
                                          } else {
                                            updateExample(idx, exIdx, 'urdu', e.target.value);
                                          }
                                        }}
                                        className="input-field text-xs flex-1"
                                        dir="rtl"
                                        style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                                        placeholder="اردو مثال"
                                      />
                                      <button type="button" onClick={() => removeExample(idx, exIdx)} className="p-1 text-red-500 hover:text-red-400 flex-shrink-0">
                                        <FiTrash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                    {typeof ex === 'object' && (
                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          value={ex.poet || ''}
                                          onChange={e => updateExample(idx, exIdx, 'poet', e.target.value)}
                                          className="input-field text-xs"
                                          placeholder="Poet name"
                                        />
                                        <input
                                          value={ex.translation || ''}
                                          onChange={e => updateExample(idx, exIdx, 'translation', e.target.value)}
                                          className="input-field text-xs"
                                          placeholder="Translation"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 py-2 px-6 disabled:opacity-60">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck />} Save
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-theme-input text-muted rounded-lg text-sm font-medium hover:bg-hover transition-colors">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
