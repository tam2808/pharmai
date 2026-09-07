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
} from 'lucide-react';
import { selectCartTotalItems } from '../../store/cartSlice';
import { logout } from '../../store/authSlice';
import { cn } from '../../utils/helpers';
import Button from '../ui/Button';

/**
 * Header v2 — Glassmorphism, gradient logo, animated nav
 */

const navLinks = [
  { path: '/', label: 'Trang chủ' },
  { path: '/search', label: 'Tìm thuốc' },
  { path: '/chatbot', label: 'Chatbot AI', icon: MessageSquare, badge: 'AI' },
  { path: '/about', label: 'Giới thiệu' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartTotalItems);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-border/80 shadow-xs">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-9 h-9">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl bg-primary opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-sm">
                <Pill size={18} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-extrabold text-text-primary font-display tracking-tight">
                Pharm<span className="gradient-text">AI</span>
              </span>
              <span className="text-[9px] font-semibold text-text-muted uppercase tracking-widest -mt-0.5">
                Smart Pharmacy
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Menu chính">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    'flex items-center gap-1.5',
                    isActive
                      ? 'text-primary bg-primary-light'
                      : 'text-text-secondary hover:text-primary hover:bg-primary-light/60'
                  )}
                >
                  {link.icon && <link.icon size={14} />}
                  {link.label}
                  {link.badge && (
                    <span className="ml-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-primary text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {/* Animated underline for active */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search shortcut */}
            <button
              onClick={() => navigate('/search')}
              className="p-2.5 rounded-xl text-text-secondary hover:text-primary hover:bg-primary-light transition-all duration-200 cursor-pointer"
              aria-label="Tìm kiếm"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-text-secondary hover:text-primary hover:bg-primary-light transition-all duration-200"
              aria-label={`Giỏ hàng (${cartCount} sản phẩm)`}
            >
              <ShoppingCart size={18} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] gradient-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary-light hover:bg-primary-light/80 transition-colors duration-200 cursor-pointer shadow-xs border border-primary/20"
                >
                  <div className="w-7 h-7 gradient-primary rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-bold text-text-primary max-w-[110px] truncate">
                    {user?.name || 'Tài khoản'}
                  </span>
                  <ChevronDown size={16} className={cn('text-text-secondary transition-transform duration-200', userMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2.5 w-64 bg-surface rounded-2xl shadow-xl border border-border/80 overflow-hidden z-50 p-2 space-y-1"
                    >
                      <div className="px-4 py-3 border-b border-border/60 bg-bg/80 rounded-xl mb-1">
                        <p className="text-[11px] uppercase font-extrabold text-text-muted tracking-wider">Đăng nhập với</p>
                        <p className="text-sm font-bold text-text-primary truncate mt-0.5">{user?.email || user?.name}</p>
                      </div>

                      <div className="space-y-0.5">
                        <button
                          onClick={() => { navigate('/profile?tab=info'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-text-primary rounded-xl hover:bg-primary-light hover:text-primary transition-all cursor-pointer"
                        >
                          <User size={18} className="text-primary shrink-0" />
                          <span>Thông tin cá nhân</span>
                        </button>
                        <button
                          onClick={() => { navigate('/profile?tab=orders'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-text-primary rounded-xl hover:bg-primary-light hover:text-primary transition-all cursor-pointer"
                        >
                          <Package size={18} className="text-primary shrink-0" />
                          <span>Đơn hàng & Theo dõi</span>
                        </button>
                        <button
                          onClick={() => { navigate('/profile?tab=security'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-text-primary rounded-xl hover:bg-primary-light hover:text-primary transition-all cursor-pointer"
                        >
                          <ShieldCheck size={18} className="text-primary shrink-0" />
                          <span>Bảo mật & Quyền riêng tư</span>
                        </button>
                      </div>

                      {user?.role === 'ROLE_ADMIN' && (
                        <div className="border-t border-border/60 pt-1 mt-1">
                          <button
                            onClick={() => { navigate('/admin'); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-primary rounded-xl hover:bg-primary-light transition-all cursor-pointer"
                          >
                            <LayoutDashboard size={18} className="shrink-0" />
                            <span>Trang quản trị</span>
                          </button>
                        </div>
                      )}

                      <div className="border-t border-border/60 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-error rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <LogOut size={18} className="shrink-0" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/search')}
                >
                  Đặt thuốc ngay
                </Button>
              </div>
            )}
          </div>

          {/* ── Mobile Actions ── */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <Link to="/cart" className="relative p-2 rounded-xl text-text-secondary" aria-label="Giỏ hàng">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 gradient-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-text-secondary hover:bg-primary-light transition-colors"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden glass border-t border-white/60 overflow-hidden"
          >
            <nav className="px-5 py-4 space-y-1" aria-label="Menu di động">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary bg-primary-light'
                        : 'text-text-secondary hover:text-primary hover:bg-primary-light/60'
                    )}
                  >
                    {link.icon && <link.icon size={16} />}
                    {link.label}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary text-white rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="border-t border-border/50 pt-3 mt-3 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="px-4 py-2 text-sm font-semibold text-text-primary flex items-center gap-2 hover:bg-primary-light rounded-xl"
                    >
                      <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                        <User size={11} className="text-white" />
                      </div>
                      <span>{user?.name || 'Người dùng'}</span>
                    </Link>

                    <Link
                      to="/profile?tab=orders"
                      className="px-4 py-2.5 text-xs text-text-secondary flex items-center gap-2 hover:bg-primary-light rounded-xl"
                    >
                      <Package size={15} />
                      <span>Đơn hàng & Theo dõi</span>
                    </Link>

                    <Link
                      to="/profile?tab=security"
                      className="px-4 py-2.5 text-xs text-text-secondary flex items-center gap-2 hover:bg-primary-light rounded-xl"
                    >
                      <ShieldCheck size={15} />
                      <span>Bảo mật & Quyền riêng tư</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-error hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" fullWidth onClick={() => navigate('/login')}>
                      Đăng nhập
                    </Button>
                    <Button variant="primary" fullWidth onClick={() => navigate('/search')}>
                      Đặt thuốc ngay
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
