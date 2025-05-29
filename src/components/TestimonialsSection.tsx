import React from 'react';
import { Quote } from 'lucide-react';
import ava from '../images/chén nỳ quíu sòn.jpg'

const TestimonialSection: React.FC = () => {
  return (
    <section className="bg-[#f5f8ff] py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Kata Mereka Tentang Kursus EDUFREE</h3>
          <p className="text-sm text-gray-500 mt-1">EDUFREE telah dipercaya lebih dari 10.000 siswa</p>
        </div>
        <div>
          <p className="text-lg font-medium text-gray-800 leading-relaxed mb-4">
            "Materi yang disampaikan mudah dimengerti, kualitas instruktur sangat baik serta responnya yang cepat. 
            So, kursus disini sangat-sangat saya rekomendasikan!!"
          </p>
          <div className="flex items-center gap-3">
            <img
              src={ava}
              alt="Jenny Wilson"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">Jenny Wilson</p>
              <p className="text-xs text-gray-500">Vice President</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4].map((dot) => (
              <span
                key={dot}
                className={`w-3 h-3 rounded-full ${dot === 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
