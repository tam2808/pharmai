import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Search,
  Plus,
  Edit2,
  Lock,
  Unlock,
  Key,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  toggleCustomerStatus,
  resetCustomerPassword,
  deleteCustomer,
} from '../../services/adminApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, active, locked, admin

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [resetPassCustomer, setResetPassCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  // Form States
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'ROLE_USER',
    enabled: true,
  });

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    role: 'ROLE_USER',
    enabled: true,
  });

  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch customers error:', err);
      toast.error('Không thể tải danh sách khách hàng từ hệ thống');
    } finally {
      setLoading(false);
    }
  };

  // Stat calculations
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.enabled).length;
    const locked = customers.filter((c) => !c.enabled).length;
    const admins = customers.filter((c) => c.role === 'ROLE_ADMIN').length;
    return { total, active, locked, admins };
  }, [customers]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Tab filter
      if (activeTab === 'active' && !c.enabled) return false;
      if (activeTab === 'locked' && c.enabled) return false;
      if (activeTab === 'admin' && c.role !== 'ROLE_ADMIN') return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const name = (c.name || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q);
      }

      return true;
    });
  }, [customers, activeTab, search]);

  // Handlers
  const handleToggleStatus = async (customer) => {
    try {
      const res = await toggleCustomerStatus(customer.id);
      toast.success(res.message || 'Cập nhật trạng thái thành công');
      setCustomers((prev) =>
        prev.map((item) => (item.id === customer.id ? { ...item, enabled: res.enabled } : item))
      );
    } catch (err) {
      console.error(err);
      toast.error('Không thể thay đổi trạng thái tài khoản');
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!createForm.email || !createForm.password) {
      toast.error('Vui lòng nhập Email và Mật khẩu');
      return;
    }
    setSubmitting(true);
    try {
      const res = await createCustomer(createForm);
      toast.success(res.message || 'Tạo tài khoản khách hàng thành công!');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        role: 'ROLE_USER',
        enabled: true,
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Tạo tài khoản thất bại';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setEditForm({
      name: customer.name || '',
      phone: customer.phone || '',
      address: customer.address || '',
      role: customer.role || 'ROLE_USER',
      enabled: customer.enabled !== false,
    });
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setSubmitting(true);
    try {
      const res = await updateCustomer(editingCustomer.id, editForm);
      toast.success(res.message || 'Cập nhật thông tin thành công!');
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error('Không thể cập nhật thông tin khách hàng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPassCustomer || !newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    setSubmitting(true);
    try {
      const res = await resetCustomerPassword(resetPassCustomer.id, newPassword);
      toast.success(res.message || 'Đã đổi mật khẩu thành công!');
      setResetPassCustomer(null);
      setNewPassword('');
    } catch (err) {
      console.error(err);
      toast.error('Đặt lại mật khẩu thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    setSubmitting(true);
    try {
      const res = await deleteCustomer(deletingCustomer.id);
      toast.success(res.message || 'Đã xóa tài khoản khách hàng thành công');
      setCustomers((prev) => prev.filter((item) => item.id !== deletingCustomer.id));
      setDeletingCustomer(null);
    } catch (err) {
      console.error(err);
      toast.error('Không thể xóa tài khoản khách hàng');
    } finally {
      setSubmitting(false);
    }
  };

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight font-display flex items-center gap-3">
            <Users className="text-primary" size={28} />
            Quản Lý Khách Hàng & Tài Khoản
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Quản lý tài khoản người dùng, phân quyền, khóa/mở khóa tài khoản và thống kê mua hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="p-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-colors shadow-xs"
            title="Tải lại danh sách"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <Button onClick={() => setShowCreateModal(true)} icon={<Plus size={18} />}>
            Thêm Khách Hàng Mới
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Tổng Khách Hàng</p>
            <p className="text-2xl font-extrabold text-text-primary mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Đang Hoạt Động</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{stats.active}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Tài Khoản Đã Khóa</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-0.5">{stats.locked}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Quản Trị Viên</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">{stats.admins}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-bg rounded-xl border border-border">
          {[
            { key: 'all', label: `Tất cả (${stats.total})` },
            { key: 'active', label: `Đang hoạt động (${stats.active})` },
            { key: 'locked', label: `Đã khóa (${stats.locked})` },
            { key: 'admin', label: `Admin (${stats.admins})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-surface text-primary shadow-xs border border-border'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, sđt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-bg border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-surface border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg/50 text-[11px] font-extrabold uppercase text-text-muted tracking-wider">
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Số điện thoại / Địa chỉ</th>
                <th className="py-4 px-6">Vai trò</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Đơn hàng</th>
                <th className="py-4 px-6 text-right">Tổng chi tiêu</th>
                <th className="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs text-text-primary">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Đang tải danh sách tài khoản...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    Không tìm thấy tài khoản khách hàng nào khớp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const initial = (customer.name || customer.email || 'U').charAt(0).toUpperCase();
                  const isAdmin = customer.role === 'ROLE_ADMIN';
                  const isEnabled = customer.enabled !== false;

                  return (
                    <tr key={customer.id} className="hover:bg-bg/40 transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-emerald-400 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-text-primary text-sm">{customer.name || 'Chưa đặt tên'}</p>
                            <p className="text-[11px] text-text-muted font-mono">{customer.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Address */}
                      <td className="py-4 px-6 max-w-[200px]">
                        <p className="font-medium text-text-secondary">{customer.phone || 'Chưa cập nhật'}</p>
                        <p className="text-[11px] text-text-muted truncate" title={customer.address || ''}>
                          {customer.address || 'Chưa nhập địa chỉ'}
                        </p>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            <ShieldAlert size={12} />
                            Quản trị viên
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-bg text-text-secondary border border-border">
                            Khách hàng
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {isEnabled ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            <Lock size={12} />
                            Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Order Count */}
                      <td className="py-4 px-6 text-center font-bold text-text-primary">
                        <span className="px-2.5 py-1 rounded-lg bg-bg border border-border">
                          {customer.orderCount || 0} đơn
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-4 px-6 text-right font-extrabold text-primary">
                        {formatVND(customer.totalSpent)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Toggle Status Switch */}
                          <button
                            onClick={() => handleToggleStatus(customer)}
                            className={`p-2 rounded-xl border transition-colors ${
                              isEnabled
                                ? 'border-border text-emerald-600 hover:bg-emerald-50'
                                : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            }`}
                            title={isEnabled ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {isEnabled ? <Unlock size={15} /> : <Lock size={15} />}
                          </button>

                          {/* View Detail */}
                          <button
                            onClick={() => setViewCustomer(customer)}
                            className="p-2 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit Profile */}
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-2 rounded-xl border border-border text-text-secondary hover:text-primary hover:bg-bg transition-colors"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => setResetPassCustomer(customer)}
                            className="p-2 rounded-xl border border-border text-text-secondary hover:text-amber-600 hover:bg-bg transition-colors"
                            title="Đổi mật khẩu"
                          >
                            <Key size={15} />
                          </button>

                          {/* Delete Account */}
                          <button
                            onClick={() => setDeletingCustomer(customer)}
                            className="p-2 rounded-xl border border-border text-text-secondary hover:text-rose-600 hover:bg-bg transition-colors"
                            title="Xóa tài khoản"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Create Customer Modal */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-border space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-lg font-extrabold text-text-primary flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  Thêm Khách Hàng Mới
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-4">
                <Input
                  label="Họ và tên *"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="nguyenvana@gmail.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Mật khẩu *"
                    type="password"
                    placeholder="••••••••"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Số điện thoại"
                    placeholder="0987654321"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  />
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">Vai trò</label>
                    <select
                      value={createForm.role}
                      onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-bg border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
                    >
                      <option value="ROLE_USER">Khách hàng (ROLE_USER)</option>
                      <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Địa chỉ giao hàng"
                  placeholder="123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                />

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="createEnabled"
                    checked={createForm.enabled}
                    onChange={(e) => setCreateForm({ ...createForm, enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="createEnabled" className="text-xs font-semibold text-text-secondary cursor-pointer">
                    Kích hoạt tài khoản ngay sau khi tạo
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border border-border text-text-secondary hover:bg-bg"
                  >
                    Hủy bỏ
                  </button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* Edit Customer Modal */}
      {/* ============================================================ */}
      <AnimatePresence>
        {editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-border space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-lg font-extrabold text-text-primary flex items-center gap-2">
                  <Edit2 size={20} className="text-primary" />
                  Chỉnh Sửa Khách Hàng #{editingCustomer.id}
                </h3>
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateCustomer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5">Email (Cố định)</label>
                  <input
                    type="text"
                    value={editingCustomer.email}
                    disabled
                    className="w-full px-3.5 py-2.5 text-xs bg-bg/60 border border-border rounded-xl text-text-muted font-mono cursor-not-allowed"
                  />
                </div>

                <Input
                  label="Họ và tên"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Số điện thoại"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">Vai trò</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-bg border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
                    >
                      <option value="ROLE_USER">Khách hàng (ROLE_USER)</option>
                      <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Địa chỉ"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editEnabled"
                    checked={editForm.enabled}
                    onChange={(e) => setEditForm({ ...editForm, enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="editEnabled" className="text-xs font-semibold text-text-secondary cursor-pointer">
                    Trạng thái hoạt động (Cho phép đăng nhập)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border border-border text-text-secondary hover:bg-bg"
                  >
                    Hủy bỏ
                  </button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* Reset Password Modal */}
      {/* ============================================================ */}
      <AnimatePresence>
        {resetPassCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
                  <Key size={20} className="text-amber-500" />
                  Đặt Thụ Mật Khẩu
                </h3>
                <button
                  onClick={() => setResetPassCustomer(null)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-text-muted">
                Đổi mật khẩu đăng nhập cho khách hàng{' '}
                <strong className="text-text-primary font-mono">{resetPassCustomer.email}</strong>.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="Mật khẩu mới *"
                  type="text"
                  placeholder="Nhập mật khẩu mới..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setResetPassCustomer(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border border-border text-text-secondary hover:bg-bg"
                  >
                    Hủy
                  </button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Xác Nhận Đổi Mật Khẩu'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* View Customer Details Modal */}
      {/* ============================================================ */}
      <AnimatePresence>
        {viewCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-border space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-emerald-400 text-white font-extrabold text-lg flex items-center justify-center">
                    {(viewCustomer.name || viewCustomer.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-text-primary">{viewCustomer.name || 'Khách hàng'}</h3>
                    <p className="text-xs text-text-muted font-mono">{viewCustomer.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewCustomer(null)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-bg border border-border space-y-1">
                  <p className="text-text-muted font-bold flex items-center gap-1.5">
                    <Phone size={13} /> Số điện thoại
                  </p>
                  <p className="font-semibold text-text-primary">{viewCustomer.phone || 'Chưa cập nhật'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-bg border border-border space-y-1">
                  <p className="text-text-muted font-bold flex items-center gap-1.5">
                    <ShoppingBag size={13} /> Số đơn đặt mua
                  </p>
                  <p className="font-extrabold text-primary">{viewCustomer.orderCount || 0} đơn hàng</p>
                </div>
                <div className="p-3.5 rounded-xl bg-bg border border-border space-y-1 col-span-2">
                  <p className="text-text-muted font-bold flex items-center gap-1.5">
                    <MapPin size={13} /> Địa chỉ giao hàng mặc định
                  </p>
                  <p className="font-semibold text-text-primary">{viewCustomer.address || 'Chưa nhập địa chỉ'}</p>
                </div>
              </div>

              {/* Spending Summary */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-600">Tổng Chi Tiêu Đơn Hoàn Thành</p>
                  <p className="text-xl font-black text-emerald-700 mt-0.5">{formatVND(viewCustomer.totalSpent)}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white">
                  VIP Customer
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewCustomer(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* Delete Confirmation Modal */}
      {/* ============================================================ */}
      <AnimatePresence>
        {deletingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600 pb-2 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <Trash2 size={20} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-text-primary">Xóa Tài Khoản Khách Hàng</h3>
                  <p className="text-xs text-text-muted font-mono">{deletingCustomer.email}</p>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Bạn có chắc chắn muốn xóa tài khoản của khách hàng{' '}
                <strong className="text-text-primary">{deletingCustomer.name || deletingCustomer.email}</strong>?
                Hành động này sẽ xóa dữ liệu người dùng khỏi hệ thống CSDL.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setDeletingCustomer(null)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-border text-text-secondary hover:bg-bg"
                >
                  Bỏ qua
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCustomer}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
                >
                  {submitting ? 'Đang xóa...' : 'Xác Nhận Xóa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
