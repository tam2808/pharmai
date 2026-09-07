import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  User,
  Package,
  ShieldCheck,
  KeyRound,
  MapPin,
  Phone,
  Mail,
  Edit3,
  CheckCircle2,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldAlert,
  Lock,
  Calendar,
  AlertCircle,
  Check,
  Sparkles,
  Store,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { updateProfileSuccess } from '../../store/authSlice';
import { updateProfile, changePassword } from '../../services/authApi';
import { getMyOrders, trackOrder, updateOrderStatus } from '../../services/orderApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import { formatCurrency, formatDate } from '../../utils/helpers';

// ── Validation schemas ──────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  phone: z
    .string()
    .min(10, 'Số điện thoại tối thiểu 10 chữ số')
    .regex(/^\d+$/, 'Số điện thoại chỉ bao gồm chữ số'),
  address: z.string().min(5, 'Địa chỉ chi tiết tối thiểu 5 ký tự'),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

// ── Status Configs ──────────────────────────────────────────
const ORDER_STATUS_MAP = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock,
    stepIndex: 1,
  },
  pending_verification: {
    label: 'Chờ Admin duyệt CK',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold',
    icon: CheckCircle,
    stepIndex: 1,
  },
  processing: {
    label: 'Đã xác nhận / Đang đóng gói',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Package,
    stepIndex: 2,
  },
  shipping: {
    label: 'Đang vận chuyển',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Truck,
    stepIndex: 3,
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle,
    stepIndex: 4,
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    stepIndex: 0,
  },
};

