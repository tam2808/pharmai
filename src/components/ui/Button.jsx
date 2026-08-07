import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * Button — Component nút bấm tái sử dụng
 *
 * @param {string} variant - primary | secondary | outline | accent | ghost | danger
 * @param {string} size - sm | md | lg
 * @param {boolean} loading - Hiển thị spinner + disable
 * @param {boolean} fullWidth - Full width
 * @param {string} className - Custom classes
 * @param {ReactNode} icon - Icon bên trái
 * @param {ReactNode} children - Nội dung nút
 */

const variants = {
  primary:
    'bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-90 shadow-sm',
  secondary:
    'bg-primary-light text-primary hover:bg-primary-light/80',
  outline:
    'border border-border text-text-primary bg-white hover:bg-primary-light hover:border-primary hover:text-primary',
  accent:
    'bg-gradient-to-r from-accent to-accent-dark text-white hover:opacity-90 shadow-sm',
  ghost:
    'text-text-secondary hover:text-primary hover:bg-primary-light',
  danger:
    'bg-error text-white hover:bg-error/90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  children,
  className,
  ...props
}) {
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  // Ripple effect — tạo span tại điểm click
  const handleClick = (e) => {
    if (disabled || loading) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y, size }]);

    // Xóa ripple khỏi DOM sau 600ms
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    // Gọi onClick gốc
    if (props.onClick) props.onClick(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative overflow-hidden inline-flex items-center justify-center font-medium',
        'rounded-lg transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
      onClick={handleClick}
    >
      {/* Ripple spans */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-span"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}

      {/* Icon */}
      {!loading && icon && <span className="shrink-0">{icon}</span>}

      {/* Content */}
      {children && <span>{children}</span>}
    </motion.button>
  );
}
