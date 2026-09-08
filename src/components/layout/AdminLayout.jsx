import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Pill,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Users,
  Home,
} from 'lucide-react';
import { logout } from '../../store/authSlice';
import { cn } from '../../utils/helpers';

const navItems = [
  { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/admin/drugs', label: 'Quản lý thuốc', icon: Pill },
  { to: '/admin/orders', label: 'Quản lý đơn hàng', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Quản lý khách hàng', icon: Users },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-shrink-0 relative flex flex-col bg-surface border-r border-border overflow-hidden shadow-xs"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0 shadow-md">
            <Pill size={20} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-text-primary font-extrabold font-display text-lg leading-none">
                  Pharm<span className="gradient-text">AI</span>
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-bg"
          >
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 border',
                  isActive
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-xs'
                    : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-bg'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    className={cn('shrink-0', isActive ? 'text-primary' : 'text-text-secondary')}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.12 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-border space-y-1.5">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold text-text-secondary hover:text-text-primary hover:bg-bg transition-all"
          >
            <Home size={20} className="shrink-0 text-text-secondary" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="whitespace-nowrap"
                >
                  Về trang chủ
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold text-error hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut size={20} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="whitespace-nowrap"
                >
                  Đăng xuất
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 mt-3 px-4 py-2">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center shrink-0">
              <User size={15} className="text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-bold text-text-primary truncate max-w-[140px]">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-text-muted truncate max-w-[140px]">
                    {user?.role === 'ROLE_ADMIN' ? 'Quản trị viên' : user?.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-bg p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
