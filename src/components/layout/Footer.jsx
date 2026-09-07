import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16 text-text-secondary text-xs sm:text-sm">
      {/* Top Value Badges */}
      <div className="border-b border-border/60 py-6 bg-surface-hover/30">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={20} className="text-primary shrink-0" />
            <span className="font-medium text-text-primary text-xs sm:text-sm">100% Thuốc chính hãng</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🚚</span>
            <span className="font-medium text-text-primary text-xs sm:text-sm">Giao hàng tận nơi 2H</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-medium text-text-primary text-xs sm:text-sm">Tư vấn Dược sĩ AI 24/7</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">💊</span>
            <span className="font-medium text-text-primary text-xs sm:text-sm">Chuẩn dữ liệu openFDA</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-xs">
                <Pill size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-extrabold text-text-primary font-display tracking-tight">
                Pharm<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              Hệ thống nhà thuốc trực tuyến thông minh tích hợp AI hỗ trợ tra cứu, kiểm tra tương tác thuốc và đặt mua sản phẩm y tế an toàn.
            </p>
            <div className="pt-1">
              <span className="text-xs font-semibold text-text-primary block mb-1">Tổng đài miễn phí:</span>
              <a href="tel:18006868" className="text-base font-bold text-primary hover:underline">
                1800-6868 <span className="text-xs font-normal text-text-muted">(7:00 - 22:00)</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-text-primary text-sm mb-4">Về PharmAI</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-1">
                  Giới thiệu PharmAI <ExternalLink size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary transition-colors">
                  Tra cứu thuốc & hoạt chất
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-primary transition-colors">
                  Hỏi đáp Dược sĩ AI 24/7
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  Giỏ hàng của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-text-primary text-sm mb-4">Danh mục chính</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/search?category=ke-don" className="hover:text-primary transition-colors">Thuốc kê đơn theo bác sĩ</Link></li>
              <li><Link to="/search?category=tpcn" className="hover:text-primary transition-colors">Thực phẩm chức năng</Link></li>
              <li><Link to="/search?category=duoc-my-pham" className="hover:text-primary transition-colors">Dược mỹ phẩm chăm sóc da</Link></li>
              <li><Link to="/search?category=thiet-bi-y-te" className="hover:text-primary transition-colors">Thiết bị y tế gia đình</Link></li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div className="space-y-3">
            <h4 className="font-bold text-text-primary text-sm mb-4">Tiêu chuẩn & Bảo mật</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Toàn bộ dữ liệu biệt dược và tương tác thuốc được tham chiếu theo Cục quản lý Dược & cơ sở dữ liệu openFDA Hoa Kỳ.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-text-muted">
              <span className="px-2.5 py-1 bg-surface-hover border border-border rounded-md">GPP Certified</span>
              <span className="px-2.5 py-1 bg-surface-hover border border-border rounded-md">openFDA API</span>
              <span className="px-2.5 py-1 bg-surface-hover border border-border rounded-md">ISO 27001</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <div>© {new Date().getFullYear()} PharmAI System. Tất cả quyền được bảo lưu.</div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
            <Link to="/about" className="hover:text-primary transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
