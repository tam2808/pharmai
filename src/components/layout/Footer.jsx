import { Link } from 'react-router-dom';
import { Pill, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#222222] text-slate-300 text-xs border-t-4 border-[#10b981] font-body">
      {/* Main 4-Column Footer */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About Us */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#10b981] rounded-xl flex items-center justify-center text-white shadow-xs">
                <Pill size={18} strokeWidth={2.2} />
              </div>
              <span className="text-xl font-black text-white font-display">
                Pharm<span className="text-[#10b981]">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống nhà thuốc PharmAI chuẩn y tế GPP kết hợp trí tuệ nhân tạo AI hỗ trợ tư vấn và cung cấp sản phẩm dược phẩm chính hãng 100%.
            </p>
          </div>

          {/* Col 2: Contact Info */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-4 border-b border-[#10b981] pb-2 inline-block">
              THÔNG TIN LIÊN HỆ
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-[#10b981] shrink-0 mt-0.5" />
                <span>123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall size={15} className="text-[#10b981] shrink-0" />
                <a href="tel:0988888888" className="hover:text-white font-bold text-white font-mono">0988.888.888</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-[#10b981] shrink-0" />
                <span>support@pharmai.vn</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories & Advice */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-4 border-b border-[#10b981] pb-2 inline-block">
              DANH MỤC SẢN PHẨM
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search?category=Thu%E1%BB%B1c%20k%C3%AA%20%C4%91%C6%A1n" className="hover:text-[#10b981] transition-colors">Dược phẩm kê đơn</Link></li>
              <li><Link to="/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng" className="hover:text-[#10b981] transition-colors">Thực phẩm chức năng</Link></li>
              <li><Link to="/search?category=Da%20li%E1%BB%85u" className="hover:text-[#10b981] transition-colors">Dược mỹ phẩm da liễu</Link></li>
              <li><Link to="/search?category=Thi%E1%BF%BFt%20b%E1%BB%8B%20y%20t%E1%BA%BF" className="hover:text-[#10b981] transition-colors">Thiết bị y tế gia đình</Link></li>
              <li><Link to="/chatbot" className="hover:text-[#10b981] transition-colors text-[#10b981] font-bold">Hỏi đáp Dược sĩ AI 24/7</Link></li>
            </ul>
          </div>

          {/* Col 4: Account & Policies */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-4 border-b border-[#10b981] pb-2 inline-block">
              TÀI KHOẢN & HỖ TRỢ
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-[#10b981] transition-colors">Tài khoản cá nhân</Link></li>
              <li><Link to="/checkout" className="hover:text-[#10b981] transition-colors">Thanh toán đơn hàng</Link></li>
              <li><Link to="/about" className="hover:text-[#10b981] transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/about" className="hover:text-[#10b981] transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} PharmAI — Template 995 Aesthetics. Tất cả quyền được bảo lưu.</div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#10b981] transition-colors">Bảo mật</Link>
            <Link to="/about" className="hover:text-[#10b981] transition-colors">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
