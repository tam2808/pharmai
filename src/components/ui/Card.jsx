import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Card — Component card tái sử dụng
 *
 * @param {string} variant - default | elevated | bordered
 * @param {boolean} hover - Bật hover animation (scale + shadow)
 * @param {string} padding - Padding class
 * @param {string} className - Custom classes
 */
const cardVariants = {
  default: 'bg-surface shadow-card',
  elevated: 'bg-surface shadow-hover',
  bordered: 'bg-surface border border-border',
};

export default function Card({
  variant = 'default',
  hover = false,
  padding = 'p-4',
  className,
  children,
  onClick,
  ...props
}) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: {
          scale: 1.02,
          boxShadow: 'var(--shadow-hover)',
          transition: { duration: 0.25, ease: 'easeOut' },
        },
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-xl transition-shadow duration-200',
        cardVariants[variant],
        padding,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
}
