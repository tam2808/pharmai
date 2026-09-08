import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs sm:text-sm border-t-4 border-[#009640]">
      {/* Top Value Badges Bar */}
      <div className="border-b border-slate-800 py-6 bg-slate-950/60">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={20} className="text-[#009640] shrink-0" />
            <span className="font-bold text-white">100% Thuốc Chính Hãng</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🚚</span>
            <span className="font-bold text-white">Giao Hàng Tận Nơi 2H</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-bold text-white">Tư Vấn Dược Sĩ AI 24/7</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">💊</span>
            <span className="font-bold text-white">Chuẩn Dữ Liệu openFDA</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-[#009640] to-[#059669] rounded-xl flex items-center justify-center text-white shadow-md">
                <Pill size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black text-white tracking-tight font-display">
                Pharm<span className="text-emerald-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống nhà thuốc trực tuyến thông minh đạt chuẩn GPP, kết hợp tư vấn Dược sĩ AI giúp bạn tra cứu và mua thuốc an toàn, chính xác.
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 block mb-1">Tổng đài đặt hàng miễn phí:</span>
              <a href="tel:18006612" className="text-xl font-black text-[#009640] hover:underline font-mono">
                1800 6612 <span className="text-xs font-normal text-slate-400">(7:00 - 22:00)</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 border-b border-[#009640] pb-2 inline-block">
              Về PharmAI
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  Giới thiệu PharmAI <ExternalLink size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-emerald-400 transition-colors">
                  Tra cứu thuốc & biệt dược
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-emerald-400 transition-colors">
                  Hỏi đáp Dược sĩ AI 24/7
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  Giỏ hàng của bạn
                </Link>
              </li>
            </ul>
          </div>

          {/* Main Categories */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 border-b border-[#009640] pb-2 inline-block">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search?category=Gi%E1%BA%A3m%20%C4%91au" className="hover:text-emerald-400 transition-colors">Thuốc Giảm Đau - Hạ Sốt</Link></li>
              <li><Link to="/search?category=Kh%C3%A1ng%20sinh" className="hover:text-emerald-400 transition-colors">Kháng Sinh Phổ Rộng</Link></li>
              <li><Link to="/search?category=Ti%C3%AAu%20h%C3%B3a" className="hover:text-emerald-400 transition-colors">Thuốc Hỗ Trợ Tiêu Hóa</Link></li>
              <li><Link to="/search?category=Da%20li%E1%BB%85u" className="hover:text-emerald-400 transition-colors">Dược Mỹ Phẩm & Da Liễu</Link></li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 border-b border-[#009640] pb-2 inline-block">
              Tiêu Chuẩn Chuẩn Y Tế
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dữ liệu thuốc và tương tác biệt dược tham chiếu theo Bộ Y tế & Cục Quản Lý Dược openFDA Hoa Kỳ.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-slate-300 font-bold">
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md">Nhà Thuốc GPP</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md">openFDA DB</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md">ISO 27001</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} PharmAI System — Con Đường Sức Khỏe Xanh. Tất cả quyền được bảo lưu.</div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-emerald-400 transition-colors">Chính sách bảo mật</Link>
            <Link to="/about" className="hover:text-emerald-400 transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
