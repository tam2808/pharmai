import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Pill, ArrowRight, Shield, Award } from 'lucide-react';

const categories = ['Giảm đau - Hạ sốt', 'Kháng sinh', 'Tiêu hóa', 'Vitamin & Khoáng chất', 'Tim mạch', 'Da liễu'];
const support = ['Hướng dẫn đặt hàng', 'Chính sách đổi trả', 'Câu hỏi thường gặp', 'Điều khoản sử dụng', 'Chính sách bảo mật'];

/**
 * Footer v2 — Gradient dark, trust badges, rich columns
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0C2340 0%, #0369A1 60%, #0EA5E9 100%)' }}>
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/4 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-accent/10 blur-2xl pointer-events-none" />

      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-12 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12">
            {[
              { icon: Shield, label: 'Thuốc 100% chính hãng' },
              { icon: Award, label: 'Chuẩn FDA / WHO' },
              { icon: Heart, label: 'Dược sĩ kiểm duyệt' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/70">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon size={14} className="text-white/80" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-12 py-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
                <Pill size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white">
                  Pharm<span className="text-sky-300">AI</span>
                </span>
                <p className="text-[9px] text-white/40 uppercase tracking-widest -mt-0.5">Smart Pharmacy</p>
              </div>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Hệ thống đặt thuốc trực tuyến tích hợp AI, mang đến trải nghiệm mua thuốc an toàn, nhanh chóng và đáng tin cậy nhất Việt Nam.
            </p>

            {/* Contact quick info */}
            <div className="space-y-2.5">
              <a href="tel:19001234" className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone size={12} className="text-white/60" />
                </div>
                1900 1234
              </a>
              <a href="mailto:support@pharmai.vn" className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail size={12} className="text-white/60" />
                </div>
                support@pharmai.vn
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/55">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={12} className="text-white/60" />
                </div>
                <span>123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Danh mục
            </h3>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item}>
                  <Link
                    to="/search"
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all duration-200 text-sky-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all duration-200 text-sky-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Nhận thông báo
            </h3>
            <p className="text-sm text-white/55 mb-4 leading-relaxed">
              Đăng ký nhận thông tin khuyến mãi, thuốc mới và tips sức khỏe hữu ích.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              />
              <button className="w-full px-4 py-2.5 bg-sky-400 hover:bg-sky-300 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                Đăng ký
              </button>
            </div>

            {/* App badges */}
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-[10px] text-white/35 uppercase tracking-wider mb-3">Tải ứng dụng</p>
              <div className="flex flex-col gap-2">
                {['App Store', 'Google Play'].map((store) => (
                  <button
                    key={store}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-xs font-medium text-white/60 hover:text-white transition-all"
                  >
                    {store === 'App Store' ? '🍎' : '▶️'} {store}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} PharmAI. Đồ án khóa luận tốt nghiệp — Tất cả quyền được bảo lưu.
          </p>
          <p className="text-xs text-white/35 flex items-center gap-1">
            Made with <Heart size={11} className="text-red-400 fill-current" /> by PharmAI Team
          </p>
        </div>
      </div>
    </footer>
  );
}
