import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoImage from "../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";

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
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate("/");
    closeMenu();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { text: "Trang chủ", path: "/home" },
    { text: "Blog", path: "/blog" },
    { text: "Khóa học", path: "/courses" },
    { text: "Liên hệ", path: "/#contact" },
  ];

  const isActive = (path: string) =>
    !path.startsWith("/#") && location.pathname === path;

  return (
    <header className="sticky top-0 z-10 bg-red-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center">
            <img
              src={logoImage}
              alt="Nihao Education"
              className="h-[3rem] mr-1"
            />
            <span className="hidden sm:block font-bold text-xl text-white">
              Nihao Education
            </span>
          </Link>

          {!isMobile && (
            <div className="flex items-center">
              <nav className="flex mr-6">
                {navItems.map((item) =>
                  item.path.startsWith("/#") ? (
                    <a
                      key={item.text}
                      href={item.path}
                      className={`mx-1 px-3 py-2 font-medium relative text-white hover:text-white`}
                    >
                      {item.text}
                      {isActive(item.path) && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
                      )}
                    </a>
                  ) : (
                    <Link
                      key={item.text}
                      to={item.path}
                      className={`mx-1 px-3 py-2 font-medium relative text-white hover:text-white`}
                    >
                      {item.text}
                      {isActive(item.path) && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
                      )}
                    </Link>
                  )
                )}
              </nav>
              <div>
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleUserDropdown}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || user.email}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials(user?.name || user?.email || "U")}
                        </div>
                      )}
                      <span className="hidden md:block text-white text-sm">
                        {user?.name || user?.email}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-300 ${
                          isUserDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name || "Người dùng"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/learning-room"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Lớp học của tôi
                        </Link>
                        <Link
                          to="/learning-room"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Phòng học
                        </Link>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/auth?mode=login"
                      className="mr-2 px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-50"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/auth?mode=register"
                      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}

          {isMobile && (
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-white hover:bg-red-700"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div className="fixed right-0 top-0 h-full w-4/5 max-w-[300px] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
          <div className="p-4">
            <div className="flex justify-between items-center mb-5">
              <h6 className="font-semibold text-xl">NiHao Education</h6>
              <button
                onClick={closeMenu}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) =>
                item.path.startsWith("/#") ? (
                  <a
                    key={item.text}
                    href={item.path}
                    onClick={closeMenu}
                    className={`block px-3 py-2 rounded-md ${
                      isActive(item.path)
                        ? "text-white bg-red-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.text}
                  </a>
                ) : (
                  <Link
                    key={item.text}
                    to={item.path}
                    onClick={closeMenu}
                    className={`block px-3 py-2 rounded-md ${
                      isActive(item.path)
                        ? "text-white bg-red-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.text}
                  </Link>
                )
              )}
            </nav>
            <div className="mt-5 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/learning-room"
                    onClick={closeMenu}
                    className="block w-full px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Lớp học của tôi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth?mode=login"
                    onClick={closeMenu}
                    className="block w-full px-4 py-2 rounded-md bg-white border text-gray-800 hover:bg-gray-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    onClick={closeMenu}
                    className="block w-full px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
