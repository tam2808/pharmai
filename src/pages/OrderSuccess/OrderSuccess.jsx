import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, ShoppingBag, Home,
  CreditCard, Calendar, Hash, Building2, AlertTriangle,
} from 'lucide-react';
import { clearCart } from '../../store/cartSlice';
import { getOrderById } from '../../services/orderApi';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';

// ── Bảng mã ngân hàng VNPay → tên hiển thị ──────────────────
const BANK_NAMES = {
  NCB:   'Ngân hàng NCB',
  SCB:   'Ngân hàng SCB',
  SACOMBANK: 'Sacombank',
  EXIMBANK:  'Eximbank',
  MSBANK:    'Maritime Bank',
  NAMABANK:  'Nam A Bank',
  VNMART:    'VnMart',
  VIETINBANK:'VietinBank',
  VIETCOMBANK:'Vietcombank',
  HDBANK:    'HDBank',
  DONGABANK: 'Đông Á Bank',
  TPBANK:    'TPBank',
  OJB:       'OceanBank',
  BIDV:      'BIDV',
  TECHCOMBANK:'Techcombank',
  VPBANK:    'VPBank',
  AGRIBANK:  'Agribank',
  MBBANK:    'MBBank',
  ACB:       'ACB',
  OCB:       'OCB',
  IVB:       'Indovina Bank',
  VISA:      'Visa / MasterCard',
};

// ── Mã lỗi VNPay → mô tả tiếng Việt ────────────────────────
const VNPAY_ERROR_CODES = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  '09': 'Thẻ / Tài khoản chưa đăng ký dịch vụ InternetBanking.',
  '10': 'Xác thực thông tin thẻ / tài khoản không đúng quá 3 lần.',
  '11': 'Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại.',
  '12': 'Thẻ / Tài khoản bị khoá.',
  '13': 'Sai mật khẩu xác thực OTP. Vui lòng thực hiện lại.',
  '24': 'Khách hàng huỷ giao dịch.',
  '51': 'Tài khoản không đủ số dư.',
  '65': 'Vượt quá hạn mức giao dịch trong ngày.',
  '75': 'Ngân hàng thanh toán đang bảo trì.',
  '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định.',
  '99': 'Lỗi không xác định.',
};

// ── Format ngày từ VNPay (yyyyMMddHHmmss) ───────────────────
function formatVnpDate(raw) {
  if (!raw || raw.length < 14) return null;
  const y   = raw.slice(0, 4);
  const mo  = raw.slice(4, 6);
  const d   = raw.slice(6, 8);
  const h   = raw.slice(8, 10);
  const min = raw.slice(10, 12);
  const s   = raw.slice(12, 14);
  return `${h}:${min}:${s} — ${d}/${mo}/${y}`;
}

// ── Format số tiền (VNPay trả về đã nhân 100) ───────────────
function formatAmount(raw) {
  if (!raw) return null;
  const num = parseInt(raw, 10);
  if (isNaN(num)) return null;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND',
  }).format(num / 100);
}

