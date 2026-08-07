import { cn } from '../../utils/helpers';

/**
 * Badge — Component nhãn nhỏ
 *
 * @param {string} variant - primary | warning | success | error | neutral
 * @param {string} size - sm | md
 * @param {ReactNode} children - Nội dung
 */
const badgeVariants = {
  primary: 'bg-primary-light text-primary-dark border border-primary/20',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  variant = 'primary',
  size = 'md',
  className,
  children,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md whitespace-nowrap',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
