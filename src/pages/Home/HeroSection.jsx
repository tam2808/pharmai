import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  PlusCircle, 
  Lock, 
  Pill, 
  Leaf, 
  Plus 
} from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="pt-8 bg-[#FAF8F5] font-body" style={{ paddingBottom: '96px' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12">
        
        {/* ── 1. Top Main Hero Banner (Framed with 4px Border like Sample) ── */}
        <div className="w-full relative rounded-3xl overflow-hidden shadow-md border-4 border-[#10b981] bg-white group min-h-[360px] sm:min-h-[400px] flex items-center">
          
          {/* Background Image */}
          <img
            src="/images/banner_hero_main.png"
            alt="Nhà thuốc trực tuyến - Sức khỏe trong tầm tay"
            className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-700"
          />

          {/* Overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:w-3/4 lg:w-2/3" />

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-4">
            
            {/* Tagline */}
            <p className="text-xs sm:text-sm font-extrabold text-[#059669] tracking-widest uppercase font-display flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              NHÀ THUỐC TRỰC TUYẾN
            </p>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#045c43] font-display leading-tight tracking-tight drop-shadow-xs">
              Sức khỏe trong tầm tay
            </h1>

            {/* Subtitles */}
            <p className="text-xs sm:text-sm text-slate-600 font-semibold flex items-center gap-2 flex-wrap">
              <span>Thuốc chính hãng</span>
              <span className="text-slate-300">•</span>
              <span>Giá tốt</span>
              <span className="text-slate-300">•</span>
              <span>Giao hàng nhanh</span>
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/search')}
                className="px-8 py-3 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShoppingCart size={18} />
                <span>Mua ngay</span>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* 4 Feature Items */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-bold text-slate-700">
              
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#10b981] shrink-0" />
                <div className="leading-tight">
                  <p className="text-slate-900">100%</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Thuốc chính hãng
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Truck size={16} className="text-[#10b981] shrink-0" />
                <div className="leading-tight">
                  <p className="text-slate-900">Giao hàng</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    toàn quốc
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <PlusCircle size={16} className="text-[#10b981] shrink-0" />
                <div className="leading-tight">
                  <p className="text-slate-900">Dược sĩ tư vấn</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    miễn phí 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Lock size={16} className="text-[#10b981] shrink-0" />
                <div className="leading-tight">
                  <p className="text-slate-900">Thanh toán</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    an toàn 100%
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Slogan */}
          <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center text-center space-y-2 z-10 max-w-[200px]">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-[#10b981] flex items-center justify-center text-[#10b981] shadow-lg animate-pulse">
              <PlusCircle size={36} />
            </div>

            <p className="text-sm font-black text-[#045c43] italic leading-snug font-display">
              "Vì một cuộc sống khỏe mạnh hơn!"
            </p>
          </div>

        </div>

        {/* ── 2. 3 Sub-Banners Bottom Row ── */}
        {/* Khoảng cách lớn giữa hero và sub-banners, và giữa các sub-banners */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3" 
          style={{ gap: '56px', marginTop: '64px' }}
        >
          
          {/* Sub-Banner 1: Thuốc Thông Dụng */}
          <div 
            onClick={() => navigate('/search?category=Th%E1%BB%B1c%20k%C3%AA%20%C4%91%C6%A1n')}
            className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-[#0284c7] bg-gradient-to-r from-sky-500 via-sky-400 to-blue-300 min-h-[220px] flex items-center p-6 group cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            
            {/* Background Product Image */}
            <img
              src="/images/banner_card_thuoc.png"
              alt="Thuốc thông dụng"
              className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-left opacity-90 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0284c7] via-[#0284c7]/90 to-transparent w-3/4" />

            <div className="relative z-10 text-white space-y-2.5 max-w-[68%]">
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Pill size={17} className="text-white" />
                </div>

                <h3 className="font-black text-base sm:text-lg leading-tight font-display drop-shadow-xs">
                  Thuốc thông dụng
                </h3>
              </div>

              <p className="text-[11px] text-sky-100 font-medium line-clamp-2 leading-relaxed">
                Giảm đau - Hạ sốt - Cảm cúm và nhiều loại khác
              </p>

              <div className="pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/search');
                  }}
                  className="px-4.5 py-1.5 rounded-full bg-white hover:bg-sky-50 text-[#0284c7] font-extrabold text-[11px] uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem ngay</span>
                  <ChevronRight size={13} />
                </button>
              </div>

            </div>
          </div>

          {/* Sub-Banner 2: Vitamin & TPCN */}
          <div 
            onClick={() => navigate('/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng')}
            className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-[#f59e0b] bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 min-h-[220px] flex items-center p-6 group cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            
            {/* Background Product Image */}
            <img
              src="/images/banner_card_vitamin.png"
              alt="Vitamin & Thực phẩm chức năng"
              className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-left opacity-90 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d97706] via-[#d97706]/90 to-transparent w-3/4" />

            <div className="relative z-10 text-white space-y-2.5 max-w-[68%]">
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Leaf size={17} className="text-white" />
                </div>

                <h3 className="font-black text-base sm:text-lg leading-tight font-display drop-shadow-xs">
                  Vitamin & TPCN
                </h3>
              </div>

              <p className="text-[11px] text-amber-100 font-medium line-clamp-2 leading-relaxed">
                Tăng cường sức đề kháng - Bảo vệ sức khỏe mỗi ngày
              </p>

              <div className="pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng');
                  }}
                  className="px-4.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-[#d97706] font-extrabold text-[11px] uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem ngay</span>
                  <ChevronRight size={13} />
                </button>
              </div>

            </div>
          </div>

          {/* Sub-Banner 3: Chăm Sóc & Điều Trị */}
          <div 
            onClick={() => navigate('/search?category=Da%20li%E1%BB%85u')}
            className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-[#10b981] bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-300 min-h-[220px] flex items-center p-6 group cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            
            {/* Background Product Image */}
            <img
              src="/images/banner_card_chamsoc.png"
              alt="Chăm sóc & Điều trị"
              className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-left opacity-90 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#059669] via-[#059669]/90 to-transparent w-3/4" />

            <div className="relative z-10 text-white space-y-2.5 max-w-[68%]">
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Plus size={17} className="text-white" />
                </div>

                <h3 className="font-black text-base sm:text-lg leading-tight font-display drop-shadow-xs">
                  Chăm sóc & Điều trị
                </h3>
              </div>

              <p className="text-[11px] text-emerald-100 font-medium line-clamp-2 leading-relaxed">
                Bảo vệ sức khỏe gia đình với các sản phẩm chất lượng
              </p>

              <div className="pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/search?category=Da%20li%E1%BB%85u');
                  }}
                  className="px-4.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#059669] font-extrabold text-[11px] uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem ngay</span>
                  <ChevronRight size={13} />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}