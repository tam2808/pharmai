import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, CheckCircle, ShieldCheck, Lock, Info } from 'lucide-react';
import { selectCartItems, selectCartTotalPrice } from '../../store/cartSlice';
import { createOrder, getVnpayUrl } from '../../services/orderApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import OrderSummary from '../../components/features/OrderSummary';
import PageTransition from '../../components/layout/PageTransition';

// ── Validation schema ────────────────────────────────────────
const checkoutSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phone: z
    .string()
    .min(10, 'Số điện thoại tối thiểu 10 chữ số')
    .regex(/^\d+$/, 'Số điện thoại chỉ bao gồm số'),
  address: z.string().min(1, 'Địa chỉ giao hàng không được để trống'),
  notes: z.string().optional(),
});

// ── Phương thức thanh toán ───────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'COD',
    label: 'Thanh toán khi nhận hàng',
    desc: 'Trả tiền mặt khi nhận được hàng',
    icon: Truck,
    color: 'text-amber-600',
    activeBg: 'bg-amber-50',
    activeBorder: 'border-amber-400',
  },
  {
    id: 'VNPAY',
    label: 'Thanh toán qua VNPay',
    desc: 'ATM · Visa · MasterCard · QR Code',
    icon: CreditCard,
    color: 'text-blue-600',
    activeBg: 'bg-blue-50',
    activeBorder: 'border-blue-500',
    badge: 'Bảo mật',
  },
];

