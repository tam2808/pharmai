import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Truck, CreditCard, Bot } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const sidebarCategories = [
  { label: 'Dược phẩm', path: '/search?category=Thu%E1%BB%91c%20k%C3%AA%20%C4%91%C6%A1n', icon: '💊' },
  { label: 'Chăm sóc sức khỏe', path: '/search?category=Gi%E1%BA%A3m%20%C4%91au', icon: '❤️' },
  { label: 'Chăm sóc cá nhân', path: '/search?category=Ch%C4%83m%20s%C3%B3c%20c%C3%A1%20nh%C3%A2n', icon: '✨' },
  { label: 'Thực phẩm chức năng', path: '/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng', icon: '🌿' },
  { label: 'Mẹ và Bé', path: '/search?category=M%E1%BA%B9%20v%C3%A0%20B%C3%A9', icon: '🍼' },
  { label: 'Chăm sóc sắc đẹp', path: '/search?category=Da%20li%E1%BB%85u', icon: '💄' },
  { label: 'Thiết bị y tế', path: '/search?category=Thi%E1%BF%BFt%20b%E1%BB%8B%20y%20t%E1%BA%BF', icon: '🩺' },
];

const bannerSlides = [
  {
    id: 1,
    title: 'Thực Phẩm Chức Năng Chính Hãng 100%',
    subtitle: 'Nâng cao sức đề kháng, bổ sung dưỡng chất cho cả gia đình',
    badge: 'ƯU ĐÃI THÁNG',
    image: '/images/banner1_pro.png',
    link: '/search',
  },
  {
    id: 2,
    title: 'Chăm Sóc Sắc Đẹp & Dược Mỹ Phẩm',
    subtitle: 'Giảm giá đến 30% cho các thương hiệu dược mỹ phẩm hàng đầu',
    badge: 'MUA VÀO GIÁ TỐT',
    image: '/images/banner2_pro.png',
    link: '/search?category=Da%20li%E1%BB%85u',
  },
  {
    id: 3,
    title: 'Tư Vấn Dược Sĩ AI 24/7 Chuẩn Y Tế',
    subtitle: 'Giải đáp mọi thắc mắc về biệt dược & hướng dẫn sử dụng an toàn',
    badge: 'CÔNG NGHỆ AI',
    image: '/images/banner3_pro.png',
    link: '/chatbot',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  return (
    <section className="py-4 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 space-y-4">
        
        {/* ── 1. Hero Grid: Category Sidebar + Main Carousel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Left 3 Cols: Category Sidebar (Dola Pharmacy Style) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="bg-[#009640] text-white px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-between">
              <span>DANH MỤC NỔI BẬT</span>
            </div>
            <div className="divide-y divide-slate-100 py-1">
              {sidebarCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#009640] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  <ChevronRight size={13} className="text-slate-400 group-hover:text-[#009640] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right 9 Cols: Main Carousel Slider */}
          <div className="lg:col-span-9 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 group min-h-[280px] sm:min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full relative"
              >
                <img
                  src={bannerSlides[current].image}
                  alt={bannerSlides[current].title}
                  className="w-full h-[280px] sm:h-[340px] object-cover object-center"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent flex items-center p-6 sm:p-10">
                  <div className="max-w-md text-white space-y-3">
                    <span className="px-3 py-0.5 rounded-md text-[10px] font-black bg-[#EE4D2D] text-white inline-block uppercase tracking-wider">
                      {bannerSlides[current].badge}
                    </span>

                    <h2 className="text-xl sm:text-3xl font-extrabold font-display leading-tight text-white drop-shadow-sm">
                      {bannerSlides[current].title}
                    </h2>

                    <p className="text-xs text-slate-200 font-medium leading-relaxed drop-shadow">
                      {bannerSlides[current].subtitle}
                    </p>

                    <div className="pt-1">
                      <button
                        onClick={() => navigate(bannerSlides[current].link)}
                        className="px-5 py-2.5 rounded-full bg-[#009640] hover:bg-[#007A33] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>MUA NGAY BÂY GIỜ</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <ChevronRight size={20} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {bannerSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === idx ? 'w-6 bg-[#009640]' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* ── 2. 4 Value Service Proposition Badges ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#009640] flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase">GIAO HÀNG TẬN NƠI</h4>
              <p className="text-[10px] text-slate-500">Nhanh chóng trong 2 giờ</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#009640] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase">100% CHÍNH HÃNG</h4>
              <p className="text-[10px] text-slate-500">Đạt chuẩn GPP Bộ Y Tế</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#009640] flex items-center justify-center shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase">THANH TOÁN TIỆN LỢI</h4>
              <p className="text-[10px] text-slate-500">VNPay, chuyển khoản & COD</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#009640] flex items-center justify-center shrink-0">
              <Bot size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase">TƯ VẤN AI 24/7</h4>
              <p className="text-[10px] text-slate-500">Hỏi đáp triệu chứng miễn phí</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