// ── Info row component ───────────────────────────────────────
function InfoRow({ icon: Icon, label, value, mono = false }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="mt-0.5 p-1.5 rounded-md bg-bg">
        <Icon size={14} className="text-text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-secondary mb-0.5">{label}</p>
        <p className={`text-sm font-medium text-text-primary truncate ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const dispatch       = useDispatch();

  // Params từ VNPay / backend redirect
  const orderId          = searchParams.get('orderId')          || '';
  const status           = searchParams.get('status')           || '';       // success | failed | cod
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode') || '';
  const vnp_TransactionNo= searchParams.get('vnp_TransactionNo')|| '';
  const vnp_Amount       = searchParams.get('vnp_Amount')       || '';
  const vnp_BankCode     = searchParams.get('vnp_BankCode')     || '';
  const vnp_PayDate      = searchParams.get('vnp_PayDate')      || '';

  const isSuccess = status === 'success' || status === 'cod';
  const isCod     = status === 'cod';
  const isVnpay   = status === 'success' || status === 'failed';

  // Derived display values
  const amountDisplay   = formatAmount(vnp_Amount);
  const payDateDisplay  = formatVnpDate(vnp_PayDate);
  const bankDisplay     = BANK_NAMES[vnp_BankCode] || vnp_BankCode || null;
  const errorDesc       = !isSuccess && vnp_ResponseCode
    ? VNPAY_ERROR_CODES[vnp_ResponseCode] || `Mã lỗi: ${vnp_ResponseCode}`
    : null;

  // Query DB status để đảm bảo sync (chỉ khi VNPAY success)
  const [dbStatus, setDbStatus] = useState(null);
  useEffect(() => {
    if (orderId && status === 'success') {
      getOrderById(orderId)
        .then(res => setDbStatus(res?.data?.status))
        .catch(() => {});
    }
  }, [orderId, status]);

  // Clear cart khi thành công
  useEffect(() => {
    if (isSuccess) dispatch(clearCart());
  }, [isSuccess, dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <PageTransition className="min-h-screen bg-bg flex items-center justify-center py-20">
      <div className="max-w-[540px] w-full mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card"
        >
          {/* ── Header strip ── */}
          <div className={`px-10 pt-10 pb-6 text-center ${
            isSuccess ? 'bg-gradient-to-b from-green-50/60 to-transparent' : 'bg-gradient-to-b from-red-50/60 to-transparent'
          }`}>
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 14 }}
              className="flex justify-center mb-5"
            >
              {isSuccess ? (
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-green-400"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatDelay: 1.5 }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle size={48} className="text-red-500" />
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-text-primary mb-2"
            >
              {isSuccess
                ? isCod ? 'Đặt hàng thành công!' : 'Thanh toán thành công!'
                : 'Thanh toán thất bại'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary text-sm leading-relaxed"
            >
              {isSuccess
                ? isCod
                  ? 'Đơn hàng đã được tiếp nhận. Nhân viên sẽ liên hệ trước khi giao.'
                  : 'VNPay đã xác nhận thanh toán. Đơn hàng đang được xử lý.'
                : errorDesc || 'Giao dịch không thành công hoặc đã bị huỷ. Vui lòng thử lại.'}
            </motion.p>
          </div>

          {/* ── Thông tin chi tiết ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="px-10 pb-8"
          >
            {/* Mã đơn hàng */}
            {orderId && (
              <div className="mb-5 px-4 py-3 bg-bg border border-border rounded-xl flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-text-secondary">Mã đơn hàng</p>
                  <p className="font-mono font-bold text-primary text-sm mt-0.5">{orderId}</p>
                </div>
                <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isSuccess
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {isSuccess ? (isCod ? 'Chờ giao hàng' : dbStatus === 'completed' ? 'Đã thanh toán' : 'Đang xử lý') : 'Thất bại'}
                </div>
              </div>
            )}

            {/* Thông tin giao dịch VNPay */}
            <AnimatePresence>
              {isVnpay && (amountDisplay || vnp_TransactionNo || bankDisplay || payDateDisplay) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.5 }}
                  className="mb-5 bg-bg border border-border rounded-xl overflow-hidden"
                >
                  <div className="px-4 py-2.5 border-b border-border bg-blue-50/50">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        Thông tin giao dịch VNPay
                      </span>
                    </div>
                  </div>
                  <div className="px-4 divide-y divide-border">
                    <InfoRow icon={CreditCard} label="Số tiền thanh toán" value={amountDisplay} />
                    <InfoRow icon={Hash} label="Mã giao dịch VNPay" value={vnp_TransactionNo} mono />
                    <InfoRow icon={Building2} label="Ngân hàng thanh toán" value={bankDisplay} />
                    <InfoRow icon={Calendar} label="Thời gian thanh toán" value={payDateDisplay} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hướng dẫn COD */}
            {isCod && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  💵 Hướng dẫn thanh toán COD
                </p>
                <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside">
                  <li>Nhân viên giao hàng sẽ gọi điện xác nhận trước khi đến</li>
                  <li>Vui lòng chuẩn bị đúng số tiền để tiện thanh toán</li>
                  <li>Thời gian giao hàng: <strong>1–3 ngày làm việc</strong></li>
                  <li>Liên hệ hỗ trợ nếu cần thay đổi hoặc huỷ đơn</li>
                </ul>
              </motion.div>
            )}

            {/* Cảnh báo khi thất bại */}
            {!isSuccess && errorDesc && vnp_ResponseCode !== '24' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3"
              >
                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 leading-relaxed">{errorDesc}</p>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                id="btn-home"
                variant="primary"
                fullWidth
                onClick={() => navigate('/')}
                icon={<Home size={18} />}
              >
                Về trang chủ
              </Button>

              {!isSuccess && (
                <Button
                  id="btn-retry"
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/checkout')}
                  icon={<ShoppingBag size={18} />}
                >
                  Thử lại
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-text-secondary mt-5"
        >
          Cần hỗ trợ? Liên hệ <span className="text-primary font-medium">support@pharmai.vn</span>
        </motion.p>
      </div>
    </PageTransition>
  );
}
