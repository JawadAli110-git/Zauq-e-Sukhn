import { Link } from 'react-router-dom';

const Footer = () => {
  const links = [
    { to: '/', label: 'صفحہ اول' },
    { to: '/poets', label: 'شعراء' },
    { to: '/poetry', label: 'شاعری' },
    { to: '/courses', label: 'کورسز' },
    { to: '/qafiya', label: 'قافیہ' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-navy to-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div className="text-center md:text-right">
            <h3
              className="text-3xl font-bold text-yellow-400 mb-2"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}
            >
              ذوقِ سخن
            </h3>
            <p
              className="text-gray-300 text-lg"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}
            >
              شاعری کا ذوق، علم کا نور
            </p>
            <p className="text-gray-500 text-sm mt-2">The Joy of Poetry, The Light of Knowledge</p>
          </div>

          {/* Links */}
          <div className="text-center">
            <h4 className="text-yellow-400 font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm"
                  style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="text-center md:text-left">
            <h4 className="text-yellow-400 font-semibold mb-4">About</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Zauq-e-Sukhn is a digital platform dedicated to preserving and promoting the rich tradition of Urdu poetry. Explore the works of legendary poets and learn the art of Urdu verse.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © 2024{' '}
            <span
              className="text-yellow-400"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
            >
              ذوقِ سخن
            </span>
            {' '}— All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
