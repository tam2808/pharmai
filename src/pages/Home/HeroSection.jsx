import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, PhoneCall, HelpCircle, ShoppingCart, Sparkles, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const bannerSlides = [
  {
    id: 1,
    productName: 'Cebraton',
    productTagline: 'Hoạt huyết dưỡng não thế hệ mới',
    bgGradient: 'from-emerald-50 via-emerald-100/60 to-teal-50',
    image: '/images/banner1_pro.png',
    badge: 'Sản Phẩm Bán Chạy',
    subtitle: 'Hỗ trợ suy giảm trí nhớ, đau đầu, hoa mắt, chóng mặt, mất ngủ',
    link: '/drug/1',
  },
  {
    id: 2,
    productName: 'Paracetamol 500mg',
    productTagline: 'Giảm đau & Hạ sốt an toàn hiệu quả',
    bgGradient: 'from-green-50 via-emerald-50 to-emerald-100/50',
    image: '/images/banner2_pro.png',
    badge: 'Chuẩn Khuyên Dùng',
    subtitle: 'Được các bác sĩ khuyên dùng trong tủ thuốc gia đình Việt',
    link: '/drug/2',
  },
  {
    id: 3,
    productName: 'Amoxicillin 500mg',
    productTagline: 'Kháng sinh chuẩn GPP đạt chuẩn Châu Âu',
    bgGradient: 'from-emerald-100/40 via-teal-50 to-white',
    image: '/images/banner3_pro.png',
    badge: 'Ưu Đãi Đặc Biệt',
    subtitle: 'Chăm sóc sức khỏe toàn diện cho cả gia đình bạn',
    link: '/drug/3',
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
    <section className="py-4 bg-slate-50 border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* ── Left 8 Cols: Main Traphaco Banner Carousel ── */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-sm border border-emerald-200 bg-white group min-h-[300px] sm:min-h-[340px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className={`w-full h-full p-6 sm:p-10 bg-gradient-to-r ${bannerSlides[current].bgGradient} flex flex-col sm:flex-row items-center justify-between gap-6`}
              >
                {/* Left Text Block */}
                <div className="space-y-3 flex-1 text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#009640] text-white shadow-xs uppercase tracking-wider">
                    <Sparkles size={13} />
                    {bannerSlides[current].badge}
                  </span>
                  
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#EE4D2D] tracking-tight font-display drop-shadow-xs">
                      {bannerSlides[current].productName}
                    </h2>
                    <p className="text-sm sm:text-base font-extrabold text-[#009640] mt-0.5">
                      {bannerSlides[current].productTagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                    {bannerSlides[current].subtitle}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate('/search')}
                      className="px-6 py-2.5 rounded-full bg-[#EE4D2D] hover:bg-[#D73211] text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart size={15} />
                      THÊM VÀO GIỎ
                    </button>
                  </div>
                </div>

                {/* Right Product Image Block */}
                <div className="w-48 sm:w-60 h-48 sm:h-56 relative shrink-0 flex items-center justify-center">
                  <img
                    src={bannerSlides[current].image}
                    alt={bannerSlides[current].productName}
                    className="max-w-full max-h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#009640] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#009640] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer z-10"
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
                    current === idx ? 'w-6 bg-[#009640]' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Right 4 Cols: Expert Advisory Side Widget ── */}
          <div className="lg:col-span-4 bg-gradient-to-b from-amber-50 to-orange-50/60 rounded-2xl border border-orange-200/80 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            {/* Top Ribbon Badge */}
            <div className="bg-[#F97316] text-white py-2 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider">
              <HelpCircle size={17} />
              HỎI ĐÁP CÙNG CHUYÊN GIA
            </div>

            <div className="my-5 text-center space-y-3">
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">TƯ VẤN MIỄN PHÍ 24/7</p>
              
              <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-[#F97316] font-mono tracking-tight">
                <PhoneCall size={26} className="animate-bounce text-[#EE4D2D]" />
                <span>0988.888.888</span>
              </div>

              <p className="text-xs text-slate-600 px-2 leading-relaxed">
                HOẶC trò chuyện với Dược sĩ AI để giải đáp thắc mắc về liều dùng & bệnh lý
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/chatbot')}
              className="w-full py-3 bg-[#009640] hover:bg-[#007A33] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
            >
              <MessageSquare size={16} />
              ĐẶT CÂU HỎI CHO AI DƯỢC SĨ
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
