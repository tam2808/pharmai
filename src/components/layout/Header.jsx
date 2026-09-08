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
  PhoneCall,
  Grid,
} from 'lucide-react';
import { selectCartTotalItems } from '../../store/cartSlice';
import { logout } from '../../store/authSlice';
import { cn } from '../../utils/helpers';

const navCategories = [
  { label: 'Thuốc kê đơn', path: '/search?category=Thu%E1%BB%91c%20k%C3%AA%20%C4%91%C6%A1n' },
  { label: 'Thực phẩm chức năng', path: '/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng' },
  { label: 'Chăm sóc cá nhân', path: '/search?category=Ch%C4%83m%20s%C3%B3c%20c%C3%A1%20nh%C3%A2n' },
  { label: 'Dược mỹ phẩm', path: '/search?category=Da%20li%E1%BB%85u' },
  { label: 'Thiết bị y tế', path: '/search?category=Thi%E1%BF%BFt%20b%E1%BB%8B%20y%20t%E1%BA%BF' },
  { label: 'Giảm đau - Hạ sốt', path: '/search?category=Gi%E1%BA%A3m%20%C4%91au' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartTotalItems);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setCategoryDropdownOpen(false);
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
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-xs font-body">
      {/* ── Top Announcement Bar (Dola Pharmacy Style) ── */}
      <div className="bg-[#009640] text-white text-xs py-1.5 px-4 lg:px-12">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span className="bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full text-[10px] uppercase">
              Ưu đãi HOT
            </span>
            <span className="truncate">Chào mừng bạn đến với PharmAI! Miễn phí giao hàng đơn từ 300K & Tư vấn AI 24/7.</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] font-semibold">
            <Link to="/about" className="hover:text-amber-300 transition-colors">Về chúng tôi</Link>
            <span>|</span>
            <Link to="/chatbot" className="hover:text-amber-300 transition-colors flex items-center gap-1">
              <MessageSquare size={11} /> Hỏi đáp AI
            </Link>
            <span>|</span>
            <span className="flex items-center gap-1 font-bold text-amber-300">
              <PhoneCall size={11} /> Hotline: 0988.888.888
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Middle Header ── */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#009640] to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Pill size={22} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-display flex items-center gap-0.5 leading-none">
              Pharm<span className="text-[#009640]">AI</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#009640] tracking-wider uppercase mt-0.5">
              Dola Pharmacy Style
            </span>
          </div>
        </Link>

        {/* Central Search Bar with Integrated Category Select */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative flex items-center">
          <div className="relative w-full flex items-center bg-slate-100/90 border-2 border-[#009640] rounded-full overflow-hidden focus-within:bg-white focus-within:shadow-md transition-all">
            <input
              type="text"
              placeholder="Bạn cần tìm thuốc, thực phẩm chức năng, dụng cụ y tế..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#009640] hover:bg-[#007A33] text-white rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer font-bold text-xs gap-1"
            >
              <Search size={15} />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
          </div>
        </form>

        {/* User Auth & Cart */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#009640] hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#009640] text-white flex items-center justify-center font-bold text-[11px]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[90px] truncate">{user?.name || 'Tài khoản'}</span>
                <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 p-1.5 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-lg">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Tài khoản của bạn</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user?.email || user?.name}</p>
                    </div>

                    <button
                      onClick={() => { navigate('/profile?tab=info'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-[#009640] transition-colors"
                    >
                      <User size={15} className="text-[#009640]" />
                      <span>Thông tin cá nhân</span>
                    </button>

                    <button
                      onClick={() => { navigate('/profile?tab=orders'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-[#009640] transition-colors"
                    >
                      <Package size={15} className="text-[#009640]" />
                      <span>Quản lý đơn hàng</span>
                    </button>

                    {user?.role === 'ROLE_ADMIN' && (
                      <button
                        onClick={() => { navigate('/admin'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-extrabold text-[#009640] bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        <span>Trang quản trị Admin</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
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
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-300 hover:border-[#009640] text-xs font-bold text-slate-700 hover:text-[#009640] transition-all cursor-pointer"
            >
              <User size={15} />
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Cart Box */}
          <Link
            to="/cart"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#009640] hover:bg-[#007A33] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-[#EE4D2D] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Giỏ hàng</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Main Navigation Bar with Category Dropdown ── */}
      <div className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-12 flex items-center justify-between">
          
          {/* Left Category Menu Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="bg-[#009640] hover:bg-[#007A33] text-white px-5 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer rounded-t-lg"
            >
              <Grid size={16} />
              <span>DANH MỤC SẢN PHẨM</span>
              <ChevronDown size={14} className={cn('transition-transform', categoryDropdownOpen && 'rotate-180')} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {categoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full w-64 bg-white rounded-b-xl shadow-xl border border-slate-200 z-50 p-2 space-y-1"
                >
                  {navCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      to={cat.path}
                      className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#009640] rounded-lg transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Horizontal Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-700">
            <Link to="/" className="py-3 px-4 hover:text-[#009640] transition-colors font-extrabold text-[#009640]">
              Trang chủ
            </Link>
            <Link to="/search?category=Thu%E1%BB%91c%20k%C3%AA%20%C4%91%C6%A1n" className="py-3 px-4 hover:text-[#009640] transition-colors">
              Dược phẩm
            </Link>
            <Link to="/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng" className="py-3 px-4 hover:text-[#009640] transition-colors">
              Thực phẩm chức năng
            </Link>
            <Link to="/search?category=Ch%C4%83m%20s%C3%B3c%20c%C3%A1%20nh%C3%A2n" className="py-3 px-4 hover:text-[#009640] transition-colors">
              Chăm sóc cá nhân
            </Link>
            <Link to="/search?category=Thi%E1%BF%BFt%20b%E1%BB%8B%20y%20t%E1%BA%BF" className="py-3 px-4 hover:text-[#009640] transition-colors">
              Thiết bị y tế
            </Link>
            <Link to="/chatbot" className="py-3 px-4 text-[#009640] hover:bg-emerald-50 transition-colors flex items-center gap-1 font-extrabold">
              <MessageSquare size={14} /> Dược sĩ AI 24/7
            </Link>
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
            className="lg:hidden bg-white border-t border-slate-200 overflow-hidden"
          >
            <div className="p-4 space-y-1.5">
              {navCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  className="block px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#009640] rounded-lg transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
