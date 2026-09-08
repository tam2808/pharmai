import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, PhoneCall, Truck, CreditCard, Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-4 border-[#009640] font-body">
      {/* ── Top Feature Bar (Dola Pharmacy Style) ── */}
      <div className="border-b border-slate-800 py-5 bg-slate-950/70">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Truck size={18} className="text-[#009640] shrink-0" />
            <span className="font-bold text-white">Giao Hàng Tận Nơi 2H</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={18} className="text-[#009640] shrink-0" />
            <span className="font-bold text-white">100% Thuốc Chính Hãng</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CreditCard size={18} className="text-[#009640] shrink-0" />
            <span className="font-bold text-white">Thanh Toán An Toàn</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Bot size={18} className="text-[#009640] shrink-0" />
            <span className="font-bold text-white">Tư Vấn Dược Sĩ AI 24/7</span>
          </div>
        </div>
      </div>

      {/* ── Main Footer Links ── */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#009640] to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-xs">
                <Pill size={18} strokeWidth={2.2} />
              </div>
              <span className="text-xl font-black text-white font-display">
                Pharm<span className="text-[#009640]">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống nhà thuốc Dola Pharmacy Style trực tuyến chuẩn GPP kết hợp AI hỗ trợ tra cứu biệt dược và mua thuốc chính hãng an toàn.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-400 block">Tổng đài hỗ trợ 24/7:</span>
              <a href="tel:0988888888" className="text-lg font-black text-[#009640] hover:underline font-mono flex items-center gap-1 mt-0.5">
                <PhoneCall size={15} /> 0988.888.888
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 border-l-3 border-[#009640] pl-2">
              VỀ PHARMAI
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Giới thiệu Dola Pharmacy</Link></li>
              <li><Link to="/search" className="hover:text-emerald-400 transition-colors">Tra cứu sản phẩm chính hãng</Link></li>
              <li><Link to="/chatbot" className="hover:text-emerald-400 transition-colors">Hỏi đáp Dược sĩ AI 24/7</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-400 transition-colors">Giỏ hàng của bạn</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 border-l-3 border-[#009640] pl-2">
              DANH MỤC CHÍNH
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search?category=Thu%E1%BB%91c%20k%C3%AA%20%C4%91%C6%A1n" className="hover:text-emerald-400 transition-colors">Dược Phẩm Kê Đơn</Link></li>
              <li><Link to="/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng" className="hover:text-emerald-400 transition-colors">Thực Phẩm Chức Năng</Link></li>
              <li><Link to="/search?category=Da%20li%E1%BB%85u" className="hover:text-emerald-400 transition-colors">Chăm Sóc Sắc Đẹp</Link></li>
              <li><Link to="/search?category=Thi%E1%BF%BFt%20b%E1%BB%8B%20y%20t%E1%BA%BF" className="hover:text-emerald-400 transition-colors">Thiết Bị Y Tế</Link></li>
            </ul>
          </div>

          {/* Legal Standards */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 border-l-3 border-[#009640] pl-2">
              TIÊU CHUẨN Y TẾ
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tất cả thông tin thuốc được kiểm duyệt theo tiêu chuẩn GPP Bộ Y Tế & dữ liệu openFDA Hoa Kỳ.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] text-slate-300 font-bold">
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded">Chuẩn GPP</span>
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded">openFDA DB</span>
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded">ISO 27001</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} PharmAI - Dola Pharmacy Template. Tất cả quyền được bảo lưu.</div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-emerald-400 transition-colors">Chính sách bảo mật</Link>
            <Link to="/about" className="hover:text-emerald-400 transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
