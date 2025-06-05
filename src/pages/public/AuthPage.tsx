import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, isAuthenticated, getRoleBasedRoute } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      const targetRoute = getRoleBasedRoute();
      console.log(`🔀 User already authenticated, redirecting to: ${targetRoute}`);
      navigate(targetRoute);
    }
  }, [isAuthenticated, navigate, getRoleBasedRoute]);

  useEffect(() => {
    // Update login state when URL changes
    const mode = searchParams.get('mode');
    setIsLogin(mode !== 'register');
  }, [searchParams]);
    const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        const targetRoute = getRoleBasedRoute();
        console.log(`🔀 Login successful, redirecting to: ${targetRoute}`);
        navigate(targetRoute);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu xác nhận không khớp');
          return;
        }
        await register(formData.name, formData.email, formData.password);
        const targetRoute = getRoleBasedRoute();
        console.log(`🔀 Registration successful, redirecting to: ${targetRoute}`);
        navigate(targetRoute);
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      
      <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Section */}
          <div className="flex-1 p-6 md:p-8 max-w-full md:max-w-[600px]">            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <div className="flex -mb-px">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                    });
                  }}
                  className={`mr-8 py-2 px-1 font-semibold ${
                    isLogin
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                    });
                  }}
                  className={`py-2 px-1 font-semibold ${
                    !isLogin
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>

            {isLogin ? (
              <div>
                <h1 className="text-2xl font-bold mb-1">Đăng nhập tài khoản</h1>
                <p className="text-gray-600 mb-6">
                  Chào mừng trở lại! Đăng nhập để tiếp tục học tiếng Trung
                </p>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ email của bạn"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu của bạn"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Ghi nhớ đăng nhập
                      </label>
                    </div>
                    <div>
                      <RouterLink to="/forgot-password" className="text-sm font-medium text-red-600 hover:text-red-500">
                        Quên mật khẩu?
                      </RouterLink>
                    </div>
                  </div>
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang đăng nhập...
                      </>
                    ) : (
                      'Đăng nhập'
                    )}
                  </button>
                </form>
                
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Hoặc đăng nhập với
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <button
                      className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#EA4335">
                        <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" />
                        <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                        <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                        <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                      </svg>
                      Google
                    </button>
                    <button
                      className="w-full flex items-center justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                  </div>
                </div>
                
                <p className="mt-6 text-center text-gray-600">
                  Chưa có tài khoản?{' '}
                  <button 
                    onClick={toggleAuthMode} 
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Đăng ký
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold mb-1">Tạo tài khoản mới</h1>
                <p className="text-gray-600 mb-6">
                  Đăng ký để bắt đầu hành trình học tiếng Trung của bạn
                </p>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      id="register-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên của bạn"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ email của bạn"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="register-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Nhập lại mật khẩu của bạn"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-700">
                        Tôi đồng ý với{' '}
                        <RouterLink to="/terms" className="text-red-600 hover:text-red-500">
                          Điều khoản dịch vụ
                        </RouterLink>{' '}
                        và{' '}
                        <RouterLink to="/privacy" className="text-red-600 hover:text-red-500">
                          Chính sách bảo mật
                        </RouterLink>
                      </label>
                    </div>
                  </div>
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang đăng ký...
                      </>
                    ) : (
                      'Đăng ký'
                    )}
                  </button>
                </form>
                
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Hoặc đăng ký với
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <button
                      className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#EA4335">
                        <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" />
                        <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                        <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                        <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                      </svg>
                      Google
                    </button>
                    <button
                      className="w-full flex items-center justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                  </div>
                </div>
                
                <p className="mt-6 text-center text-gray-600">
                  Đã có tài khoản?{' '}
                  <button 
                    onClick={toggleAuthMode} 
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Đăng nhập
                  </button>
                </p>
              </div>
            )}
          </div>
          
          {/* Image Section */}
          <div className="hidden md:block flex-1 relative">
            <img 
              src="https://plus.unsplash.com/premium_photo-1661600619578-2d9e2593bbfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFzaWMlMjBjaGluZXNlfGVufDB8fDB8fHww"
              alt="Learn Chinese"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-black bg-opacity-60 text-white">
              <h2 className="text-xl font-bold mb-2">Học tiếng Trung mọi lúc, mọi nơi</h2>
              <p>Bắt đầu hành trình học tiếng Trung của bạn với những phương pháp học hiệu quả và vui nhộn</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AuthPage;