const TRACKING_STEPS = [
  { step: 1, label: 'Đặt hàng', desc: 'Đã tạo đơn thành công' },
  { step: 2, label: 'Xác nhận', desc: 'Dược sĩ duyệt đơn thuốc' },
  { step: 3, label: 'Vận chuyển', desc: 'Đang giao tận nơi' },
  { step: 4, label: 'Hoàn thành', desc: 'Đã nhận hàng an toàn' },
];

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { user } = useSelector((state) => state.auth);

  // Active tab state
  const activeTabParam = searchParams.get('tab') || 'info';
  const [activeTab, setActiveTab] = useState(activeTabParam);

  // Profile update state
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Change password state
  const [changingPass, setChangingPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Security preferences
  const [privacySettings, setPrivacySettings] = useState({
    encryptPrescription: true,
    shareHealthLogs: false,
    twoFactorEnabled: true,
  });

  // Sync tab param with state
  useEffect(() => {
    if (activeTabParam !== activeTab) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Profile form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  // Password form
  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Fetch orders
  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await getMyOrders(user?.email, user?.phone);
      setOrders(res?.data || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchUserOrders();
    }
  }, [activeTab, user]);

  // Submit Profile update
  const onSaveProfile = async (formData) => {
    setUpdatingProfile(true);
    try {
      const res = await updateProfile({
        email: user?.email,
        ...formData,
      });

      const updatedUser = res?.data?.user || { ...user, ...formData };
      dispatch(updateProfileSuccess(updatedUser));
      toast.success('Cập nhật thông tin cá nhân thành công!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Submit Password change
  const onChangePasswordSubmit = async (formData) => {
    setChangingPass(true);
    try {
      const res = await changePassword({
        email: user?.email,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      toast.success(res?.message || 'Đổi mật khẩu thành công!');
      resetPasswordForm();
    } catch (err) {
      const msg = err.response?.data?.message || 'Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.';
      toast.error(msg);
    } finally {
      setChangingPass(false);
    }
  };

  // Order track search
  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!searchOrderId.trim()) return;

    setLoadingOrders(true);
    try {
      const res = await trackOrder(searchOrderId.trim());
      if (res?.data) {
        setSelectedOrder(res.data);
        toast.success(`Tìm thấy thông tin đơn hàng ${searchOrderId}`);
      }
    } catch (err) {
      toast.error(`Không tìm thấy đơn hàng mã ${searchOrderId}`);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Status Counts for Tabs
  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'pending_verification').length,
    shipping: orders.filter((o) => o.status === 'shipping' || o.status === 'processing').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  // Filtered orders list
  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending') return ord.status === 'pending' || ord.status === 'pending_verification';
    if (orderFilter === 'shipping') return ord.status === 'shipping' || ord.status === 'processing';
    return ord.status === orderFilter;
  });

  return (
    <PageTransition className="bg-bg min-h-screen pt-28 pb-20">
      <div className="max-w-[1240px] mx-auto px-5 lg:px-10 space-y-8">

        {/* ── Header Banner Profile Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0b3d2e] via-[#14532d] to-[#042f2e] text-white p-8 sm:p-10 shadow-xl"
        >
          {/* Subtle bg glow shapes */}
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute left-1/3 -bottom-16 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-8 z-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Avatar circle */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl gradient-primary flex items-center justify-center text-4xl font-extrabold text-white shadow-xl border-4 border-white/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-[#0b3d2e]">
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
                    {user?.name || 'Khách hàng PharmAI'}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5 shadow-xs">
                    <Sparkles size={14} /> Thành viên xác thực
                  </span>
                </div>
                <p className="text-white/90 text-sm sm:text-base font-medium flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <Mail size={16} className="text-emerald-400" /> {user?.email}
                </p>
                <p className="text-white/70 text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-2">
                  <Phone size={15} className="text-emerald-400" /> {user?.phone || 'Chưa cập nhật số điện thoại'}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-7 py-4 rounded-2xl border border-white/15 shrink-0">
              <div className="text-center px-3">
                <p className="text-xs text-white/70 font-medium">Tổng đơn hàng</p>
                <p className="text-2xl font-extrabold text-emerald-300 mt-0.5">{orders.length}</p>
              </div>
              <div className="w-[1px] h-10 bg-white/20" />
              <div className="text-center px-3">
                <p className="text-xs text-white/70 font-medium">Bảo mật OTP</p>
                <p className="text-xs font-bold text-green-400 flex items-center justify-center gap-1 mt-1.5">
                  <ShieldCheck size={16} /> Đã kích hoạt
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center justify-start sm:justify-center border-b border-border/80 overflow-x-auto scrollbar-none gap-2 sm:gap-4 bg-surface p-2 rounded-2xl border shadow-xs">
          {[
            { id: 'info', label: 'Thông tin cá nhân', icon: User },
            { id: 'orders', label: 'Đơn hàng & Theo dõi', icon: Package, badge: orders.length },
            { id: 'security', label: 'Bảo mật & Quyền riêng tư', icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-primary bg-primary-light shadow-xs'
                    : 'text-text-secondary hover:text-primary hover:bg-bg'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary' : 'text-text-muted'} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-primary text-white ml-1">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBorder"
                    className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab Contents ── */}
        <AnimatePresence mode="wait">

          {/* ════ TAB 1: THÔNG TIN CÁ NHÂN ════ */}
          {activeTab === 'info' && (
            <motion.div
              key="tab-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Form Card */}
              <div className="lg:col-span-8 bg-surface border border-border rounded-[24px] p-8 sm:p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-4 pb-5 border-b border-border/80">
                  <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-text-primary">Chỉnh sửa thông tin cá nhân</h2>
                    <p className="text-xs sm:text-sm text-text-muted mt-0.5">Cập nhật thông tin giao hàng & liên hệ mặc định của bạn</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-text-primary mb-2">
                        Họ và tên người nhận
                      </label>
                      <Input
                        label="Nhập họ và tên đầy đủ"
                        type="text"
                        icon={<User size={18} />}
                        error={profileErrors.name?.message}
                        {...regProfile('name')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-primary mb-2">
                        Số điện thoại liên hệ
                      </label>
                      <Input
                        label="Nhập số điện thoại"
                        type="tel"
                        icon={<Phone size={18} />}
                        error={profileErrors.phone?.message}
                        {...regProfile('phone')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">
                      Địa chỉ Email (Xác thực hệ thống)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-bg/80 border border-border rounded-xl px-4.5 py-3.5 text-sm sm:text-base text-text-muted cursor-not-allowed font-medium pl-11"
                      />
                      <Mail size={18} className="absolute left-4 top-4 text-text-muted" />
                      <span className="absolute right-4 top-3.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1">
                        <Check size={14} /> Đã xác thực
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">
                      Địa chỉ nhận hàng mặc định
                    </label>
                    <Input
                      label="Nhập số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                      type="text"
                      icon={<MapPin size={18} />}
                      placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                      error={profileErrors.address?.message}
                      {...regProfile('address')}
                    />
                  </div>

                  <div className="pt-6 border-t border-border/80 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="px-8 py-4 text-base font-bold shadow-md hover:shadow-lg transition-all"
                      loading={updatingProfile}
                      icon={<CheckCircle2 size={20} />}
                    >
                      Lưu thay đổi thông tin
                    </Button>
                  </div>
                </form>
              </div>

              {/* Sidebar Info Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-surface border border-border rounded-[24px] p-8 shadow-sm space-y-6">
                  <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2.5 pb-4 border-b border-border/80">
                    <ShieldCheck className="text-primary" size={22} /> Quyền lợi tài khoản
                  </h3>
                  <ul className="space-y-4 text-xs sm:text-sm text-text-secondary font-medium">
                    <li className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>Dược sĩ chuyên môn hỗ trợ tư vấn đơn thuốc 24/7.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>Theo dõi tiến trình đơn hàng 4 bước theo thời gian thực.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>Dữ liệu y tế và lịch sử đơn thuốc bảo mật tuyệt đối.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ TAB 2: ĐƠN HÀNG & THEO DÕI (Shopee Design + PharmAI Primary Color) ════ */}
          {activeTab === 'orders' && (
            <motion.div
              key="tab-orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* 1. Shopee Status Tabs Bar (PharmAI Brand Color) */}
              <div className="bg-surface border border-border/80 shadow-xs overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between overflow-x-auto scrollbar-none bg-surface">
                  {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'pending', label: 'Chờ xác nhận' },
                    { key: 'shipping', label: 'Đang giao' },
                    { key: 'completed', label: 'Hoàn thành' },
                    { key: 'cancelled', label: 'Đã hủy' },
                  ].map((f) => {
                    const count = statusCounts[f.key] || 0;
                    const isActive = orderFilter === f.key;
                    return (
                      <button
                        key={f.key}
                        onClick={() => setOrderFilter(f.key)}
                        className={`flex-1 min-w-max px-6 py-4 text-sm sm:text-base font-extrabold transition-all relative border-b-2 cursor-pointer text-center ${
                          isActive
                            ? 'border-primary text-primary bg-primary/10'
                            : 'border-transparent text-text-secondary hover:text-primary hover:bg-surface-hover'
                        }`}
                      >
                        <span>{f.label}</span>
                        {count > 0 && (
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-extrabold ${
                              isActive ? 'bg-primary text-white' : 'bg-bg text-text-muted border border-border'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Order Tracking Stepper Drawer / Card (if selected) */}
              {selectedOrder && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-950/5 border border-emerald-500/30 rounded-2xl p-6 relative shadow-sm"
                >
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="absolute top-5 right-5 text-xs sm:text-sm font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    ✕ Đóng chi tiết
                  </button>

                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      Hành trình vận chuyển
                    </span>
                    <span className="text-sm sm:text-base font-mono font-extrabold text-text-primary">
                      #{selectedOrder.id}
                    </span>
                  </div>

                  {/* Visual 4-Step Progress Bar */}
                  <div className="bg-surface p-6 rounded-2xl border border-border shadow-xs">
                    {selectedOrder.status === 'cancelled' ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-bold">
                        <XCircle size={20} />
                        <span>Đơn hàng này đã bị hủy.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-3 relative">
                        {TRACKING_STEPS.map((st) => {
                          const currentStep = ORDER_STATUS_MAP[selectedOrder.status]?.stepIndex || 1;
                          const isDone = st.step <= currentStep;
                          const isCurrent = st.step === currentStep;

                          return (
                            <div key={st.step} className="flex flex-col items-center text-center relative z-10">
                              <div
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold border-2 transition-all ${
                                  isDone
                                    ? 'bg-primary border-primary text-white shadow-md'
                                    : 'bg-surface border-border text-text-muted'
                                } ${isCurrent ? 'ring-4 ring-primary/20 scale-105' : ''}`}
                              >
                                {isDone ? <Check size={18} /> : st.step}
                              </div>
                              <p className={`text-xs font-bold mt-2 ${isDone ? 'text-text-primary' : 'text-text-muted'}`}>
                                {st.label}
                              </p>
                              <p className="text-[11px] text-text-muted hidden sm:block mt-0.5">
                                {st.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 3. Order List (Shopee Style + Larger Typography & PharmAI Green Theme) */}
              {loadingOrders ? (
                <div className="p-16 text-center text-text-muted space-y-4 bg-surface border border-border rounded-2xl">
                  <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-medium">Đang tải danh sách đơn hàng...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-16 text-center space-y-5 shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Package size={36} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-text-primary">Chưa có đơn hàng nào</h3>
                    <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto mt-1">
                      Bạn chưa có đơn hàng nào ở trạng thái này. Hãy trải nghiệm mua sắm thuốc chính hãng nhé!
                    </p>
                  </div>
                  <Button variant="primary" size="md" className="px-7 py-3 text-xs sm:text-sm font-extrabold" onClick={() => navigate('/search')}>
                    Khám phá nhà thuốc ngay
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((ord) => {
                    const isCompleted = ord.status === 'completed';
                    const isCancelled = ord.status === 'cancelled';
                    const isShipping = ord.status === 'shipping' || ord.status === 'processing';
                    
                    let statusText = 'CHỜ XÁC NHẬN';
                    let statusColor = 'text-amber-600 font-extrabold';
                    let statusSub = '';

                    if (isCompleted) {
                      statusText = 'HOÀN THÀNH';
                      statusColor = 'text-primary font-extrabold';
                      statusSub = '🚚 Giao hàng thành công';
                    } else if (isCancelled) {
                      statusText = 'ĐÃ HỦY';
                      statusColor = 'text-gray-500 font-bold';
                      statusSub = 'Đã hủy bởi người mua';
                    } else if (isShipping) {
                      statusText = 'ĐANG GIAO HÀNG';
                      statusColor = 'text-emerald-600 font-extrabold';
                      statusSub = '🚚 Đơn hàng đang trên đường giao';
                    } else if (ord.status === 'pending_verification') {
                      statusText = 'CHỜ DUYỆT CK';
                      statusColor = 'text-indigo-600 font-extrabold';
                      statusSub = '💳 Đã chuyển khoản VNPAY';
                    }

                    return (
                      <motion.div
                        key={ord.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface border border-border/80 rounded-2xl shadow-xs overflow-hidden hover:border-primary/40 transition-all duration-200"
                      >
                        {/* Header: Shop Name & Status */}
                        <div className="px-6 py-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm bg-surface-hover/30">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-text-primary flex items-center gap-2 text-sm sm:text-base">
                              <Store size={18} className="text-primary" />
                              PharmAI Official
                            </span>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                              Chat
                            </span>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-bg text-text-secondary border border-border">
                              Xem Shop
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {statusSub && (
                              <span className="text-emerald-700 font-medium text-xs sm:text-sm hidden sm:inline">
                                {statusSub}
                              </span>
                            )}
                            {statusSub && <span className="text-text-muted hidden sm:inline">|</span>}
                            <span className={`uppercase tracking-wider ${statusColor}`}>
                              {statusText}
                            </span>
                          </div>
                        </div>

                        {/* Items List (Larger thumbnails & text) */}
                        <div className="p-5 sm:p-6 space-y-4">
                          {ord.orderItems && ord.orderItems.length > 0 ? (
                            ord.orderItems.map((item, idx) => {
                              const drug = item.drug || {};
                              const drugImage = drug.image || '/images/paracetamol.png';

                              return (
                                <div key={idx} className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    {/* Larger Thumbnail Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-border/80 p-1.5 shrink-0 bg-white flex items-center justify-center overflow-hidden shadow-xs">
                                      <img
                                        src={drugImage}
                                        alt={drug.name || 'Thuốc'}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60';
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-extrabold text-text-primary text-sm sm:text-base line-clamp-1">
                                        {drug.name || 'Sản phẩm thuốc'}
                                      </h4>
                                      <p className="text-text-muted text-xs sm:text-sm">
                                        Phân loại hàng: <span className="font-semibold text-text-secondary">{drug.form || 'Hộp'}</span> {drug.dosage ? `• ${drug.dosage}` : ''}
                                      </p>
                                      <p className="text-text-secondary font-bold text-xs sm:text-sm">
                                        x{item.quantity} sản phẩm
                                      </p>
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0 font-mono text-sm sm:text-base font-extrabold text-text-primary">
                                    {formatCurrency(item.price || drug.price || 0)}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-xs text-text-muted italic">Đang cập nhật chi tiết...</div>
                          )}
                        </div>

                        {/* Separator Dashed Line */}
                        <div className="border-t border-dashed border-border/80 mx-6" />

                        {/* Total & Action Footer Bar */}
                        <div className="p-5 sm:p-6 space-y-4 bg-surface">
                          {/* Right Aligned Total Price */}
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-text-secondary text-sm sm:text-base font-medium">Thành tiền:</span>
                            <span className="text-xl sm:text-2xl font-extrabold text-primary font-mono">
                              {formatCurrency(ord.totalPrice)}
                            </span>
                          </div>

                          {/* Right Aligned Action Buttons */}
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => navigate('/search')}
                              className="px-7 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold gradient-primary text-white hover:opacity-95 transition-all cursor-pointer shadow-xs"
                            >
                              Mua Lại
                            </button>

                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-border text-text-primary hover:border-primary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                            >
                              Theo Dõi Đơn
                            </button>

                            {(user?.role === 'ROLE_ADMIN' || user?.email?.includes('admin')) && (ord.status === 'pending_verification' || ord.status === 'pending') && (
                              <button
                                onClick={async () => {
                                  try {
                                    await updateOrderStatus(ord.id, 'completed');
                                    toast.success(`Đã duyệt đơn hàng ${ord.id} thành công!`);
                                    fetchUserOrders();
                                  } catch (e) {
                                    toast.error('Lỗi khi duyệt đơn');
                                  }
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                              >
                                Duyệt CK (Admin)
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ════ TAB 3: BẢO MẬT & QUYỀN RIÊNG TƯ ════ */}
          {activeTab === 'security' && (
            <motion.div
              key="tab-security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Form Change Password */}
              <div className="lg:col-span-8 bg-surface border border-border rounded-[24px] p-8 sm:p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-4 pb-5 border-b border-border/80">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-text-primary">Đổi mật khẩu tài khoản</h2>
                    <p className="text-xs sm:text-sm text-text-muted mt-0.5">Tăng cường an toàn dữ liệu và quyền riêng tư cá nhân</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit(onChangePasswordSubmit)} className="space-y-6">
                  {/* Old Password */}
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full bg-surface border border-border rounded-xl px-4.5 py-3.5 text-sm sm:text-base pl-11 focus:border-primary outline-none font-medium"
                        {...regPassword('oldPassword')}
                      />
                      <KeyRound size={18} className="absolute left-4 top-4 text-text-muted" />
                      <button
                        type="button"
                        onClick={() => setShowOldPass(!showOldPass)}
                        className="absolute right-4 top-4 text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passErrors.oldPassword && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">{passErrors.oldPassword.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full bg-surface border border-border rounded-xl px-4.5 py-3.5 text-sm sm:text-base pl-11 focus:border-primary outline-none font-medium"
                        {...regPassword('newPassword')}
                      />
                      <Lock size={18} className="absolute left-4 top-4 text-text-muted" />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-4 top-4 text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passErrors.newPassword && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">{passErrors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full bg-surface border border-border rounded-xl px-4.5 py-3.5 text-sm sm:text-base pl-11 focus:border-primary outline-none font-medium"
                        {...regPassword('confirmPassword')}
                      />
                      <Lock size={18} className="absolute left-4 top-4 text-text-muted" />
                    </div>
                    {passErrors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">{passErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="pt-6 border-t border-border/80 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="px-8 py-4 text-base font-bold shadow-md hover:shadow-lg transition-all"
                      loading={changingPass}
                      icon={<ShieldCheck size={20} />}
                    >
                      Cập nhật mật khẩu mới
                    </Button>
                  </div>
                </form>
              </div>

              {/* Privacy & Security Controls */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-surface border border-border rounded-[24px] p-8 shadow-sm space-y-6">
                  <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2.5 pb-4 border-b border-border/80">
                    <ShieldAlert size={22} className="text-emerald-600" />
                    Quyền riêng tư y tế
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-bg border border-border/70">
                      <div>
                        <p className="text-sm font-bold text-text-primary">Mã hóa đơn thuốc</p>
                        <p className="text-xs text-text-muted mt-0.5">Chỉ dược sĩ PharmAI được phép truy cập</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.encryptPrescription}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, encryptPrescription: e.target.checked })}
                        className="w-5 h-5 accent-primary rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-bg border border-border/70">
                      <div>
                        <p className="text-sm font-bold text-text-primary">Xác thực OTP Gmail</p>
                        <p className="text-xs text-text-muted mt-0.5">Bảo vệ đăng nhập & khôi phục</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        Hoạt động
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-[24px] p-6 text-amber-900 text-xs sm:text-sm space-y-3">
                  <div className="flex items-center gap-2 font-bold text-amber-800 text-base">
                    <AlertCircle size={18} /> Lời khuyên an toàn
                  </div>
                  <p className="leading-relaxed font-medium">
                    PharmAI tuân thủ nghiêm ngặt chuẩn bảo mật thông tin y tế. Không bao giờ chia sẻ mã OTP hoặc mật khẩu cho bất kỳ ai.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
