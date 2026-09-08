import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  MessageSquare,
  Search,
  ChevronDown,
  Pill,
  LayoutDashboard,
  Package,
  ShieldCheck,
  PhoneCall,
  HelpCircle,
} from 'lucide-react';
import { selectCartTotalItems } from '../../store/cartSlice';
import { logout } from '../../store/authSlice';
import { cn } from '../../utils/helpers';
import Button from '../ui/Button';

/**
 * Header v3 — Professional Traphaco Pharmacy E-Commerce Style
 */

const mainNavLinks = [
  { path: '/', label: 'TRANG CHỦ' },
  { path: '/about', label: 'VỀ CHÚNG TÔI' },
  { path: '/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng', label: 'THỰC PHẨM BVSK' },
  { path: '/search?category=Nh%E1%BA%ADp%20kh%E1%BA%A9u', label: 'SẢN PHẨM NHẬP KHẨU' },
  { path: '/search', label: 'THUỐC' },
  { path: '/search?category=Da%20li%E1%BB%85u', label: 'MỸ PHẨM' },
  { path: '/chatbot', label: 'GÓC SỐNG KHỎE', icon: MessageSquare, badge: 'AI TƯ VẤN' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartTotalItems);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-xs">
      {/* ── 1. Top Utility Header Bar ── */}
      <div className="bg-slate-100 border-b border-slate-200 text-[12px] text-text-secondary py-1 px-4 lg:px-12">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#009640] text-white text-[11px] font-bold hover:bg-[#007A33] transition-colors"
            >
              <HelpCircle size={12} />
              Hỏi đáp AI
            </Link>
            <Link to="/about" className="hover:text-[#009640] transition-colors">
              Về chúng tôi
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="#" className="hover:text-[#009640] transition-colors">
              Tin tức - Khuyến mại
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="#" className="hover:text-[#009640] transition-colors">
              Trợ giúp
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="#" className="hover:text-[#009640] transition-colors">
              Liên hệ
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] font-semibold text-text-muted">
            <span>Nhà thuốc chuẩn GPP & Bán thuốc chính hãng 100%</span>
          </div>
        </div>
      </div>

      {/* ── 2. Main Middle Header Bar ── */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-11 h-11 bg-gradient-to-br from-[#009640] to-[#059669] rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-300">
            <Pill size={24} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-black text-[#009640] tracking-tight font-display flex items-center gap-0.5">
              Pharm<span className="text-emerald-700">AI</span>
              <span className="w-2 h-2 rounded-full bg-[#EE4D2D] inline-block ml-0.5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase -mt-1">
              Con đường sức khỏe xanh
            </span>
          </div>
        </Link>

        {/* Hotline Widget */}
        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
          <div className="w-9 h-9 rounded-full bg-[#009640] text-white flex items-center justify-center shrink-0 shadow-xs">
            <PhoneCall size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-text-muted">Gọi mua hàng:</p>
            <p className="text-base font-extrabold text-[#009640] font-mono leading-none mt-0.5">1800 6612</p>
          </div>
        </div>

        {/* Central Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-lg relative flex items-center"
        >
          <input
            type="text"
            placeholder="Bạn tìm kiếm sản phẩm gì..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-2.5 text-xs sm:text-sm bg-slate-50 border-2 border-emerald-600 rounded-full text-text-primary placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-4 bg-[#009640] hover:bg-[#007A33] text-white rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Tìm kiếm"
          >
            <Search size={16} />
          </button>
        </form>

        {/* Right Actions: Auth & Cart */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Auth Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-[#009640] transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#009640] text-white flex items-center justify-center font-extrabold text-[11px]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[90px] truncate">{user?.name || 'Tài khoản'}</span>
                <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50 p-2 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-border bg-slate-50 rounded-xl mb-1">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Đăng nhập tài khoản</p>
                      <p className="text-xs font-bold text-text-primary truncate">{user?.email || user?.name}</p>
                    </div>

                    <button
                      onClick={() => { navigate('/profile?tab=info'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-text-primary rounded-xl hover:bg-emerald-50 hover:text-[#009640] transition-colors"
                    >
                      <User size={15} className="text-[#009640]" />
                      <span>Thông tin cá nhân</span>
                    </button>

                    <button
                      onClick={() => { navigate('/profile?tab=orders'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-text-primary rounded-xl hover:bg-emerald-50 hover:text-[#009640] transition-colors"
                    >
                      <Package size={15} className="text-[#009640]" />
                      <span>Quản lý đơn hàng</span>
                    </button>

                    {user?.role === 'ROLE_ADMIN' && (
                      <button
                        onClick={() => { navigate('/admin'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-extrabold text-[#009640] bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        <span>Trang quản trị Admin</span>
                      </button>
                    )}

                    <div className="border-t border-border pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={15} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-[#009640] transition-colors"
            >
              <User size={16} />
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Cart Widget */}
          <Link
            to="/cart"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-xs font-bold text-text-primary hover:text-[#009640] transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-[#EE4D2D] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Giỏ hàng</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── 3. Main Navigation Bar (Traphaco Brand Emerald Green) ── */}
      <div className="bg-[#009640] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-12">
          <nav className="hidden lg:flex items-center justify-between text-white text-xs font-extrabold tracking-wide uppercase">
            {mainNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'py-3.5 px-3.5 hover:bg-[#007A33] transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2',
                    isActive ? 'border-amber-400 bg-[#007A33]' : 'border-transparent'
                  )}
                >
                  {link.icon && <link.icon size={15} className="text-amber-300" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[9px] font-black bg-[#EE4D2D] text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-3 py-2.5 text-xs font-bold text-text-primary hover:bg-emerald-50 hover:text-[#009640] rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
