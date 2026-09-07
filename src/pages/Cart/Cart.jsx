import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { selectCartItems } from '../../store/cartSlice';
import CartItem from '../../components/features/CartItem';
import OrderSummary from '../../components/features/OrderSummary';
import EmptyState from '../../components/features/EmptyState';
import PageTransition from '../../components/layout/PageTransition';

export default function Cart() {
  const items = useSelector(selectCartItems);

  return (
    <PageTransition className="py-8 bg-bg min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <h1 className="text-h3 lg:text-h2 font-semibold text-text-primary mb-8">
          Giỏ hàng của bạn
        </h1>

        {items.length === 0 ? (
          <EmptyState
            title="Giỏ hàng trống"
            description="Hiện chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy quay lại trang sản phẩm để chọn mua loại thuốc phù hợp."
            onRetry={() => { }}
            retryText=""
          >
            <div className="pt-4">
              <Link to="/search">
                <button className="bg-primary text-white hover:bg-primary-hover px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  Tìm thuốc ngay
                </button>
              </Link>
            </div>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Cart Items list - layout animations enabled */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary sidebar */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <OrderSummary />
            </div>

          </div>
        )}
      </div>
    </PageTransition>
  );
}
