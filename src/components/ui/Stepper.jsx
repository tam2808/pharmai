import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * Stepper — Quantity stepper với number transition animation
 *
 * @param {number} value - Giá trị hiện tại
 * @param {function} onIncrement - Tăng
 * @param {function} onDecrement - Giảm
 * @param {number} min - Giá trị tối thiểu (default 1)
 * @param {number} max - Giá trị tối đa (default 99)
 */
export default function Stepper({
  value,
  onIncrement,
  onDecrement,
  onChange,
  min = 1,
  max = 99,
  className,
}) {
  const handleInputChange = (e) => {
    if (!onChange) return;
    const valStr = e.target.value;
    if (valStr === '') {
      onChange('');
      return;
    }
    const val = parseInt(valStr, 10);
    if (!isNaN(val)) {
      const clamped = Math.max(min, Math.min(max, val));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    if (!onChange) return;
    if (value === '' || isNaN(value)) {
      onChange(min);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0 border border-border rounded-lg overflow-hidden bg-surface',
        className
      )}
    >
      {/* Nút giảm */}
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className="p-2 text-text-secondary hover:text-text-primary hover:bg-primary-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Giảm số lượng"
      >
        <Minus size={16} />
      </button>

      {/* Số lượng input để nhập trực tiếp */}
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        className="w-12 h-9 text-center text-sm font-semibold text-text-primary font-mono outline-none border-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {/* Nút tăng */}
      <button
        onClick={onIncrement}
        disabled={value >= max}
        className="p-2 text-text-secondary hover:text-text-primary hover:bg-primary-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Tăng số lượng"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
