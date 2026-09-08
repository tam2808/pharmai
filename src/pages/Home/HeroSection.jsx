import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Bot, ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const bannerSlides = [
  {
    id: 1,
    image: '/images/banner1_pro.png',
    badge: 'Hệ Thống Dược Phẩm AI 24/7',
    title: 'Chọn Nhà Thuốc Uy Tín - Chọn Sức Khỏe Vững Bền',
    subtitle: '100% Thuốc chính hãng, tư vấn chuyên sâu cùng Dược sĩ & AI 24/7',
    link: '/search',
  },
  {
    id: 2,
    image: '/images/banner2_pro.png',
    badge: 'Chuẩn Y Tế openFDA',
    title: 'Đồng Hành Cùng Bạn Trên Hành Trình Khỏe Mạnh',
    subtitle: 'Giao hàng nhanh trong 2 giờ, bảo quản tiêu chuẩn GSP/GDP',
    link: '/search',
  },
  {
    id: 3,
    image: '/images/banner3_pro.png',
    badge: 'Khuyến Mãi Tháng Này',
    title: 'Sống Khỏe Mỗi Ngày - Lựa Chọn Thông Minh',
    subtitle: 'Thực phẩm chức năng, Dược mỹ phẩm chính hãng giảm đến 30%',
    link: '/search',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [aiQuery, setAiQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (aiQuery.trim()) {
      navigate(`/chatbot?q=${encodeURIComponent(aiQuery.trim())}`);
    } else {
      navigate('/chatbot');
    }
  };

  return (
    <section className="py-5 bg-surface-hover/30 border-b border-border/40">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-12 space-y-5">
        
        {/* ── 1. Full-Width Visual Hero Banner Carousel (HD & Sharp Overlay) ── */}
        <div className="w-full relative rounded-2xl overflow-hidden shadow-sm group bg-slate-950 border border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full relative"
            >
              <Link to={bannerSlides[current].link} className="block w-full relative group">
                <img
                  src={bannerSlides[current].image}
                  alt={bannerSlides[current].title}
                  className="w-full h-[240px] sm:h-[320px] md:h-[370px] lg:h-[400px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* Crisp Dynamic Typography Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent flex items-center p-6 sm:p-10 lg:p-14">
                  <div className="max-w-xl text-white space-y-3.5">
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#ee4d2d] text-white inline-flex items-center gap-1.5 shadow-md tracking-wide uppercase">
                      <Sparkles size={14} /> {bannerSlides[current].badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight tracking-tight drop-shadow-lg text-white">
                      {bannerSlides[current].title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow">
                      {bannerSlides[current].subtitle}
                    </p>
                    <div className="pt-2">
                      <span className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg group-hover:bg-amber-400 transition-colors">
                        Khám phá sản phẩm <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous Banner"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer z-10"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer z-10"
          >
            <ChevronRight size={22} />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {bannerSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === idx ? 'w-7 bg-white' : 'w-2.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── 2. 3 Feature Action Cards (Matching Reference Layout) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Feature Card 1: Hỏi Dược sĩ AI 24/7 */}
          <div className="bg-gradient-to-br from-[#0b3d2e] via-emerald-900 to-[#042f2e] text-white rounded-2xl p-5 shadow-sm border border-emerald-500/30 flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shadow-sm shrink-0">
                  <Bot size={24} />
                </div>
                <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online 24/7
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">Hỏi Dược Sĩ AI PharmAI</h3>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Tư vấn triệu chứng (sốt, ho, dị ứng...), tra cứu liều dùng & tương tác thuốc tức thì.
                </p>
              </div>
            </div>

            <form onSubmit={handleAiSubmit} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập triệu chứng..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs outline-none focus:bg-white/20 focus:border-emerald-300 transition-all"
                />
                <Sparkles size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-300" />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl gradient-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all shrink-0 cursor-pointer flex items-center gap-1"
              >
                Hỏi AI <ArrowRight size={13} />
              </button>
            </form>
          </div>

          {/* Feature Card 2: Tải Đơn Thuốc Bác Sĩ */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm border border-emerald-400/30 flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-inner">
                  <Camera size={24} />
                </div>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
                  Báo giá 5 phút
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">Tải Đơn Thuốc Bác Sĩ</h3>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  Chụp hoặc tải ảnh đơn thuốc để Dược sĩ chuyên môn xác nhận & giao tận nhà trong 2 giờ.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <Link to="/cart" className="text-xs font-extrabold text-white flex items-center gap-1.5 hover:underline">
                <Camera size={14} />
                Tải ảnh đơn thuốc ngay
              </Link>
              <ArrowRight size={14} className="text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature Card 3: Chuẩn openFDA & Thuốc Chính Hãng */}
          <div className="bg-gradient-to-br from-sky-700 to-blue-900 text-white rounded-2xl p-5 shadow-sm border border-sky-400/30 flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck size={24} />
                </div>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
                  100% Chính Hãng
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">Thuốc & Y Tế Chuẩn openFDA</h3>
                <p className="text-xs text-sky-100 mt-1 leading-relaxed">
                  Đảm bảo nguồn gốc rõ ràng, bảo quản tiêu chuẩn GSP/GDP & tích lũy điểm thành viên.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <Link to="/search" className="text-xs font-extrabold text-white flex items-center gap-1.5 hover:underline">
                Khám phá danh mục thuốc
              </Link>
              <ArrowRight size={14} className="text-sky-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}


