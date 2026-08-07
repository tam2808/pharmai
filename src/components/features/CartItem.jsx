import { useDispatch } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { removeFromCart, incrementQuantity, decrementQuantity, updateQuantity } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import Stepper from '../ui/Stepper';

/**
 * CartItem - Dòng sản phẩm trong giỏ hàng
 * Hỗ trợ Stepper cập nhật số lượng và button xóa
 */
export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-surface border border-border rounded-xl"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* SVG Illustration placeholder */}
        <div className="w-16 h-16 bg-bg rounded-lg flex items-center justify-center border border-border shrink-0">
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary text-sm line-clamp-1">
            {item.name}
          </h4>
          <p className="text-xs text-text-secondary font-mono mt-0.5">
            {item.activeIngredient}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-text-secondary font-mono">
              Đơn giá: {formatCurrency(item.price)}
            </span>
            {item.requiresPrescription && (
              <span className="px-1.5 py-0.5 bg-warning/10 text-warning text-[10px] rounded font-medium">
                Cần kê đơn
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50">
        {/* Quantity Stepper */}
        <Stepper
          value={item.quantity}
          onIncrement={() => dispatch(incrementQuantity(item.id))}
          onDecrement={() => dispatch(decrementQuantity(item.id))}
          onChange={(val) => dispatch(updateQuantity({ id: item.id, quantity: val }))}
        />

        {/* Subtotal & Delete */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-text-primary font-mono min-w-[80px] text-right">
            {formatCurrency(item.price * item.quantity)}
          </span>
          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
            aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
