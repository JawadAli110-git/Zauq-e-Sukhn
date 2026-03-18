import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { poetsData } from '../../data/poets';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

const emptyPoet = { name: '', nameUrdu: '', bio: '', bioUrdu: '', era: '', style: '', styleUrdu: '', imageUrl: '' };

const ManagePoets = () => {
  const [poets, setPoets] = useState(poetsData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPoet);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/poets').then(res => {
      const data = res.data.poets || res.data;
      if (Array.isArray(data) && data.length > 0) setPoets(data);
    }).catch(() => {});
  }, []);

  const openAdd = () => { setForm(emptyPoet); setEditing(null); setShowForm(true); };
  const openEdit = (poet) => { setForm({ ...poet }); setEditing(poet._id || poet.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const res = await api.put(`/poets/${editing}`, form);
        setPoets(prev => prev.map(p => (p._id || p.id) === editing ? (res.data.poet || res.data) : p));
        setMsg('Poet updated successfully!');
      } else {
        const res = await api.post('/poets', form);
        setPoets(prev => [...prev, res.data.poet || res.data]);
        setMsg('Poet added successfully!');
      }
      setShowForm(false);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving poet.');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this poet?')) return;
    try {
      await api.delete(`/poets/${id}`);
      setPoets(prev => prev.filter(p => (p._id || p.id) !== id));
      setMsg('Deleted successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Error deleting poet.');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-page-alt py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-accent text-sm mb-2 inline-block hover:underline">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-heading">Manage Poets</h1>
          </div>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 py-2 px-4 text-sm">
            <FiPlus className="w-4 h-4" /> Add Poet
          </button>
        </div>

        {msg && (
          <div className={msg.includes('Error') ? 'alert-error mb-4' : 'alert-success mb-4'}>
            {msg}
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-thead">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">#</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">اردو نام</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Era</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Style</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {poets.map((poet, idx) => (
                  <tr key={poet._id || poet.id} className="hover:bg-hover transition-colors">
                    <td className="px-5 py-3 text-muted">{idx + 1}</td>
                    <td className="px-5 py-3 font-medium text-heading">{poet.name}</td>
                    <td className="px-5 py-3 text-body" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}>{poet.nameUrdu}</td>
                    <td className="px-5 py-3 text-muted">{poet.era}</td>
                    <td className="px-5 py-3 text-muted">{poet.style}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(poet)} className="p-1.5 text-blue-600 hover:bg-hover rounded-lg transition-colors">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(poet._id || poet.id)} className="p-1.5 text-red-600 hover:bg-hover rounded-lg transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-modal rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-theme">
                <h2 className="text-lg font-bold text-heading">{editing ? 'Edit Poet' : 'Add New Poet'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-hover rounded-lg text-muted"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Name (English)</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="e.g. Mirza Ghalib" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">نام (اردو)</label>
                    <input value={form.nameUrdu} onChange={e => setForm({ ...form, nameUrdu: e.target.value })} className="input-field" dir="rtl" placeholder="مرزا غالب" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Era</label>
                    <input value={form.era} onChange={e => setForm({ ...form, era: e.target.value })} className="input-field" placeholder="1797–1869" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-1">Style</label>
                    <input value={form.style} onChange={e => setForm({ ...form, style: e.target.value })} className="input-field" placeholder="Ghazal, Philosophical" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-1">Bio (English)</label>
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-1">سوانح (اردو)</label>
                  <textarea value={form.bioUrdu} onChange={e => setForm({ ...form, bioUrdu: e.target.value })} rows={3} className="input-field resize-none" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-1">Image URL</label>
                  <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="input-field" placeholder="https://..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 py-2 px-6 disabled:opacity-60">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck />}
                    {editing ? 'Update' : 'Add'} Poet
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-theme-input text-muted rounded-lg hover:bg-hover text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePoets;
