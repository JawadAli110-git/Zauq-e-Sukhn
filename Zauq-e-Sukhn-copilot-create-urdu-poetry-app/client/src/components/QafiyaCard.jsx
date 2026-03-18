import { motion } from 'framer-motion';

const QafiyaCard = ({ qafiya }) => {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 15px 30px rgba(212,175,55,0.12)' }}
      transition={{ duration: 0.2 }}
      className="card p-5 flex flex-col gap-3"
    >
      {/* Word */}
      <div className="flex items-start justify-between gap-2">
        <div dir="rtl" className="flex-1">
          <span
            className="text-3xl font-bold text-accent"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
          >
            {qafiya.wordUrdu || qafiya.word}
          </span>
        </div>
        <span className="shrink-0 bg-tag text-tag text-xs font-bold px-2 py-1 rounded-full border border-theme-accent">
          ۔{qafiya.endingSound}
        </span>
      </div>

      {/* Meaning */}
      <div className="space-y-1">
        <p className="text-body text-sm font-medium">{qafiya.meaning}</p>
        {qafiya.meaningUrdu && (
          <p
            className="text-muted text-sm"
            dir="rtl"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
          >
            {qafiya.meaningUrdu}
          </p>
        )}
      </div>

      {/* Example */}
      {qafiya.examples && qafiya.examples.length > 0 && (
        <div className="bg-sher-area rounded-md px-3 py-2" dir="rtl">
          {qafiya.examples.map((ex, i) => {
            const sherText = typeof ex === 'string' ? ex : ex.sher || ex.urdu || '';
            const poetName = typeof ex === 'object' && ex !== null ? (ex.poet || '') : '';
            return (
              <div key={i} className={i > 0 ? 'mt-2 pt-2 border-t border-sher' : ''}>
                <p
                  className="text-sher text-sm italic"
                  style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2 }}
                >
                  {sherText}
                </p>
                {poetName && (
                  <p className="text-xs text-accent mt-0.5"
                     style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                    — {poetName}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Related Words */}
      {qafiya.relatedWords && qafiya.relatedWords.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1" dir="rtl">
          {qafiya.relatedWords.map((word, idx) => (
            <span
              key={idx}
              className="bg-hover text-muted text-xs px-2 py-1 rounded-full"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default QafiyaCard;
