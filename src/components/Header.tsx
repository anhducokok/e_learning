import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg'; // Adjust the path as necessary
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const navItems = [
    { text: 'Trang chủ', path: '/home' },
    { text: 'Học tập', path: '/learning-room' },
    { text: 'Lớp học của tôi', path: '/my-classes' },
    { text: 'Blog', path: '/blog' },
    { text: 'Khóa học', path: '/courses' },
    { text: 'Liên hệ', path: '/#contact' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return false;
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center no-underline text-inherit">
            <img src={logoImage} alt="Nihao Education" className="h-[3rem] mr-1" />
            <span className="hidden sm:block font-bold text-xl text-primary">
              Nihao Education
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center">
              <nav  className="flex mr-6">                
  {navItems.map((item) => {
    const isActivePath = isActive(item.path);
    
    if (item.path.startsWith('/#')) {
      return (
        <a
          key={item.text}
          href={item.path}
          className={`mx-1 px-3 py-2 font-medium relative hover:text-primary transition-colors ${
            isActivePath ? 'text-primary' : 'text-gray-800'
          }`}
        >
          {item.text}
          {isActivePath && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
          )}
        </a>
      );
    } else {
      return (
        <Link
          key={item.text}
          to={item.path}
          className={`mx-1 px-3 py-2 font-medium relative hover:text-primary transition-colors ${
            isActivePath ? 'text-primary' : 'text-gray-800'
          }`}
        >
          {item.text}
          {isActivePath && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
          )}
        </Link>
      );
    }
  })}

              </nav>

              <div>
                <Link 
                  to="/auth" 
                  className="mr-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/auth" 
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Drawer */}
      {isMobile && isMenuOpen && (
        <div className="fixed right-0 top-0 h-full w-4/5 max-w-[300px] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
          <div className="p-4">
            <div className="flex justify-between items-center mb-5">
              <h6 className="font-semibold text-xl text-primary">你好教育</h6>
              <button 
                onClick={closeMenu}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-1">              {navItems.map((item) => {
                const isActivePath = isActive(item.path);
                
                if (item.path.startsWith('/#')) {
                  return (
                    <a
                      key={item.text}
                      href={item.path}
                      onClick={closeMenu}
                      className={`block px-3 py-2 rounded-md ${
                        isActivePath 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.text}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={item.text}
                      to={item.path}
                      onClick={closeMenu}
                      className={`block px-3 py-2 rounded-md ${
                        isActivePath 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.text}
                    </Link>
                  );
                }
              })}
            </nav>
            <div className="mt-5 space-y-2">
              <Link 
                to="/auth" 
                className="block w-full px-4 py-2 text-center border border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
                onClick={closeMenu}
              >
                Đăng nhập
              </Link>
              <Link 
                to="/auth" 
                className="block w-full px-4 py-2 text-center bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                onClick={closeMenu}
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overlay when mobile menu is open */}
      {isMobile && isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closeMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;
