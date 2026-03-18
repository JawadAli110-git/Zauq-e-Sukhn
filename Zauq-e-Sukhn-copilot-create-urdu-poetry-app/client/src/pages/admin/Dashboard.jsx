import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { poetsData } from '../../data/poets';
import { poetryData } from '../../data/poetry';
import { coursesData } from '../../data/courses';
import { qafiyaData } from '../../data/qafiya';
import { FiUsers, FiBook, FiBookOpen, FiFeather, FiHash } from 'react-icons/fi';

const StatBox = ({ icon: Icon, label, value, color, to }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="card p-6"
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-3xl font-bold text-heading">{value}</p>
    <p className="text-muted text-sm mt-1">{label}</p>
    {to && (
      <Link to={to} className="mt-3 inline-block text-accent text-xs font-medium hover:underline">
        Manage →
      </Link>
    )}
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    poets: poetsData.length,
    poetry: poetryData.length,
    courses: coursesData.length,
    qafiya: qafiyaData.length,
    users: 0,
  });

  useEffect(() => {
    api.get('/admin/stats').then(res => {
      if (res.data) setStats(prev => ({ ...prev, ...res.data }));
    }).catch(() => {});
  }, []);

  const actions = [
    { to: '/admin/poets', label: 'Manage Poets', labelUrdu: 'شعراء', icon: FiFeather },
    { to: '/admin/poetry', label: 'Manage Poetry', labelUrdu: 'شاعری', icon: FiBook },
    { to: '/admin/courses', label: 'Manage Courses', labelUrdu: 'کورسز', icon: FiBookOpen },
    { to: '/admin/qafiya', label: 'Manage Qafiya', labelUrdu: 'قافیہ', icon: FiHash },
  ];

  return (
    <div className="min-h-screen bg-page-alt py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold text-heading">Admin Dashboard</h1>
          <p className="text-muted mt-1">Manage all content for ذوقِ سخن</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
          <StatBox icon={FiFeather} label="Total Poets" value={stats.poets} color="bg-yellow-500" to="/admin/poets" />
          <StatBox icon={FiBook} label="Total Poems" value={stats.poetry} color="bg-purple-500" to="/admin/poetry" />
          <StatBox icon={FiBookOpen} label="Courses" value={stats.courses} color="bg-blue-500" to="/admin/courses" />
          <StatBox icon={FiHash} label="Qafiya Entries" value={stats.qafiya} color="bg-green-500" to="/admin/qafiya" />
          <StatBox icon={FiUsers} label="Users" value={stats.users || 'N/A'} color="bg-red-500" />
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-heading mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map(action => (
            <Link
              key={action.to}
              to={action.to}
              className="card p-5 flex flex-col items-center gap-3 hover:border-yellow-400 transition-colors group"
            >
              <div className="w-12 h-12 bg-tag rounded-xl flex items-center justify-center group-hover:opacity-80 transition-colors">
                <action.icon className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm font-semibold text-body text-center">{action.label}</p>
              <p className="text-xs text-muted" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>{action.labelUrdu}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
