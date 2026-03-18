import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { poetryData } from '../../data/poetry';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiMinus } from 'react-icons/fi';

const emptyPoem = { type: 'sher', title: '', titleUrdu: '', poetName: '', poetUrdu: '', contentLines: ['', ''], isFeatured: false };

const ManagePoetry = () => {
  const [poems, setPoems] = useState(poetryData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPoem);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/poetry?limit=100').then(res => {
      const data = res.data.poetry || res.data;
      if (Array.isArray(data) && data.length > 0) setPoems(data);
    }).catch(() => {});
  }, []);

  const openAdd = () => { setForm({ ...emptyPoem, contentLines: ['', ''] }); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      ...p,
      contentLines: (p.contentLines && p.contentLines.length > 0) ? [...p.contentLines] : ['', ''],
      poetName: p.poetName || p.poet?.name || '',
      poetUrdu: p.poetUrdu || p.poet?.nameUrdu || '',
    });
    setEditing(p._id || p.id);
    setShowForm(true);
  };

  const handleLineChange = (idx, val) => {
    const lines = [...(form.contentLines || [])];
    lines[idx] = val;
    setForm({ ...form, contentLines: lines });
  };

  const addLine = () => {
    setForm({ ...form, contentLines: [...(form.contentLines || []), ''] });
  };

  const removeLine = (idx) => {
    const lines = [...(form.contentLines || [])];
    if (lines.length <= 2) return; // keep minimum 2 lines
    lines.splice(idx, 1);
    setForm({ ...form, contentLines: lines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Filter out empty lines but keep at least the non-empty ones
    const cleanLines = (form.contentLines || []).filter(l => l && l.trim());
    if (cleanLines.length === 0) {
      setMsg('Please enter at least one line.');
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    const payload = {
      ...form,
      contentLines: cleanLines,
      content: cleanLines.join('\n'),
    };
    try {
      if (editing) {
        const res = await api.put(`/poetry/${editing}`, payload);
        setPoems(prev => prev.map(p => (p._id || p.id) === editing ? (res.data.poem || res.data) : p));
        setMsg('Updated successfully!');
      } else {
        const res = await api.post('/poetry', payload);
        setPoems(prev => [...prev, res.data.poem || res.data]);
        setMsg('Added successfully!');
      }
      setShowForm(false);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving.');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this poem?')) return;
    try {
      await api.delete(`/poetry/${id}`);
      setPoems(prev => prev.filter(p => (p._id || p.id) !== id));
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
            <h1 className="text-2xl font-bold text-heading">Manage Poetry</h1>
          </div>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 py-2 px-4 text-sm">
            <FiPlus className="w-4 h-4" /> Add Poem
          </button>
        </div>

        {msg && <div className={msg.includes('Error') ? 'alert-error mb-4' : 'alert-success mb-4'}>{msg}</div>}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-thead">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">#</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Poet</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Featured</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {poems.map((p, idx) => (
                  <tr key={p._id || p.id} className="hover:bg-hover transition-colors">
                    <td className="px-5 py-3 text-muted">{idx + 1}</td>
                    <td className="px-5 py-3"><span className="tag">{p.type}</span></td>
                    <td className="px-5 py-3 text-heading">{p.titleUrdu || p.title}</td>
                    <td className="px-5 py-3 text-muted">{p.poetName}</td>
                    <td className="px-5 py-3">{p.isFeatured ? <span className="text-green-600 text-xs font-medium">Yes</span> : <span className="text-muted text-xs">No</span>}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-hover rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p._id || p.id)} className="p-1.5 text-red-600 hover:bg-hover rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-modal rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-theme">
                <h2 className="text-lg font-bold text-heading">{editing ? 'Edit Poem' : 'Add Poem'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-hover rounded-lg text-muted"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                      <option value="sher">Sher</option>
                      <option value="ghazal">Ghazal</option>
                      <option value="nazm">Nazm</option>
                      <option value="qasida">Qasida</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Title (Urdu)</label>
                    <input value={form.titleUrdu} onChange={e => setForm({ ...form, titleUrdu: e.target.value })} className="input-field" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Poet Name</label>
                    <input value={form.poetName} onChange={e => setForm({ ...form, poetName: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">شاعر (اردو)</label>
                    <input value={form.poetUrdu} onChange={e => setForm({ ...form, poetUrdu: e.target.value })} className="input-field" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-body">Content Lines</label>
                    <button
                      type="button"
                      onClick={addLine}
                      className="flex items-center gap-1 text-xs font-medium text-accent hover:opacity-80 px-2 py-1 rounded-md hover:bg-hover transition-colors"
                    >
                      <FiPlus className="w-3.5 h-3.5" /> Add Line
                    </button>
                  </div>
                  {(form.contentLines || []).map((line, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <span className="flex items-center text-xs text-muted w-6 shrink-0 justify-center">{idx + 1}</span>
                      <input
                        value={line}
                        onChange={e => handleLineChange(idx, e.target.value)}
                        className="input-field flex-1"
                        dir="rtl"
                        style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2 }}
                        placeholder={`مصرعہ ${idx + 1}`}
                      />
                      {(form.contentLines || []).length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="p-2 text-red-500 hover:bg-hover rounded-lg transition-colors shrink-0"
                          title="Remove line"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-yellow-600" />
                  <span className="text-sm text-body">Featured</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 py-2 px-6 disabled:opacity-60">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck />}
                    Save
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

export default ManagePoetry;
