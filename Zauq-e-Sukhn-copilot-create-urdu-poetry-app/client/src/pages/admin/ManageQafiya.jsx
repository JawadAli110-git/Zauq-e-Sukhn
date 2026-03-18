import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { qafiyaData } from '../../data/qafiya';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

const emptyEntry = { word: '', wordUrdu: '', meaning: '', meaningUrdu: '', endingSound: '', examples: [''], relatedWords: [''] };

const ManageQafiya = () => {
  const [entries, setEntries] = useState(qafiyaData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyEntry);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/qafiya?limit=100').then(res => {
      const data = res.data.qafiya || res.data;
      if (Array.isArray(data) && data.length > 0) setEntries(data);
    }).catch(() => {});
  }, []);

  const openAdd = () => { setForm(emptyEntry); setEditing(null); setShowForm(true); };
  const openEdit = (q) => { setForm({ ...q, examples: q.examples || [''], relatedWords: q.relatedWords || [''] }); setEditing(q._id || q.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const res = await api.put(`/qafiya/${editing}`, form);
        setEntries(prev => prev.map(q => (q._id || q.id) === editing ? (res.data.qafiya || res.data) : q));
        setMsg('Updated!');
      } else {
        const res = await api.post('/qafiya', form);
        setEntries(prev => [...prev, res.data.qafiya || res.data]);
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
    if (!window.confirm('Delete?')) return;
    try {
      await api.delete(`/qafiya/${id}`);
      setEntries(prev => prev.filter(q => (q._id || q.id) !== id));
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
            <h1 className="text-2xl font-bold text-heading">Manage Qafiya</h1>
          </div>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 py-2 px-4 text-sm">
            <FiPlus className="w-4 h-4" /> Add Entry
          </button>
        </div>

        {msg && <div className={msg.includes('Error') ? 'alert-error mb-4' : 'alert-success mb-4'}>{msg}</div>}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-thead">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">#</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Word</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">لفظ</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Meaning</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Ending</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {entries.map((q, idx) => (
                  <tr key={q._id || q.id} className="hover:bg-hover transition-colors">
                    <td className="px-5 py-3 text-muted">{idx + 1}</td>
                    <td className="px-5 py-3 text-heading">{q.word}</td>
                    <td className="px-5 py-3 text-body" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}>{q.wordUrdu}</td>
                    <td className="px-5 py-3 text-muted">{q.meaning}</td>
                    <td className="px-5 py-3"><span className="tag">{q.endingSound}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(q)} className="p-1.5 text-blue-600 hover:bg-hover rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(q._id || q.id)} className="p-1.5 text-red-600 hover:bg-hover rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
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
                <h2 className="text-lg font-bold text-heading">{editing ? 'Edit Entry' : 'Add Qafiya Entry'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-hover rounded-lg text-muted"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Word</label>
                    <input value={form.word} onChange={e => setForm({ ...form, word: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">لفظ (اردو)</label>
                    <input value={form.wordUrdu} onChange={e => setForm({ ...form, wordUrdu: e.target.value })} className="input-field" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Meaning</label>
                    <input value={form.meaning} onChange={e => setForm({ ...form, meaning: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Ending Sound</label>
                    <input value={form.endingSound} onChange={e => setForm({ ...form, endingSound: e.target.value })} className="input-field" placeholder="م، ہ، ی" dir="rtl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-1">معنی (اردو)</label>
                  <input value={form.meaningUrdu} onChange={e => setForm({ ...form, meaningUrdu: e.target.value })} className="input-field" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-1">Example</label>
                  <input value={form.examples?.[0] || ''} onChange={e => setForm({ ...form, examples: [e.target.value] })} className="input-field" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
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

export default ManageQafiya;
