import React from 'react';
import { useNavigate } from 'react-router-dom';
import tralelaPicture from '../images/tralela.jpg';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center bg-white text-center px-4">
      <img src={tralelaPicture}  alt="tralela" className="text-9xl font-extrabold text-red-400 mb-4"/>

      <h2 className="text-2xl md:text-3xl font-semibold text-black mb-3">
        Oops... Tralelero tralala Tralelero tralala!
      </h2>
      <p className="text-black max-w-md mb-6">
         Tralelero tralala Tralelero tralala Tralelero tralala La-la-la-la Pa-pa-pa-pa, pa-pa Pa-pa-pa-pa, tralala Pa-pa-pa-pa, pa-pa Pa-pa-pa-pa, tralala
        <br />
        Tung tung tung sahur!!!!!!
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
