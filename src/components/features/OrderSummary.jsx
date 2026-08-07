import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartTotalPrice, selectCartTotalItems } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import Button from '../ui/Button';

/**
 * OrderSummary - Tóm tắt đơn hàng đặt ở Cart / Checkout
 */
export default function OrderSummary({ showCheckoutBtn = true, onSubmit }) {
  const navigate = useNavigate();
  const totalPrice = useSelector(selectCartTotalPrice);
  const totalItems = useSelector(selectCartTotalItems);

  // Phí giao hàng (Free ship cho đơn hàng trên 200k)
  const shippingCost = totalPrice > 200000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingCost;

  const handleCheckoutClick = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-card">
      <h3 className="font-semibold text-text-primary text-base pb-3 border-b border-border">
        Tóm tắt đơn hàng
      </h3>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Tổng số lượng</span>
          <span className="font-semibold text-text-primary font-mono">{totalItems} sản phẩm</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Tạm tính</span>
          <span className="font-semibold text-text-primary font-mono">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Phí giao hàng</span>
          <span className="font-semibold text-text-primary font-mono">
            {shippingCost === 0 ? 'Miễn phí' : formatCurrency(shippingCost)}
          </span>
        </div>
        {shippingCost > 0 && (
          <p className="text-[10px] text-accent/80 text-right">
            * Miễn phí giao hàng cho đơn trên 200.000đ
          </p>
        )}
      </div>

      <div className="border-t border-border/50 pt-4 flex justify-between items-end">
        <span className="font-semibold text-text-primary text-sm">Tổng cộng</span>
        <span className="text-xl font-bold text-primary font-mono">
          {formatCurrency(finalTotal)}
        </span>
      </div>

      {showCheckoutBtn && (
        <div className="pt-2">
          <Button
            variant="accent"
            size="lg"
            fullWidth
            onClick={handleCheckoutClick}
            disabled={totalItems === 0}
          >
            Tiến hành thanh toán
          </Button>
        </div>
      )}
    </div>
  );
}
