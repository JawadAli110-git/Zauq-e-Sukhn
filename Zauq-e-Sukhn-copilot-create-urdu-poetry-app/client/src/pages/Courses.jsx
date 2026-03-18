import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { coursesData } from '../data/courses';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const Courses = () => {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState(coursesData);

  useEffect(() => {
    if (!authLoading) {
      api.get('/courses').then(res => {
        const data = res.data.courses || res.data;
        if (Array.isArray(data) && data.length > 0) setCourses(data);
      }).catch(() => {});
    }
  }, [authLoading]);

  if (authLoading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen bg-page-alt flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-heading mb-4">Access Restricted</h1>
          <p className="text-muted mb-6">
            Please log in or sign up to access our premium courses.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-gold px-6 py-2 inline-block">
              Log In
            </Link>
            <Link to="/register" className="px-6 py-2 border border-[var(--accent)] text-accent hover:bg-hover rounded-lg font-medium inline-block">
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
            تعلیمی کورسز
          </h1>
          <p dir="ltr" className="text-muted text-center mt-2" style={{ lineHeight: 1.6 }}>
            Learn Urdu Poetry — From Basics to Mastery
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-600 mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id || course._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
