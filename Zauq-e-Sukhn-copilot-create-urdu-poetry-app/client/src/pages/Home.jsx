import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { poetsData } from '../data/poets';
import { poetryData } from '../data/poetry';
import { coursesData } from '../data/courses';
import PoetCard from '../components/PoetCard';
import SherCard from '../components/SherCard';
import CourseCard from '../components/CourseCard';

const StatCard = ({ number, label, labelUrdu }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-center p-6"
  >
    <div className="text-5xl font-bold text-yellow-400 mb-2">{number}</div>
    <div className="text-white/80 text-sm" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>{labelUrdu}</div>
    <div className="text-white/50 text-xs mt-1">{label}</div>
  </motion.div>
);

const Home = () => {
  const [poets, setPoets] = useState(poetsData.slice(0, 4));
  const [poetry, setPoetry] = useState(poetryData.filter(p => p.isFeatured).slice(0, 6));
  const [courses, setCourses] = useState(coursesData.slice(0, 3));
  const [todayPoem] = useState(poetryData[Math.floor(Math.random() * poetryData.length)]);

  useEffect(() => {
    api.get('/poets?limit=4').then(res => setPoets(res.data.poets || res.data)).catch(() => {});
    api.get('/poetry?featured=true&limit=6').then(res => setPoetry(res.data.poetry || res.data)).catch(() => {});
    api.get('/courses?limit=3').then(res => setCourses(res.data.courses || res.data)).catch(() => {});
  }, []);

  const featuredCouplet = {
    lines: ['ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے', 'بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے'],
    poet: 'مرزا غالب',
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pattern-bg">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-hero-circle-1 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-hero-circle-2 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-0 px-4 max-w-4xl mx-auto">
          {/* Title — Urdu RTL */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex justify-center"
          >
            <h1
              dir="rtl"
              className="text-6xl md:text-8xl font-bold text-hero-title animate-float"
              style={{
                fontFamily: "'Noto Nastaliq Urdu', serif",
                lineHeight: 2,
                paddingBottom: '0.5rem',
                paddingTop: '1rem',
              }}
            >
              ذوقِ سخن
            </h1>
          </motion.div>

          {/* Subtitle — Urdu RTL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <p
              dir="rtl"
              className="text-2xl md:text-3xl text-hero-subtitle text-center"
              style={{
                fontFamily: "'Noto Nastaliq Urdu', serif",
                lineHeight: 2.2,
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              اردو شاعری کی دنیا میں خوش آمدید
            </p>
          </motion.div>

          {/* Subtitle — English LTR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full flex justify-center"
          >
            <p
              dir="ltr"
              className="text-hero-english text-lg text-center"
              style={{
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.8,
                marginTop: '0.25rem',
                marginBottom: '2.5rem',
              }}
            >
              Explore, Learn &amp; Discover the Art of Urdu Poetry
            </p>
          </motion.div>

          {/* Floating Couplet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hero-glass rounded-2xl p-6 mb-10 mx-auto max-w-2xl"
          >
            {featuredCouplet.lines.map((line, i) => (
              <p
                key={i}
                className="text-hero-couplet py-1 text-lg md:text-xl border-b border-hero-line last:border-0"
                style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl', lineHeight: 2.5 }}
              >
                {line}
              </p>
            ))}
            <p className="text-hero-poet text-right mt-2 text-sm" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
              — {featuredCouplet.poet}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/poetry" className="btn-gold px-8 py-3 text-base">
              <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>شاعری دیکھیں</span>
            </Link>
            <Link to="/courses" className="px-8 py-3 text-base border-2 border-hero-btn text-hero-btn hover:bg-accent hover:text-white transition-all rounded-lg font-semibold">
              <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>کورسز</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-hero-scroll rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-hero-scroll rounded-full" />
          </div>
        </div>
      </section>

      {/* Poetry of the Day */}
      <section className="py-16 bg-page-alt">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <span className="text-accent text-sm font-semibold uppercase tracking-wider">Daily Poetry</span>
              <h2
                dir="rtl"
                className="text-3xl font-bold text-heading mt-1"
                style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2.2 }}
              >
                آج کا شعر
              </h2>
            </div>
            <div className="card-gold p-8 text-center">
              <div className="bg-sher-area rounded-xl p-6 mb-4 border border-sher" dir="rtl">
                {(todayPoem.contentLines || []).map((line, i) => (
                  <p
                    key={i}
                    className="py-2 text-sher border-b border-dashed border-sher last:border-0"
                    style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: '1.5rem', lineHeight: 2.5 }}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <p className="text-accent font-semibold" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: '1.1rem' }}>
                — {todayPoem.poetUrdu || todayPoem.poetName}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Poets */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-10"
          >
            <h2 dir="rtl" className="text-3xl font-bold text-heading" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2.2 }}>
              مشہور شعراء
            </h2>
            <Link to="/poets" className="btn-outline-gold text-sm py-1.5 px-4">
              <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>سب شعراء</span>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {poets.map((poet, idx) => (
              <motion.div
                key={poet.id || poet._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <PoetCard poet={poet} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-[#1a1a2e] via-[#800020] to-[#1a1a2e]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/60 text-lg mb-10"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2.2 }}
          >
            ہمارا خزانہ
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-white/10">
            <StatCard number="8+" label="Poets" labelUrdu="شعراء" />
            <StatCard number="30+" label="Poems" labelUrdu="اشعار" />
            <StatCard number="10" label="Courses" labelUrdu="کورسز" />
            <StatCard number="40+" label="Qafiya" labelUrdu="قوافی" />
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16 bg-page-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <h2 dir="rtl" className="text-3xl font-bold text-heading" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2.2 }}>
              تعلیمی کورسز
            </h2>
            <Link to="/courses" className="btn-outline-gold text-sm py-1.5 px-4">
              <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>سب کورسز</span>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id || course._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Poetry */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <h2 dir="rtl" className="text-3xl font-bold text-heading" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2.2 }}>
              منتخب اشعار
            </h2>
            <Link to="/poetry" className="btn-outline-gold text-sm py-1.5 px-4">
              <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>مزید شاعری</span>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poetry.map((poem, idx) => (
              <motion.div
                key={poem.id || poem._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <SherCard poem={poem} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
