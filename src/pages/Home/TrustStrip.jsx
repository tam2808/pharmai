import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { formatNumber } from '../../utils/helpers';
import { Package, Users, Award, Truck } from 'lucide-react';

/**
 * AnimatedCounter - Đếm số từ 0 lên target khi hiển thị trên màn hình
 */
function AnimatedCounter({ value, duration = 1600, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;
    const end = parseInt(value, 10);
    if (isNaN(end)) { setCount(value); return; }
    if (end === 0) return;

    const startTime = performance.now();
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      if (elapsed >= duration) { setCount(end); return; }
      // Ease out cubic
      const t = elapsed / duration;
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * end));
      requestAnimationFrame(updateCount);
    };
    requestAnimationFrame(updateCount);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {typeof count === 'number' ? formatNumber(count) : count}
      {suffix}
    </span>
  );
}

const stats = [
  {
    id: 'orders',
    icon: Package,
    value: '12400',
    suffix: '+',
    label: 'Đơn đã xử lý',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    textColor: 'text-sky-600',
  },
  {
    id: 'customers',
    icon: Users,
    value: '8500',
    suffix: '+',
    label: 'Khách hàng',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-600',
  },
  {
    id: 'satisfaction',
    icon: Award,
    value: '98',
    suffix: '.7%',
    label: 'Hài lòng',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    textColor: 'text-violet-600',
  },
  {
    id: 'delivery',
    icon: Truck,
    value: '2',
    suffix: 'h',
    label: 'Giao nhanh',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-600',
  },
];

/**
 * TrustStrip v2 — 4 stats với icons màu sắc, animated counters
 */
export default function TrustStrip() {
  return (
    <div className="bg-white border-b border-border/50 shadow-xs">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`flex items-center gap-3.5 px-6 py-5 ${
                  idx < stats.length - 1 ? 'border-r border-border/40' : ''
                } ${idx >= 2 ? 'border-t border-border/40 lg:border-t-0' : ''}`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 ${stat.iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={stat.iconColor} />
                </div>
                {/* Text */}
                <div>
                  <p className={`text-xl font-extrabold ${stat.textColor} font-display leading-none`}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-text-muted font-medium mt-0.5 leading-tight">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
