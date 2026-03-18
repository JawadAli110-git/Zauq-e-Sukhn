import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { qafiyaData } from '../data/qafiya';
import QafiyaCard from '../components/QafiyaCard';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const Qafiya = () => {
  const { user, loading: authLoading } = useAuth();
  const [qafiya, setQafiya] = useState(qafiyaData);
  const [filtered, setFiltered] = useState(qafiyaData);
  const [search, setSearch] = useState('');
  const [activeSound, setActiveSound] = useState('all');

  const endingSounds = useMemo(
    () => ['all', ...new Set(qafiya.map(q => q.endingSound))],
    [qafiya]
  );

  useEffect(() => {
    if (!authLoading) {
      api.get('/qafiya?limit=100').then(res => {
        const data = res.data.qafiya || res.data;
        if (Array.isArray(data) && data.length > 0) setQafiya(data);
      }).catch(() => {});
    }
  }, [authLoading]);

  useEffect(() => {
    let result = qafiya;
    if (activeSound !== 'all') result = result.filter(q => q.endingSound === activeSound);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        (item.word || '').toLowerCase().includes(q) ||
        (item.wordUrdu || '').includes(search) ||
        (item.meaning || '').toLowerCase().includes(q) ||
        (item.meaningUrdu || '').includes(search)
      );
    }
    setFiltered(result);
  }, [search, activeSound, qafiya]);

  if (authLoading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen bg-page-alt flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-heading mb-4">Access Restricted</h1>
          <p className="text-muted mb-6">
            Please log in or sign up to access the Qafiya dictionary.
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
            قافیہ ڈکشنری
          </h1>
          <p dir="ltr" className="text-muted text-center mt-2" style={{ lineHeight: 1.6 }}>
            Discover Rhyming Words for Urdu Poetry
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-600 mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search qafiya word or meaning..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Ending Sound Filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {endingSounds.map(sound => (
            <button
              key={sound}
              onClick={() => setActiveSound(sound)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all filter-btn ${
                activeSound === sound ? 'active' : ''
              }`}
            >
              {sound === 'all' ? 'All' : (
                <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>۔{sound}</span>
              )}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted mb-6 text-center">
          {filtered.length} entries found
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16 text-lg" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
            کوئی قافیہ نہیں ملا
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id || item._id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
              >
                <QafiyaCard qafiya={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Qafiya;
