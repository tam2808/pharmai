import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Bot, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const bannerSlides = [
  {
    id: 1,
    image: '/images/banner1.png',
    title: 'Chọn nhà thuốc uy tín - Chọn sức khỏe vững bền',
    link: '/search',
  },
  {
    id: 2,
    image: '/images/banner2.png',
    title: 'Đồng hành cùng bạn trên hành trình khỏe mạnh',
    link: '/search',
  },
  {
    id: 3,
    image: '/images/banner3.png',
    title: 'Sống khỏe mỗi ngày - Lựa chọn thông minh',
    link: '/search',
  },
  {
    id: 4,
    image: '/images/banner4.png',
    title: 'Khuyến mãi tháng này - Giảm đến 30%',
    link: '/search',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  return (
    <section className="py-4 bg-surface-hover/30 border-b border-border/40">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Visual Banner Carousel (8 cols) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-sm group min-h-[220px] sm:min-h-[280px] md:min-h-[310px] bg-white border border-border">
            <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full relative"
                >
                  <Link to={bannerSlides[current].link} className="block w-full h-full">
                    <img
                      src={bannerSlides[current].image}
                      alt={bannerSlides[current].title}
                      className="w-full h-[220px] sm:h-[280px] md:h-[310px] object-cover object-center cursor-pointer hover:scale-[1.01] transition-transform duration-500"
                    />
                  </Link>
                </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous Banner"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
            >
              <ChevronRight size={20} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {bannerSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right 2 Compact Action Cards (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            
            {/* Upload Prescription Action */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Camera size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-text-primary text-base">Tải đơn thuốc lên</h3>
                  <span className="text-xs text-emerald-700 font-semibold">Báo giá trong 5 phút</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
                <Link to="/cart" className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline">
                  Tải ảnh ngay <ArrowRight size={13} />
                </Link>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">Miễn phí</span>
              </div>
            </div>

            {/* AI Assistant Action */}
            <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-text-primary text-base">Trợ lý Dược AI</h3>
                  <span className="text-xs text-sky-700 font-semibold">Tư vấn liều & tương tác</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between">
                <Link to="/chatbot" className="text-xs font-bold text-sky-700 flex items-center gap-1 hover:underline">
                  Hỏi AI ngay <ArrowRight size={13} />
                </Link>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2 py-0.5 rounded-full">● Online 24/7</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
