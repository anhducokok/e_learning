import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-9xl font-extrabold text-red-400 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
        Oops... Bạn đang cố tìm hiểu chúng tôi ?
      </h2>
      <p className="text-gray-800 max-w-md mb-6">
        Đường dẫn vừa tìm không tồn tại đâu bé ơi.
        <br />
        Không có mùa xuân ấy đâu.
        <br />
        Bỏ cuộc đi!!!
      </p>
      <button
        onClick={handleBack}
        className="px-6 py-2 bg-[#A82828] text-gray-800 font-medium rounded hover:bg-yellow-500 transition-colors"
      >
        Homepage
      </button>
    </div>
  );
};

export default NotFoundPage;
