import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PoetCard = ({ poet }) => {
  const initial = poet.nameUrdu ? poet.nameUrdu[0] : poet.name[0];

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(212,175,55,0.15)' }}
      transition={{ duration: 0.3 }}
      className="card card-gold overflow-hidden flex flex-col"
    >
      {/* Image / Placeholder */}
      <div className="relative h-52 bg-gradient-to-br from-yellow-800 to-amber-900 overflow-hidden">
        {poet.imageUrl ? (
          <img
            src={poet.imageUrl}
            alt={poet.name}
            className="w-full h-full object-cover object-top opacity-80"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 items-center justify-center"
          style={{ display: poet.imageUrl ? 'none' : 'flex' }}
        >
          <span
            className="text-6xl text-yellow-200 font-bold"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
          >
            {initial}
          </span>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Era badge */}
        <span className="absolute top-3 right-3 bg-yellow-600/90 text-white text-xs px-2 py-1 rounded-full">
          {poet.era}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3" dir="rtl">
          <h3
            className="text-2xl font-bold text-accent"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
          >
            {poet.nameUrdu}
          </h3>
          <p className="text-muted text-sm mt-1">{poet.name}</p>
        </div>

        <div className="mb-3">
          <span className="inline-block bg-tag text-tag text-xs px-2 py-1 rounded-full">
            {poet.styleUrdu || poet.style}
          </span>
        </div>

        <p
          className="text-muted text-sm leading-relaxed flex-1 line-clamp-3"
          dir="rtl"
          style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
        >
          {poet.bioUrdu}
        </p>

        <div className="mt-4 pt-4 border-t border-theme">
          <Link
            to={`/poets/${poet.id}`}
            className="btn-gold w-full text-center block text-sm py-2"
          >
            <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>مزید جانیں</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PoetCard;
