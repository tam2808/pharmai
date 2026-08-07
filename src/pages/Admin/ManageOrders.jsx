import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Eye, X, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getAllOrders, updateOrderStatus } from '../../services/adminApi';
import { formatCurrency } from '../../utils/helpers';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600 border border-amber-200' },
  { value: 'completed', label: 'Hoàn thành', color: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  { value: 'cancelled', label: 'Đã huỷ', color: 'bg-red-50 text-red-600 border border-red-200' },
];

const StatusBadge = ({ status }) => {
  const opt = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${opt.color}`}>
      {opt.label}
    </span>
  );
};

const PAGE_SIZE = 10;

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data || []);
    } catch {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = !search ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search);
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (detailOrder?.id === orderId) {
        setDetailOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary font-display tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-text-secondary text-sm mt-1.5">{orders.length} đơn hàng trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm theo mã đơn, tên khách, SĐT..."
            className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/60 transition-colors shadow-xs"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="appearance-none pl-4 pr-10 py-3 bg-surface border border-border rounded-xl text-text-primary text-sm outline-none focus:border-primary/60 transition-colors cursor-pointer shadow-xs"
          >
            <option value="">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              {['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Trạng thái', 'Cập nhật', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-text-muted text-sm">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            ) : (
              paged.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <p className="text-text-primary font-mono font-bold text-xs">{order.id}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-text-primary font-semibold text-sm">{order.fullName}</p>
                    <p className="text-text-secondary text-xs mt-0.5">{order.phone}</p>
                  </td>
                  <td className="px-4 py-4 text-text-secondary text-xs">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-4 text-primary font-mono font-bold text-sm">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-border rounded-lg text-text-secondary text-xs outline-none focus:border-primary/60 cursor-pointer disabled:opacity-50 font-semibold"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      {updatingId === order.id ? (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setDetailOrder(order)}
                      className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-light transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50/30">
            <p className="text-text-secondary text-xs">Trang {page} / {totalPages} · {filtered.length} kết quả</p>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary disabled:opacity-30 hover:bg-slate-100">
                <ChevronLeft size={16} />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary disabled:opacity-30 hover:bg-slate-100">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Drawer / Modal */}
      <AnimatePresence>
        {detailOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={(e) => e.target === e.currentTarget && setDetailOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.25 }}
              className="bg-surface border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface">
                <div>
                  <h2 className="text-text-primary font-bold font-display">Chi tiết đơn hàng</h2>
                  <p className="text-text-secondary text-xs font-mono mt-0.5">{detailOrder.id}</p>
                </div>
                <button onClick={() => setDetailOrder(null)} className="text-text-secondary hover:text-text-primary transition-colors p-1.5 hover:bg-bg rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Customer Info */}
                <div className="bg-slate-50 border border-border rounded-xl p-4 space-y-2.5">
                  <p className="text-xs text-text-primary uppercase tracking-wider font-extrabold mb-3">Thông tin khách hàng</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Họ tên</span>
                    <span className="text-text-primary font-semibold">{detailOrder.fullName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">SĐT</span>
                    <span className="text-text-primary font-semibold">{detailOrder.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Địa chỉ</span>
                    <span className="text-text-primary text-right font-medium max-w-[240px]">{detailOrder.address}</span>
                  </div>
                  {detailOrder.notes && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Ghi chú</span>
                      <span className="text-text-secondary text-right max-w-[200px]">{detailOrder.notes}</span>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                {detailOrder.orderItems && detailOrder.orderItems.length > 0 && (
                  <div>
                    <p className="text-xs text-text-primary uppercase tracking-wider font-extrabold mb-3">Sản phẩm đặt mua</p>
                    <div className="space-y-2">
                      {detailOrder.orderItems.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 border border-border/80 rounded-xl p-3">
                          <div>
                            <p className="text-text-primary text-sm font-semibold">{item.drug?.name}</p>
                            <p className="text-text-secondary text-xs mt-0.5">x{item.quantity}</p>
                          </div>
                          <p className="text-primary font-mono text-sm font-bold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total & Status */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Tổng tiền</p>
                    <p className="text-2xl font-extrabold text-primary font-mono">
                      {formatCurrency(detailOrder.totalPrice)}
                    </p>
                  </div>
                  <StatusBadge status={detailOrder.status} />
                </div>

                {/* Status Change Buttons */}
                <div className="flex gap-2">
                  {STATUS_OPTIONS.filter((s) => s.value !== detailOrder.status).map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(detailOrder.id, s.value)}
                      disabled={updatingId === detailOrder.id}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        s.value === 'completed'
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/80 border-emerald-200'
                          : s.value === 'cancelled'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100/80 border-red-200'
                          : 'bg-amber-50 text-amber-600 hover:bg-amber-100/80 border-amber-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
