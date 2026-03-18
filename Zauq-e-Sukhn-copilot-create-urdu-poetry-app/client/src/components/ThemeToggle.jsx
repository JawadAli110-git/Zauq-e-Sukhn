import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-card hover:bg-hover transition-colors duration-200 border border-theme"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FiSun className="w-5 h-5 text-accent" />
      ) : (
        <FiMoon className="w-5 h-5 text-heading" />
      )}
    </button>
  );
};

export default ThemeToggle;
