import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiBook, FiClock } from 'react-icons/fi';
import api from '../utils/api';
import { coursesData } from '../data/courses';
import Loading from '../components/Loading';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [openLesson, setOpenLesson] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = coursesData.find(c => String(c.id) === String(id));
    api.get(`/courses/${id}`)
      .then(res => setCourse(res.data.course || res.data))
      .catch(() => setCourse(fallback))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!course) return (
    <div className="text-center py-20">
      <p className="text-muted text-lg">Course not found</p>
      <Link to="/courses" className="btn-gold mt-4 inline-block">Back to Courses</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-page-alt py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/courses" className="inline-flex items-center gap-2 text-accent hover:opacity-80 mb-8 text-sm font-medium">
          ← Back to Courses
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#1a1a2e] to-[#2d1a00] rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">
              {course.order}
            </div>
            <span className="bg-yellow-600/30 text-yellow-300 text-sm px-3 py-1 rounded-full border border-yellow-500/40">
              {course.duration}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl', textAlign: 'right' }}>
            {course.titleUrdu}
          </h1>
          <p className="text-gray-300 text-xl mb-4">{course.title}</p>
          <p className="text-gray-400 leading-relaxed" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2 }}>
            {course.descriptionUrdu}
          </p>
          <div className="mt-4 flex gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1"><FiBook className="w-4 h-4" /> {course.lessons?.length || 0} Lessons</span>
            <span className="flex items-center gap-1"><FiClock className="w-4 h-4" /> {course.duration}</span>
          </div>
        </motion.div>

        {/* Lessons Accordion */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-heading mb-4" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
            اسباق
          </h2>
          {(course.lessons || []).map((lesson, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpenLesson(openLesson === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-hover transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-tag text-tag rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-heading text-sm" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                      {lesson.titleUrdu || lesson.title}
                    </p>
                    {lesson.titleUrdu && <p className="text-muted text-xs mt-0.5">{lesson.title}</p>}
                  </div>
                </div>
                {openLesson === idx ? <FiChevronUp className="w-5 h-5 text-accent flex-shrink-0" /> : <FiChevronDown className="w-5 h-5 text-muted flex-shrink-0" />}
              </button>

              {openLesson === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-5 border-t border-theme"
                >
                  <p className="text-body leading-relaxed mt-4 text-sm">
                    {lesson.content}
                  </p>
                  {lesson.examples && lesson.examples.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Examples</p>
                      <div className="space-y-2">
                        {lesson.examples.map((ex, i) => (
                          <div key={i} className="bg-sher-area rounded-lg px-4 py-3" dir="rtl">
                            <p className="text-body" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2 }}>
                              {typeof ex === 'string' ? ex : ex.urdu || ex.text || ''}
                            </p>
                            {typeof ex === 'object' && ex.poet && (
                              <p className="text-muted text-xs mt-1">— {ex.poet}</p>
                            )}
                            {typeof ex === 'object' && ex.translation && (
                              <p className="text-muted text-xs mt-0.5 italic" dir="ltr">{ex.translation}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
