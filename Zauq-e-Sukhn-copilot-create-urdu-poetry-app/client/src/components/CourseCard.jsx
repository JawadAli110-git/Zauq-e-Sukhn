import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiClock } from 'react-icons/fi';

const CourseCard = ({ course }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(212,175,55,0.12)' }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-600 to-amber-700 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
            {course.order}
          </div>
          <FiBook className="w-6 h-6 opacity-80" />
        </div>
        <h3
          className="mt-3 text-xl font-bold leading-snug"
          style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl', textAlign: 'right' }}
        >
          {course.titleUrdu}
        </h3>
        <p className="text-yellow-100 text-sm mt-1">{course.title}</p>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <p
          className="text-muted text-sm leading-relaxed flex-1 line-clamp-3"
          dir="rtl"
          style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
        >
          {course.descriptionUrdu}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FiClock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <FiBook className="w-3.5 h-3.5" />
            {course.lessons?.length || 0} lessons
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-theme">
          <Link
            to={`/courses/${course.id}`}
            className="btn-gold w-full text-center block text-sm py-2"
          >
            <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>پڑھنا شروع کریں</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
