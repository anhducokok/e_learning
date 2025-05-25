import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#A82828] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Main footer */}
        <div className="pt-16 pb-10 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1">
            <h3 className="font-bold text-2xl mb-4">Tieng Trung Ni Hao</h3>
            <p className="text-base opacity-90 mb-4">
              Bangun dan wujudkan cita bersama edufree
            </p>
          </div>

          {/* Program links */}
          <div className="col-span-1">
            <h4 className="font-medium text-xl mb-4">Program</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-base hover:underline">Merdeka Belajar</Link></li>
              <li><Link to="/" className="text-base hover:underline">Finterpreneur</Link></li>
            </ul>
          </div>

          {/* Social media links */}
          <div className="col-span-1">
            <h4 className="font-medium text-xl mb-4">Sosial Media</h4>
            <ul className="space-y-3">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-base hover:underline">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-base hover:underline">Twitter</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-base hover:underline">LinkedIn</a></li>
            </ul>
          </div>

          {/* Support links */}
          <div className="col-span-1">
            <h4 className="font-medium text-xl mb-4">DUKUNGAN</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-base hover:underline">Tentang Kami</Link></li>
              <li><Link to="/terms" className="text-base hover:underline">Ketentuan</Link></li>
              <li><Link to="/privacy" className="text-base hover:underline">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact info box */}
        <div className="px-4 pb-10">
          <div className="bg-[#FCD980] p-6 rounded-t-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[#282938]">Email</h4>
                <p className="text-[#282938] opacity-80">contact@website.com</p>
              </div>
              <div>
                <h4 className="font-medium text-[#282938]">Telephone</h4>
                <p className="text-[#282938] opacity-80">+6288 999 222 333</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-[#282938] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center md:text-left text-sm">© Copyright TiengTrungNiHao 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
