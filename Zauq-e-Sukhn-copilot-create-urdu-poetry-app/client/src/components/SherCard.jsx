import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const typeColors = {
  ghazal: 'bg-tag text-tag',
  nazm: 'bg-tag text-tag',
  sher: 'bg-tag text-tag',
  qasida: 'bg-tag text-tag',
  marsiya: 'bg-tag text-tag',
};

const SherCard = ({ poem, onFavorite }) => {
  const { user } = useAuth();
  const badgeClass = typeColors[poem.type] || typeColors.sher;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="card-gold p-6 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeClass}`}>
          {poem.type}
        </span>
        {user && onFavorite && (
          <button
            onClick={() => onFavorite(poem.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <FiHeart className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Poetry Lines */}
      <div className="bg-sher-area rounded-lg p-4 border border-sher" dir="rtl">
        {(poem.contentLines || []).map((line, idx) => (
          <p
            key={idx}
            className="py-1 text-sher border-b border-dashed border-sher last:border-0"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: '1.35rem', lineHeight: 2.5 }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Poet Name */}
      <div className="flex items-center justify-end gap-2 mt-1">
        <span className="text-muted text-xs">—</span>
        <span
          className="text-accent font-semibold"
          style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: '1rem' }}
        >
          {poem.poetUrdu || poem.poetName}
        </span>
      </div>
    </motion.div>
  );
};

export default SherCard;
