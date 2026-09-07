import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, CheckCircle, ShieldCheck, Lock, Info, Copy, Check, QrCode } from 'lucide-react';
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
    id: 'VNPAYQR',
    label: 'Quét mã VNPAY-QR',
    desc: 'Hiển thị mã QR thanh toán tức thì trên màn hình',
    icon: QrCode,
    color: 'text-blue-600',
    activeBg: 'bg-blue-50',
    activeBorder: 'border-blue-500',
    badge: 'Mở QR ngay',
  },
  {
    id: 'VNPAY',
    label: 'VNPay (ATM / Visa)',
    desc: 'Thẻ ATM nội địa (NCB...), Visa / MasterCard',
    icon: CreditCard,
    color: 'text-purple-600',
    activeBg: 'bg-purple-50',
    activeBorder: 'border-purple-500',
  },
  {
    id: 'COD',
    label: 'Thanh toán khi nhận hàng',
    desc: 'Trả tiền mặt khi nhận được hàng',
    icon: Truck,
    color: 'text-amber-600',
    activeBg: 'bg-amber-50',
    activeBorder: 'border-amber-400',
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
  const [paymentMethod,  setPaymentMethod]  = useState('VNPAYQR');
  const [showVnpayLoad,  setShowVnpayLoad]  = useState(false);
  const [copiedCard,     setCopiedCard]     = useState(false);

  const handleCopyCard = () => {
    navigator.clipboard.writeText('9704198526191432198');
    setCopiedCard(true);
    toast.success('Đã sao chép số thẻ test VNPay!');
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      notes: '',
    },
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
        shippingInfo: { ...formData, email: user?.email },
        userEmail: user?.email,
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

      // VNPAY: Chuyển hướng sang màn hình mã QR thanh toán tương ứng số tiền đơn hàng
      toast.success('Đã tạo đơn hàng thành công! Vui lòng quét mã QR thanh toán.');
      navigate(`/order-success?orderId=${orderId}&status=vnpay_qr&amount=${totalPrice}`);
      return;

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
      <PageTransition className="bg-bg min-h-screen" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ── Cột trái — Form ── */}
            <div className="lg:col-span-7 space-y-5">

              {/* Section: Thông tin người đặt */}
              <div className="bg-surface border border-border rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard size={16} className="text-primary" />
                  </div>
                  <h2 className="text-sm font-bold text-text-primary">Thông tin người đặt</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Họ và tên người đặt"
                    type="text"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />
                  <Input
                    label="Số điện thoại"
                    type="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>
              </div>

              {/* Section: Thông tin nhận hàng */}
              <form onSubmit={handleSubmit(onSubmitOrder)}>
                <div className="bg-surface border border-border rounded-xl p-6 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck size={16} className="text-primary" />
                    </div>
                    <h2 className="text-sm font-bold text-text-primary">Thông tin nhận hàng</h2>
                  </div>

                  <div className="space-y-3">
                    <Input
                      label="Địa chỉ giao hàng"
                      type="text"
                      error={errors.address?.message}
                      {...register('address')}
                    />

                    <textarea
                      id="notes"
                      rows="2"
                      placeholder="Ghi chú (không bắt buộc)"
                      className="w-full bg-surface px-4 py-3 text-text-primary text-sm border border-border rounded-lg outline-none hover:border-text-muted focus:border-primary focus:shadow-[0_0_0_3px_rgba(14,165,233,0.08)] transition-all resize-none placeholder:text-text-muted"
                      {...register('notes')}
                    />
                  </div>
                </div>

                {/* Section: Phương thức thanh toán */}
                <div className="bg-surface border border-border rounded-xl p-6 shadow-xs mt-5">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck size={16} className="text-primary" />
                    </div>
                    <h2 className="text-sm font-bold text-text-primary">Phương thức thanh toán</h2>
                  </div>

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
                          className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                            selected
                              ? `${method.activeBorder} ${method.activeBg}`
                              : 'border-border bg-transparent hover:border-primary/40'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${selected ? method.activeBg : 'bg-bg'}`}>
                            <Icon size={18} className={selected ? method.color : 'text-text-secondary'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${selected ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {method.label}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">{method.desc}</p>
                          </div>
                          {selected && (
                            <CheckCircle
                              size={16}
                              className={`${method.color} shrink-0`}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* VNPay Sandbox Info Note */}
                  <AnimatePresence>
                    {(paymentMethod === 'VNPAYQR' || paymentMethod === 'VNPAY') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                              <Info size={15} className="text-blue-600 shrink-0" />
                              <span>
                                {paymentMethod === 'VNPAYQR'
                                  ? 'Chế độ Quét Mã QR Trực Tiếp (VNPAY-QR)'
                                  : 'Thông tin Thẻ Test VNPay Sandbox (NCB)'}
                              </span>
                            </div>
                            <span className="text-[10px] uppercase font-semibold tracking-wider bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-full">
                              Môi trường thử nghiệm
                            </span>
                          </div>

                          {paymentMethod === 'VNPAYQR' ? (
                            <div className="text-xs text-blue-900 bg-white/70 p-2.5 rounded-lg border border-blue-100 leading-relaxed">
                              <p className="font-semibold text-blue-800 mb-1">
                                🚀 Mở thẳng trang quét mã QR (Không qua chọn thủ công):
                              </p>
                              <p>
                                Khi nhấn thanh toán, hệ thống sẽ <strong>chuyển trực tiếp sang màn hình Mã QR</strong> của VNPay. Trong môi trường Sandbox, bạn có thể quét mã bằng App ngân hàng hoặc dùng thẻ test NCB để xác nhận giao dịch thành công ngay lập tức.
                              </p>
                            </div>
                          ) : (
                            <div className="text-xs text-blue-900 bg-white/70 p-2.5 rounded-lg border border-blue-100 space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span>Ngân hàng: <strong>NCB (Ngân hàng Quốc Dân)</strong></span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span>Số thẻ: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900 font-mono font-bold">9704 1985 2619 1432 198</code></span>
                                <button
                                  type="button"
                                  onClick={handleCopyCard}
                                  className="flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
                                >
                                  {copiedCard ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                                  <span>{copiedCard ? 'Đã chép' : 'Sao chép'}</span>
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-blue-800">
                                <span>Tên chủ thẻ: <strong>NGUYEN VAN A</strong></span>
                                <span>Ngày phát hành: <strong>07/15</strong></span>
                                <span>OTP: <strong>123456</strong></span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit — nằm ngoài card, full width */}
                <div className="mt-5">
                  <Button
                    id="btn-submit-checkout"
                    type="submit"
                    variant={paymentMethod === 'COD' ? 'accent' : 'primary'}
                    size="lg"
                    fullWidth
                    loading={submitting}
                    icon={
                      paymentMethod === 'VNPAYQR'
                        ? <QrCode size={18} />
                        : paymentMethod === 'VNPAY'
                        ? <CreditCard size={18} />
                        : <Truck size={18} />
                    }
                  >
                    {submitting
                      ? (paymentMethod === 'COD' ? 'Đang đặt hàng...' : 'Đang kết nối VNPay...')
                      : (paymentMethod === 'VNPAYQR'
                          ? 'Mở Mã QR Thanh Toán VNPAY'
                          : paymentMethod === 'VNPAY'
                          ? 'Thanh toán qua VNPay (ATM/Visa)'
                          : 'Hoàn tất đặt hàng')}
                  </Button>

                  {(paymentMethod === 'VNPAYQR' || paymentMethod === 'VNPAY') && (
                    <div className="flex items-center justify-center gap-1.5 mt-2.5">
                      <ShieldCheck size={12} className="text-green-600" />
                      <span className="text-[11px] text-text-muted">
                        Mã hoá SSL 256-bit · Kết nối cổng VNPay Sandbox
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

