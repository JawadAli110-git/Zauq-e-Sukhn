import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', labelUrdu: 'صفحہ اول' },
    { to: '/poets', label: 'Poets', labelUrdu: 'شعراء' },
    { to: '/poetry', label: 'Poetry', labelUrdu: 'شاعری' },
    { to: '/courses', label: 'Courses', labelUrdu: 'کورسز' },
    { to: '/qafiya', label: 'Qafiya', labelUrdu: 'قافیہ' },
  ];

  const linkClass = ({ isActive }) =>
    `font-medium transition-colors duration-200 px-1 pb-1 border-b-2 ${
      isActive
        ? 'text-accent border-[var(--accent-gold)]'
        : 'text-body hover:text-accent border-transparent'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-nav backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <span
              className="text-2xl font-bold text-accent"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
            >
              ذوقِ سخن
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                <span className="text-sm" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                  {link.labelUrdu}
                </span>
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                <span className="text-sm">Admin</span>
              </NavLink>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-body flex items-center gap-1">
                  <FiUser className="w-4 h-4" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-body hover:text-accent transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-gold text-sm py-1.5 px-4">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-body"
            >
              {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-theme px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block py-2 text-base font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-body'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>{link.labelUrdu}</span>
              <span className="ml-2 text-xs text-gray-500">({link.label})</span>
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className="block py-2 text-base font-medium text-yellow-600"
              onClick={() => setMenuOpen(false)}
            >
              Admin Dashboard
            </NavLink>
          )}
          <div className="pt-3 border-t border-theme">
            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-muted">{user.name}</p>
                <button
                  onClick={handleLogout}
                  className="text-red-600 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-body"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gold text-sm py-1.5 px-4"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
