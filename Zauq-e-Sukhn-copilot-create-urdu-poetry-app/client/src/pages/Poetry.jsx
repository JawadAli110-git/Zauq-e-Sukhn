import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { poetryData } from '../data/poetry';
import SherCard from '../components/SherCard';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const TYPES = ['all', 'ghazal', 'nazm', 'sher', 'qasida'];
const PAGE_SIZE = 12;

const Poetry = () => {
  const { user, loading: authLoading } = useAuth();
  const [poems, setPoems] = useState(poetryData);
  const [filtered, setFiltered] = useState(poetryData);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading) {
      api.get('/poetry?limit=100').then(res => {
        const data = res.data.poetry || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setPoems(data);
        }
      }).catch(() => {});
    }
  }, [authLoading]);

  useEffect(() => {
    let result = poems;
    if (typeFilter !== 'all') result = result.filter(p => p.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        (p.poetName || '').toLowerCase().includes(q) ||
        (p.poetUrdu || '').includes(search) ||
        (p.contentLines || []).some(l => l.includes(search) || l.toLowerCase().includes(q)) ||
        (p.titleUrdu || '').includes(search)
      );
    }
    setFiltered(result);
    setPage(1);
  }, [search, typeFilter, poems]);

  if (authLoading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen bg-page-alt flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-heading mb-4">Access Restricted</h1>
          <p className="text-muted mb-6">
            Please log in or sign up to explore our collection of Urdu poetry.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-gold px-6 py-2 inline-block">
              Log In
            </Link>
            <Link to="/register" className="btn-outline-gold px-6 py-2 inline-block">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div className="min-h-screen bg-page-alt py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-12"
        >
          <h1
            dir="rtl"
            className="text-4xl sm:text-5xl font-bold text-heading text-center"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2 }}
          >
            اردو شاعری
          </h1>
          <p dir="ltr" className="text-muted text-center mt-2" style={{ lineHeight: 1.6 }}>
            A Treasury of Urdu Verses
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-600 mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search poetry or poet..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all filter-btn ${
                  typeFilter === t ? 'active' : ''
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted mb-6">
          Showing {paginated.length} of {filtered.length} poems
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16 text-lg" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
            کوئی شاعری نہیں ملی
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((poem, idx) => (
                <motion.div
                  key={poem.id || poem._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (idx % PAGE_SIZE) * 0.03 }}
                >
                  <SherCard poem={poem} />
                </motion.div>
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-10">
                <button onClick={() => setPage(p => p + 1)} className="btn-gold px-8 py-3">
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Poetry;
