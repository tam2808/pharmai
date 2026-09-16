import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Pill,
  LayoutDashboard,
  Package,
  MessageSquare,
} from 'lucide-react';
import { selectCartTotalItems } from '../../store/cartSlice';
import { logout } from '../../store/authSlice';
import { cn } from '../../utils/helpers';

const navCategories = [
  { label: 'Tất cả sản phẩm', path: '/search' },
  { label: 'Thuốc kê đơn', path: '/search?category=Thu%E1%BB%B1c%20k%C3%AA%20%C4%91%C6%A1n' },
  { label: 'Thực phẩm chức năng', path: '/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng' },
  { label: 'Chăm sóc cá nhân', path: '/search?category=Ch%C4%83m%20s%C3%B3c%20c%C3%A1%20nh%C3%A2n' },
  { label: 'Dược mỹ phẩm', path: '/search?category=Da%20li%E1%BB%85u' },
  { label: 'Thiết bị y tế', path: '/search?category=Thi%E1%BF%BFt%20b%E1%BB%8B%20y%20t%E1%BA%BF' },
];

// 1 Màu Xanh Nhạt Thống Nhất (Single Light Emerald Green Accent: #10b981)
const LIGHT_GREEN = '#10b981';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartTotalItems);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setProductDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
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
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-xs font-body">
      {/* ── 1. Top Announcement Bar (Xanh Nhạt - Soft Light Green Banner) ── */}
      <div className="bg-[#10b981] text-white text-xs py-2 px-4 lg:px-12 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="text-[12px] font-semibold tracking-wide">
            Chào mừng bạn đến với nhà thuốc PharmAI | Tư vấn Dược sĩ AI 24/7
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium">
            {isAuthenticated ? (
              <Link to="/profile" className="hover:text-emerald-100 transition-colors">
                Tài khoản ({user?.name || 'Cá nhân'})
              </Link>
            ) : (
              <Link to="/login" className="hover:text-emerald-100 transition-colors">
                Tài khoản
              </Link>
            )}
            <span>|</span>
            <Link to="/checkout" className="hover:text-emerald-100 transition-colors">
              Thanh toán
            </Link>
            <span>|</span>
            <Link to="/search" className="hover:text-emerald-100 transition-colors">
              Cửa hàng
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Main Header Bar (Template 995 Layout + 1 Màu Xanh Nhạt) ── */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 bg-[#10b981] rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Pill size={22} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-display flex items-center gap-0.5 leading-none">
              Pharm<span className="text-[#10b981]">AI</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#10b981] tracking-wider uppercase mt-0.5">
              Nhà thuốc chuẩn GPP
            </span>
          </div>
        </Link>

        {/* Big Search Box ("Khung bự hơn giống mẫu") */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-3 sm:mx-8">
          <div className="flex items-center w-full h-12">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full px-5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 bg-white border-2 border-r-0 border-[#10b981] rounded-l-xl outline-none focus:bg-white transition-all shadow-xs font-medium"
            />
            <button
              type="submit"
              className="h-full px-6 sm:px-8 bg-[#10b981] hover:bg-[#059669] text-white rounded-r-xl border-2 border-[#10b981] flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0 font-extrabold text-sm"
              aria-label="Tìm kiếm"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Desktop Navigation Links & Action Icons */}
        <div className="hidden lg:flex items-center gap-4 sm:gap-6 text-sm font-bold text-slate-700">
          
          {/* Trang chủ - Solid Light Green Active Button */}
          <Link
            to="/"
            className={cn(
              'px-4 py-2 rounded-full font-bold transition-all shadow-xs',
              location.pathname === '/'
                ? 'bg-[#10b981] text-white hover:bg-[#059669]'
                : 'hover:text-[#10b981] hover:bg-emerald-50'
            )}
          >
            Trang chủ
          </Link>

          {/* Sản phẩm ∨ (Dropdown) */}
          <div className="relative" onMouseLeave={() => setProductDropdownOpen(false)}>
            <button
              onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              onMouseEnter={() => setProductDropdownOpen(true)}
              className={cn(
                'flex items-center gap-1 py-2 hover:text-[#10b981] transition-colors cursor-pointer font-bold',
                location.pathname.startsWith('/search') && 'text-[#10b981]'
              )}
            >
              <span>Sản phẩm</span>
              <ChevronDown size={14} className={cn('transition-transform duration-200', productDropdownOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {productDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 space-y-1"
                >
                  {navCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      to={cat.path}
                      className="block px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#10b981] rounded-lg transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thanh toán */}
          <Link
            to="/checkout"
            className={cn(
              'py-2 hover:text-[#10b981] transition-colors font-bold',
              location.pathname === '/checkout' && 'text-[#10b981]'
            )}
          >
            Thanh toán
          </Link>

          {/* Giới thiệu */}
          <Link
            to="/about"
            className={cn(
              'py-2 hover:text-[#10b981] transition-colors font-bold',
              location.pathname === '/about' && 'text-[#10b981]'
            )}
          >
            Giới thiệu
          </Link>

          {/* Liên hệ / AI Chatbot */}
          <Link
            to="/chatbot"
            className={cn(
              'py-2 hover:text-[#10b981] transition-colors font-bold flex items-center gap-1',
              location.pathname === '/chatbot' && 'text-[#10b981]'
            )}
          >
            Chatbot AI
          </Link>

          {/* Shopping Cart Icon with Badge */}
          <Link
            to="/cart"
            className="relative p-2 text-slate-700 hover:text-[#10b981] transition-colors ml-1"
            title="Giỏ hàng"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile Avatar Menu */}
          {isAuthenticated && (
            <div className="relative ml-1">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-[#10b981] text-white font-extrabold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#059669]"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 p-1.5 space-y-1"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 bg-emerald-50/60 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-400">Tài khoản</p>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {user?.name || user?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate('/profile?tab=info');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-[#10b981]"
                    >
                      <User size={14} className="text-[#10b981]" />
                      Thông tin cá nhân
                    </button>

                    <button
                      onClick={() => {
                        navigate('/profile?tab=orders');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-[#10b981]"
                    >
                      <Package size={14} className="text-[#10b981]" />
                      Đơn hàng
                    </button>

                    {user?.role === 'ROLE_ADMIN' && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-extrabold text-[#10b981] bg-emerald-50 rounded-lg"
                      >
                        <LayoutDashboard size={14} />
                        Trang quản trị
                      </button>
                    )}

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <LogOut size={14} />
                        Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/cart"
            className="relative p-2 text-slate-700 hover:text-[#10b981] transition-colors"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-200 overflow-hidden"
          >
            <div className="p-4 space-y-3 text-sm font-semibold">
              <Link
                to="/"
                className="block px-3 py-2 text-slate-800 hover:bg-emerald-50 hover:text-[#10b981] rounded-md"
              >
                Trang chủ
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 text-slate-800 hover:bg-emerald-50 hover:text-[#10b981] rounded-md"
              >
                Sản phẩm
              </Link>
              <Link
                to="/checkout"
                className="block px-3 py-2 text-slate-800 hover:bg-emerald-50 hover:text-[#10b981] rounded-md"
              >
                Thanh toán
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-slate-800 hover:bg-emerald-50 hover:text-[#10b981] rounded-md"
              >
                Giới thiệu
              </Link>
              <Link
                to="/chatbot"
                className="block px-3 py-2 text-slate-800 hover:bg-emerald-50 hover:text-[#10b981] rounded-md flex items-center gap-1.5"
              >
                <MessageSquare size={16} className="text-[#10b981]" />
                Chatbot AI
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-[#10b981] bg-emerald-50 rounded-md"
                >
                  Tài khoản ({user?.name || user?.email})
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-slate-800 hover:bg-emerald-50 hover:text-[#10b981] rounded-md"
                >
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
