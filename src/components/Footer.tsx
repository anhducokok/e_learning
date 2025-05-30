import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#A82828] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer */}
        <div className="pt-16 pb-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-1">
          <div>
            {/* Logo + description */}
            <div>
              <h3 className="font-bold text-2xl mb-4">Tieng Trung Ni Hao</h3>
              <p className="opacity-90">
                Bangun dan wujudkan cita bersama edufree
              </p>
            </div>
            {/* Contact info box */}
            <div className="px-4 pb-10">
              <div className="bg-[#FCD980] p-6 rounded-lg max-w-lg mx-auto mt-8 shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[#282938]">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="opacity-80">contact@website.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Telephone</p>
                    <p className="opacity-80">+6288 999 222 333</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Media */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Sosial Media</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            {/* Program */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Program</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Merdeka Belajar
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Finterpreneur
                  </Link>
                </li>
              </ul>
            </div>

            {/* Dukungan */}
            <div>
              <h4 className="text-xl font-semibold mb-4">DUKUNGAN</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:underline">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:underline">
                    Ketentuan
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:underline">
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-white  text-black py-6 px-4  text-sm">
        © Copyright TiengTrungNiHao 2025
      </div>
    </footer>
  );
};

export default Footer;
