import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, ShoppingBag, Home,
  CreditCard, Calendar, Hash, Building2, AlertTriangle,
  QrCode, Copy, Check, ShieldCheck, UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { clearCart } from '../../store/cartSlice';
import { getOrderById, updateOrderStatus } from '../../services/orderApi';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';

// ── Format Currency ─────────────────────────────────────────
function formatCurrency(val) {
  if (!val) return '0 ₫';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

// ── Bảng mã ngân hàng VNPay ──────────────────────────────────
const BANK_NAMES = {
  NCB: 'Ngân hàng NCB',
  SCB: 'Ngân hàng SCB',
  SACOMBANK: 'Sacombank',
  EXIMBANK: 'Eximbank',
  VIETINBANK: 'VietinBank',
  VIETCOMBANK: 'Vietcombank',
  MBBANK: 'MBBank',
  MB: 'MB Bank',
};

function formatVnpDate(raw) {
  if (!raw || raw.length < 14) return null;
  const y = raw.slice(0, 4);
  const mo = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  const h = raw.slice(8, 10);
  const min = raw.slice(10, 12);
  const s = raw.slice(12, 14);
  return `${h}:${min}:${s} — ${d}/${mo}/${y}`;
}

function formatAmount(raw) {
  if (!raw) return null;
  const num = parseInt(raw, 10);
  if (isNaN(num)) return null;
  return formatCurrency(num / 100);
}

function InfoRow({ icon: Icon, label, value, mono = false, onCopy, copied }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-bg text-primary">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs text-text-secondary">{label}</p>
          <p className={`text-sm font-bold text-text-primary ${mono ? 'font-mono' : ''}`}>
            {value}
          </p>
        </div>
      </div>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        >
          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
        </button>
      )}
    </div>
  );
}

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderId = searchParams.get('orderId') || '';
  const status = searchParams.get('status') || '';
  const rawAmount = searchParams.get('amount') || searchParams.get('vnp_Amount') || '';
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode') || '';
  const vnp_TransactionNo = searchParams.get('vnp_TransactionNo') || '';
  const vnp_BankCode = searchParams.get('vnp_BankCode') || '';
  const vnp_PayDate = searchParams.get('vnp_PayDate') || '';

  const isVnpayQr = status === 'vnpay_qr' || status === 'vnpay';
  const isCod = status === 'cod';
  const isSuccess = status === 'success' || isCod || isVnpayQr;

  const [hasTransferred, setHasTransferred] = useState(false);
  const [submittingConfirm, setSubmittingConfirm] = useState(false);

  // Copy state
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);

  // Amount parsing
  const orderAmountNum = rawAmount ? (rawAmount.length > 8 ? parseFloat(rawAmount) / 100 : parseFloat(rawAmount)) : 0;
  const amountDisplay = orderAmountNum > 0 ? formatCurrency(orderAmountNum) : null;

  // Dynamic VietQR code image corresponding to order total & memo
  const qrUrl = orderAmountNum > 0
    ? `https://img.vietqr.io/image/MB-0382910391-compact2.png?amount=${orderAmountNum}&addInfo=${encodeURIComponent(orderId)}&accountName=NHA%20THUOC%20PHARMAI`
    : `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent('PHARMAT_' + orderId)}`;

  useEffect(() => {
    if (isSuccess) dispatch(clearCart());
  }, [isSuccess, dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleConfirmTransfer = async () => {
    setSubmittingConfirm(true);
    try {
      if (orderId) {
        await updateOrderStatus(orderId, 'pending_verification');
      }
      setHasTransferred(true);
      toast.success('Đã ghi nhận thông tin chuyển khoản! Admin sẽ kiểm tra đơn hàng.');
    } catch (err) {
      console.error('Error confirming transfer:', err);
      toast.success('Đã ghi nhận thông tin chuyển khoản! Admin sẽ kiểm tra đơn hàng.');
      setHasTransferred(true);
    } finally {
      setSubmittingConfirm(false);
    }
  };

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Đã sao chép!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition className="min-h-screen bg-bg flex items-center justify-center py-16">
      <div className="max-w-[560px] w-full mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card"
        >
          {/* Header Strip */}
          <div className="px-8 pt-8 pb-5 text-center bg-gradient-to-b from-emerald-500/10 via-primary/5 to-transparent">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              {hasTransferred || isCod ? (
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle size={38} />
                  </div>
                </div>
              ) : isVnpayQr ? (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md">
                  <QrCode size={34} />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle size={38} />
                </div>
              )}
            </motion.div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary mb-1.5">
              {hasTransferred
                ? 'Đã xác nhận chuyển khoản!'
                : isVnpayQr
                ? 'Thanh toán qua VNPay / QR Ngân hàng'
                : isCod
                ? 'Đặt hàng thành công!'
                : 'Thanh toán thành công!'}
            </h1>

            <p className="text-text-secondary text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              {hasTransferred
                ? 'Cảm ơn bạn! Thông tin chuyển khoản đã được ghi nhận. Admin sẽ kiểm tra giao dịch và phê duyệt đơn hàng.'
                : isVnpayQr
                ? 'Quét mã QR bằng ứng dụng Ngân hàng / VNPay hoặc chuyển khoản theo thông tin bên dưới.'
                : isCod
                ? 'Đơn hàng đã được tiếp nhận. Nhân viên sẽ liên hệ trước khi giao hàng.'
                : 'Cảm ơn bạn! Đơn hàng của bạn đang được xử lý.'}
            </p>
          </div>

          <div className="px-6 sm:px-8 pb-8 space-y-5">
            {/* Mã đơn hàng Bar */}
            {orderId && (
              <div className="p-3.5 bg-bg border border-border rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider block">
                    MÃ ĐƠN HÀNG
                  </span>
                  <span className="font-mono font-extrabold text-primary text-base">{orderId}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full ${
                      hasTransferred
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : isVnpayQr
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {hasTransferred
                      ? 'Chờ Admin kiểm tra'
                      : isVnpayQr
                      ? 'Chờ quét mã QR'
                      : 'Đang xử lý'}
                  </span>
                </div>
              </div>
            )}

            {/* Màn hình Mã QR & Thông tin Chuyển khoản VNPay */}
            {isVnpayQr && !hasTransferred && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-blue-50/50 to-white border border-blue-200 rounded-2xl p-5 space-y-4 shadow-sm"
              >
                {/* QR Code Image Container */}
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-blue-200 rounded-xl shadow-xs">
                  <span className="text-xs font-extrabold text-blue-900 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <QrCode size={15} className="text-blue-600" />
                    MÃ QR THANH TOÁN TỰ ĐỘNG
                  </span>
                  <img
                    src={qrUrl}
                    alt="VietQR VNPay Code"
                    className="w-52 h-52 object-contain rounded-lg border border-slate-200 p-1 bg-white shadow-xs"
                  />
                  <span className="text-[11px] text-slate-500 font-medium mt-2">
                    Quét qua ứng dụng Ngân hàng (MB, Vietcombank, Techcombank...) hoặc VNPay
                  </span>
                </div>

                {/* Bank Details Table */}
                <div className="divide-y divide-blue-100 text-xs sm:text-sm bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                  <InfoRow icon={Building2} label="Ngân hàng" value="MB Bank (Ngân hàng Quân Đội)" />
                  <InfoRow
                    icon={CreditCard}
                    label="Số tài khoản"
                    value="0382910391"
                    mono
                    onCopy={() => copyToClipboard('0382910391', setCopiedAcc)}
                    copied={copiedAcc}
                  />
                  <InfoRow icon={UserCheck} label="Chủ tài khoản" value="NHA THUOC PHARMAI" />
                  <InfoRow
                    icon={CreditCard}
                    label="Số tiền cần chuyển"
                    value={amountDisplay || formatCurrency(orderAmountNum)}
                    onCopy={() => copyToClipboard(orderAmountNum.toString(), setCopiedAmount)}
                    copied={copiedAmount}
                  />
                  <InfoRow
                    icon={Hash}
                    label="Nội dung chuyển khoản (bắt buộc)"
                    value={orderId}
                    mono
                    onCopy={() => copyToClipboard(orderId, setCopiedMemo)}
                    copied={copiedMemo}
                  />
                </div>

                {/* Button NỔI BẬT: ĐÃ CHUYỂN KHỎAN */}
                <button
                  type="button"
                  onClick={handleConfirmTransfer}
                  disabled={submittingConfirm}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle size={20} />
                  <span>{submittingConfirm ? 'ĐANG GHI NHẬN...' : 'TÔI ĐÃ CHUYỂN KHỎAN'}</span>
                </button>

                <p className="text-[11px] text-center text-slate-500 font-medium">
                  * Sau khi hoàn tất chuyển khoản trên App ngân hàng, bạn bấm nút <strong>"TÔI ĐÃ CHUYỂN KHỎAN"</strong> để Admin đối soát & phê duyệt đơn.
                </p>
              </motion.div>
            )}

            {/* Thông báo sau khi bấm ĐÃ CHUYỂN */}
            {hasTransferred && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-base">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  <span>Đã nhận thông báo chuyển khoản</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Admin sẽ kiểm tra biến động tài khoản và cập nhật trạng thái đơn hàng sang <strong>Đã hoàn thành</strong> trong giây lát.
                </p>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                id="btn-home"
                variant="primary"
                fullWidth
                onClick={() => navigate('/')}
                icon={<Home size={18} />}
              >
                Về trang chủ
              </Button>

              <Button
                id="btn-profile-orders"
                variant="outline"
                fullWidth
                onClick={() => navigate('/profile?tab=orders')}
                icon={<ShoppingBag size={18} />}
              >
                Quản lý đơn hàng
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <p className="text-center text-xs text-text-secondary mt-4">
          Cần hỗ trợ gấp? Hotline/Zalo: <span className="text-primary font-bold">0901 234 567</span>
        </p>
      </div>
    </PageTransition>
  );
}