// ── VNPay loading overlay ────────────────────────────────────
function VnpayOverlay({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="vnpay-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        >
          {/* VNPay logo area */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Spinner */}
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-blue-500/30"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={28} className="text-blue-400" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-white font-bold text-lg tracking-wide">
                Đang kết nối VNPay
              </p>
              <p className="text-white/60 text-sm mt-1">
                Vui lòng không đóng hoặc tải lại trang
              </p>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-white/10 rounded-xl px-5 py-3"
          >
            <ShieldCheck size={16} className="text-green-400" />
            <span className="text-white/80 text-xs">Kết nối được mã hoá SSL · An toàn tuyệt đối</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ────────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate   = useNavigate();
  const cartItems  = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  const [submitting,     setSubmitting]     = useState(false);
  const [paymentMethod,  setPaymentMethod]  = useState('COD');
  const [showVnpayLoad,  setShowVnpayLoad]  = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  });

  const onSubmitOrder = async (formData) => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống, không thể thanh toán');
      return;
    }

    setSubmitting(true);
    try {
      // Bước 1 — Tạo đơn hàng trong DB
      const orderRes = await createOrder({
        items: cartItems,
        total: totalPrice,
        shippingInfo: formData,
        paymentMethod,
      });

      const orderId = orderRes?.data?.orderId;
      if (!orderId) throw new Error('Backend không trả về mã đơn hàng');

      if (paymentMethod === 'COD') {
        // COD: redirect về trang thành công luôn
        toast.success('Đặt hàng thành công!');
        navigate(`/order-success?orderId=${orderId}&status=cod`);
        return;
      }

      // VNPAY: lấy URL thanh toán và redirect
      setShowVnpayLoad(true);
      const vnpayRes = await getVnpayUrl(orderId, totalPrice);
      const paymentUrl = vnpayRes?.data?.paymentUrl;

      if (!paymentUrl) throw new Error('Không lấy được URL thanh toán VNPay');

      // Delay nhỏ để người dùng thấy overlay
      await new Promise((r) => setTimeout(r, 600));
      window.location.href = paymentUrl;

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra trong quá trình tạo đơn hàng';
      toast.error(msg);
      setSubmitting(false);
      setShowVnpayLoad(false);
    }
  };

  return (
    <>
      <PageTransition className="py-24 bg-bg min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          <h1 className="text-h3 lg:text-h2 font-semibold text-text-primary mb-14 text-center lg:text-left">
            Thông tin thanh toán
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* ── Cột trái — Form ── */}
            <div
              className="lg:col-span-7 bg-surface border border-border rounded-xl p-8 lg:p-10 shadow-card max-w-[600px] mx-auto lg:mx-0 w-full"
              style={{ marginTop: '80px' }}
            >
              <h2 className="text-xl font-semibold text-text-primary mb-8">
                Địa chỉ nhận hàng
              </h2>

              <form onSubmit={handleSubmit(onSubmitOrder)} className="space-y-10">
                <Input
                  label="Họ và tên người nhận"
                  type="text"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />

                <Input
                  label="Số điện thoại liên hệ"
                  type="tel"
                  error={errors.phone?.message}
                  {...register('phone')}
                />

                <Input
                  label="Địa chỉ giao thuốc chi tiết"
                  type="text"
                  error={errors.address?.message}
                  {...register('address')}
                />

                <div className="relative">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Ghi chú thêm
                  </label>
                  <textarea
                    id="notes"
                    rows="4"
                    placeholder="Ghi chú thêm cho người giao hàng..."
                    className="w-full bg-transparent px-4 py-3 text-text-primary text-body border border-border rounded-md outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(11,61,46,0.1)] transition-all resize-none"
                    {...register('notes')}
                  />
                </div>

                {/* ── Chọn phương thức thanh toán ── */}
                <div>
                  <p className="text-sm font-semibold text-text-primary mb-4">
                    Phương thức thanh toán
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon     = method.icon;
                      const selected = paymentMethod === method.id;
                      return (
                        <motion.button
                          key={method.id}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                            selected
                              ? `${method.activeBorder} ${method.activeBg}`
                              : 'border-border bg-transparent hover:border-primary/40'
                          }`}
                        >
                          <div className={`mt-0.5 p-2 rounded-lg ${selected ? method.activeBg : 'bg-bg'}`}>
                            <Icon size={20} className={selected ? method.color : 'text-text-secondary'} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm font-semibold ${selected ? 'text-text-primary' : 'text-text-secondary'}`}>
                                {method.label}
                              </p>
                              {method.badge && selected && (
                                <span className="text-[10px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                  {method.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary mt-0.5">{method.desc}</p>
                          </div>
                          {selected && (
                            <CheckCircle
                              size={18}
                              className={`${method.color} absolute top-3 right-3 flex-shrink-0`}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* VNPay info note */}
                  <AnimatePresence>
                    {paymentMethod === 'VNPAY' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-blue-700 leading-relaxed">
                            Bạn sẽ được chuyển đến cổng thanh toán VNPay an toàn.
                            Hỗ trợ thẻ ATM nội địa, Visa, MasterCard và QR Code.
                            <br />
                            <span className="font-semibold">Thẻ test sandbox:</span>{' '}
                            <code className="bg-blue-100 px-1 rounded">9704198526191432198</code>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Submit button ── */}
                <div className="pt-2">
                  <Button
                    id="btn-submit-checkout"
                    type="submit"
                    variant={paymentMethod === 'VNPAY' ? 'primary' : 'accent'}
                    size="lg"
                    fullWidth
                    loading={submitting}
                    icon={
                      paymentMethod === 'VNPAY'
                        ? <CreditCard size={20} />
                        : <Truck size={20} />
                    }
                  >
                    {submitting
                      ? (paymentMethod === 'VNPAY' ? 'Đang kết nối VNPay...' : 'Đang đặt hàng...')
                      : (paymentMethod === 'VNPAY' ? 'Thanh toán qua VNPay' : 'Đặt hàng (COD)')}
                  </Button>

                  {/* Security badge */}
                  {paymentMethod === 'VNPAY' && (
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <ShieldCheck size={13} className="text-green-600" />
                      <span className="text-xs text-text-secondary">
                        Kết nối mã hoá SSL 256-bit · Bảo mật bởi VNPay
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* ── Cột phải — Tóm tắt đơn hàng ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <OrderSummary showCheckoutBtn={false} />
            </div>

          </div>
        </div>
      </PageTransition>

      {/* VNPay full-screen loading overlay */}
      <VnpayOverlay visible={showVnpayLoad} />
    </>
  );
}
