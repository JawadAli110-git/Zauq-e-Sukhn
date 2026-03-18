import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { poetsData } from '../data/poets';
import PoetCard from '../components/PoetCard';
import { FiSearch } from 'react-icons/fi';

const Poets = () => {
  const [poets, setPoets] = useState(poetsData);
  const [filtered, setFiltered] = useState(poetsData);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/poets').then(res => {
      const data = res.data.poets || res.data;
      if (Array.isArray(data) && data.length > 0) {
        setPoets(data);
        setFiltered(data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(poets.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.nameUrdu && p.nameUrdu.includes(search)) ||
      (p.era && p.era.toLowerCase().includes(q))
    ));
  }, [search, poets]);

  return (
    <div className="min-h-screen bg-page-alt py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            شعراء کرام
          </h1>
          <p dir="ltr" className="text-muted text-lg text-center mt-2" style={{ lineHeight: 1.6 }}>
            Masters of Urdu Poetry
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-600 mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-10 relative"
        >
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search poets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16 text-lg" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
            کوئی شاعر نہیں ملا
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((poet, idx) => (
              <motion.div
                key={poet.id || poet._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <PoetCard poet={poet} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Poets;
