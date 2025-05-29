import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg';
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
    closeMenu();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };  const navItems = [
    { text: 'Trang chủ', path: '/home' },
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

              </nav>              <div>
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>                    <button
                      onClick={toggleUserDropdown}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || user.email}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials(user?.name || user?.email || 'U')}
                        </div>
                      )}
                      <span className="hidden md:block text-gray-700 text-sm">
                        {user?.name || user?.email}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isUserDropdownOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name || 'Người dùng'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                          <Link
                          to="/learning-room"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>Lớp học của tôi</span>
                          </div>
                        </Link>
                        
                        <Link
                          to="/learning-room"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Phòng học</span>
                          </div>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Đăng xuất</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>                ) : (
                  <>
                    <Link 
                      to="/auth?mode=login" 
                      className="mr-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      to="/auth?mode=register" 
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
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
              <h6 className="font-semibold text-xl text-primary">NiHao Education</h6>
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
            </nav>            <div className="mt-5 space-y-2">
              {isAuthenticated ? (
                <>                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || user.email}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {getUserInitials(user?.name || user?.email || 'U')}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name || 'Người dùng'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                    <Link 
                    to="/learning-room" 
                    className="block w-full px-4 py-2 text-center border border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Lớp học của tôi</span>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/learning-room" 
                    className="block w-full px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Phòng học</span>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-center bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Đăng xuất</span>
                    </div>
                  </button>
                </>              ) : (
                <>
                  <Link 
                    to="/auth?mode=login" 
                    className="block w-full px-4 py-2 text-center border border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
                    onClick={closeMenu}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    to="/auth?mode=register" 
                    className="block w-full px-4 py-2 text-center bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
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
