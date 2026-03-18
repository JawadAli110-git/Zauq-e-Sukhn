import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { poetsData } from '../data/poets';
import SherCard from '../components/SherCard';
import Loading from '../components/Loading';

const PoetDetail = () => {
  const { id } = useParams();
  const [poet, setPoet] = useState(null);
  const [activeTab, setActiveTab] = useState('bio');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = poetsData.find(p => String(p.id) === String(id));
    api.get(`/poets/${id}`)
      .then(res => setPoet(res.data.poet || res.data))
      .catch(() => setPoet(fallback))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!poet) return (
    <div className="text-center py-20">
      <p className="text-muted text-lg" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>شاعر نہیں ملا</p>
      <Link to="/poets" className="btn-gold mt-4 inline-block">Back to Poets</Link>
    </div>
  );

  const ghazals = (poet.poetry || []).filter(p => p.type === 'ghazal');
  const nazms = (poet.poetry || []).filter(p => p.type === 'nazm');
  const ashaar = (poet.poetry || []).filter(p => p.type === 'sher');

  const tabs = [
    { key: 'bio', label: 'سوانح حیات', count: null },
    { key: 'ghazal', label: 'غزلیں', count: ghazals.length },
    { key: 'nazm', label: 'نظمیں', count: nazms.length },
    { key: 'sher', label: 'اشعار', count: ashaar.length },
  ];

  return (
    <div className="min-h-screen bg-page-alt py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/poets" className="inline-flex items-center gap-2 text-accent hover:opacity-80 mb-8 text-sm font-medium">
          ← Back to Poets
        </Link>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-[#1a1a2e] via-[#2d1a00] to-[#1a1a2e] p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Image */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-500 bg-gradient-to-br from-yellow-700 to-amber-900 flex-shrink-0">
                {poet.imageUrl ? (
                  <img src={poet.imageUrl} alt={poet.name} className="w-full h-full object-cover object-top" onError={e => e.target.style.display = 'none'} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl text-yellow-200 font-bold" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                      {(poet.nameUrdu || poet.name)[0]}
                    </span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="text-center md:text-right flex-1" dir="rtl">
                <h1 className="text-4xl font-bold text-yellow-400 mb-1" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                  {poet.nameUrdu || poet.name}
                </h1>
                <p className="text-gray-300 text-lg">{poet.name}</p>
                <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-end">
                  <span className="bg-yellow-600/30 text-yellow-300 text-sm px-3 py-1 rounded-full border border-yellow-600/50">
                    {poet.era}
                  </span>
                  <span className="bg-white/10 text-gray-300 text-sm px-3 py-1 rounded-full">
                    {poet.styleUrdu || poet.style}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTab === tab.key
                  ? 'filter-btn active shadow-md'
                  : 'filter-btn'
              }`}
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-tag text-tag'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'bio' && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-heading mb-6" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                سوانح حیات
              </h2>
              <p className="text-body leading-relaxed mb-4" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2 }}>
                {poet.bioUrdu || poet.bio}
              </p>
              {poet.bio && poet.bioUrdu && (
                <p className="text-muted leading-relaxed text-sm">{poet.bio}</p>
              )}
            </div>
          )}

          {activeTab === 'ghazal' && (
            <div>
              {ghazals.length === 0 ? (
                <p className="text-center text-muted py-12" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>کوئی غزل نہیں</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ghazals.map((poem, idx) => (
                    <SherCard key={idx} poem={{ ...poem, poetUrdu: poet.nameUrdu, poetName: poet.name }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'nazm' && (
            <div>
              {nazms.length === 0 ? (
                <p className="text-center text-muted py-12" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>کوئی نظم نہیں</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nazms.map((poem, idx) => (
                    <SherCard key={idx} poem={{ ...poem, poetUrdu: poet.nameUrdu, poetName: poet.name }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sher' && (
            <div>
              {ashaar.length === 0 ? (
                <p className="text-center text-muted py-12" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>کوئی شعر نہیں</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ashaar.map((poem, idx) => (
                    <SherCard key={idx} poem={{ ...poem, poetUrdu: poet.nameUrdu, poetName: poet.name }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PoetDetail;
