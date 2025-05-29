import React from 'react';
import { ArrowRight } from 'lucide-react';
import img from '../images/bờ lóg.jpg'

const blogPosts = [
  {
    id: 1,
    title: 'Cara Mudah Untuk Memulai Belajar Programming - EDUFREE',
    date: '19 Jan 2022',
    desc: 'Menjadi seorang programmer saat ini sudah sangat mudah untuk dipelajari oleh siapapun...',
    image: '/images/blog1.jpg',
  },
  {
    id: 2,
    title: 'Tips Membuat Website Landing Page Bussines - EDUFREE',
    date: '19 Jan 2022',
    desc: 'Pentingnya website dalam menumbuhkan rasa kepercayaan terhadap bisnis, membuat...',
    image: '/images/blog2.jpg',
  },
  {
    id: 3,
    title: 'Cara Installasi Wordpress Untuk Pemula - EDUFREE',
    date: '19 Jan 2022',
    desc: 'Membuat website saat ini sudah bisa tanpa codingan, kini kamu bisa membuatnya dengan...',
    image: '/images/blog3.jpg',
  },
];

const BlogSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Blog, Berita dan Event</h2>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <img src={img} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <p className="text-xs text-gray-500 mb-1">{post.date}</p>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{post.desc}</p>
                <a href="#" className="text-sm text-blue-600 font-medium flex items-center gap-1">
                  Selengkapnya <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
