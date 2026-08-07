import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  XCircle,
  Pill,
  BarChart2,
} from 'lucide-react';
import { getRevenueReport } from '../../services/adminApi';
import { formatCurrency } from '../../utils/helpers';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

function StatCard({ icon: Icon, label, value, color, colorLight, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/20 hover:shadow-xs transition-all duration-200"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorLight}`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-text-primary text-2xl font-bold font-display">{value}</p>
      </div>
    </motion.div>
  );
}

function RevenueChart({ data }) {
  if (!data || Object.keys(data).length === 0) return null;

  const sorted = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  const values = sorted.map(([, v]) => v);
  const max = Math.max(...values) || 1;

  const W = 600;
  const H = 200;
  const pad = { top: 20, right: 24, bottom: 50, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const pts = sorted.map(([, v], i) => ({
    x: pad.left + (i / Math.max(sorted.length - 1, 1)) * chartW,
    y: pad.top + (1 - v / max) * chartH,
    v,
    label: sorted[i][0].slice(5), // MM-DD
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD =
    `M ${pts[0].x} ${pad.top + chartH} ` +
    pts.map((p) => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${pts[pts.length - 1].x} ${pad.top + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = pad.top + f * chartH;
        const val = max * (1 - f);
        return (
          <g key={i}>
            <line x1={pad.left} x2={pad.left + chartW} y1={y} y2={y} stroke="rgba(15,23,42,0.06)" strokeDasharray="4 4" />
            <text x={pad.left - 8} y={y + 4} fill="rgba(15,23,42,0.4)" fontSize="9" textAnchor="end">
              {val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaD} fill="url(#area-grad)" />

      {/* Line */}
      <path d={pathD} stroke="#0EA5E9" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Points */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4.5} fill="#0EA5E9" stroke="#ffffff" strokeWidth="2.5" />
          <text x={p.x} y={pad.top + chartH + 16} fill="rgba(15,23,42,0.5)" fontSize="9" textAnchor="middle">
            {p.label}
          </text>
          <text x={p.x} y={p.y - 10} fill="rgba(15,23,42,0.7)" fontSize="9" textAnchor="middle" className="font-semibold">
            {p.v >= 1000000 ? `${(p.v / 1000000).toFixed(1)}M` : `${(p.v / 1000).toFixed(0)}K`}
          </text>
        </g>
      ))}
    </svg>
  );
}

function TopDrugBar({ name, quantity, max }) {
  const pct = max > 0 ? (quantity / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-primary font-semibold truncate max-w-[200px]">{name}</span>
        <span className="text-text-secondary ml-2 shrink-0">{quantity} sản phẩm</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full gradient-primary rounded-full"
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevenueReport()
      .then((res) => setReport(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      icon: TrendingUp,
      label: 'Doanh thu',
      value: formatCurrency(report?.totalRevenue || 0),
      color: 'text-emerald-500',
      colorLight: 'bg-emerald-50',
    },
    {
      icon: ShoppingBag,
      label: 'Đơn hoàn thành',
      value: report?.completedOrders ?? 0,
      color: 'text-primary',
      colorLight: 'bg-primary-light',
    },
    {
      icon: Clock,
      label: 'Đơn chờ xử lý',
      value: report?.pendingOrders ?? 0,
      color: 'text-warning',
      colorLight: 'bg-amber-50',
    },
    {
      icon: XCircle,
      label: 'Đơn huỷ',
      value: report?.cancelledOrders ?? 0,
      color: 'text-error',
      colorLight: 'bg-red-50',
    },
  ];

  const topDrugs = report?.topDrugs || [];
  const maxQty = Math.max(...topDrugs.map((d) => d.quantity), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-text-primary font-display tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-text-secondary text-sm mt-1.5">Báo cáo doanh thu và tình hình kinh doanh</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-xs"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <BarChart2 size={18} className="text-primary" />
            <h2 className="text-text-primary font-bold text-sm">Doanh thu theo ngày</h2>
          </div>
          <RevenueChart data={report?.revenueTrend} />
        </motion.div>

        {/* Top Drugs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface border border-border rounded-2xl p-6 shadow-xs"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <Pill size={18} className="text-primary" />
            <h2 className="text-text-primary font-bold text-sm">Thuốc bán chạy nhất</h2>
          </div>
          <div className="space-y-4">
            {topDrugs.length > 0 ? (
              topDrugs.map((drug) => (
                <TopDrugBar key={drug.name} name={drug.name} quantity={drug.quantity} max={maxQty} />
              ))
            ) : (
              <p className="text-text-muted text-sm text-center py-8">Chưa có dữ liệu bán hàng</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Average Order Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary/10 to-primary-light/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between shadow-xs"
      >
        <div>
          <p className="text-primary-dark font-bold text-xs uppercase tracking-wider mb-1">
            Giá trị đơn hàng trung bình
          </p>
          <p className="text-text-primary text-3xl font-extrabold font-display">
            {formatCurrency(report?.averageOrderValue || 0)}
          </p>
        </div>
        <TrendingUp size={48} className="text-primary/20" />
      </motion.div>
    </div>
  );
}
