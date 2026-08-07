import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { MailCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { loginSuccess } from '../../store/authSlice';
import { verifyOtp, register } from '../../services/authApi';
import PageTransition from '../../components/layout/PageTransition';
import Button from '../../components/ui/Button';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const inputsRef = useRef([]);


  if (!email) {
    navigate('/register');
    return null;
  }

  const handleInput = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError(null);
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputsRef.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await verifyOtp({ email, otp: code });
      if (response.data?.token) {
        dispatch(loginSuccess(response.data));
        toast.success('🎉 Xác thực thành công! Chào mừng đến với PharmAI!');
        navigate('/');
      } else {
        setError(response.message || 'Xác thực thành công, vui lòng đăng nhập');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ. Vui lòng thử lại.');
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const saved = localStorage.getItem('pharmai-register-data');
      if (saved) {
        const userData = JSON.parse(saved);
        await register(userData);
      }
      toast.success('Mã OTP mới đã được gửi đến email của bạn!');
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err) {
      toast.error('Gửi lại mã thất bại, vui lòng thử lại sau');
    } finally {
      setResending(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[480px] bg-surface border border-border rounded-2xl p-8 shadow-modal"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-lg"
            >
              <MailCheck size={36} className="text-white" />
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary font-display mb-2">
              Xác thực email
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Mã OTP 6 chữ số đã được gửi tới địa chỉ
            </p>
            <p className="text-sm font-semibold text-primary mt-1 truncate">{email}</p>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className={[
                  'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none',
                  'bg-bg text-text-primary',
                  digit
                    ? 'border-primary bg-primary-light shadow-sm'
                    : 'border-border focus:border-primary focus:bg-primary-light/40',
                  error ? 'border-error' : '',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-error mb-4"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <Button
            variant="primary"
            fullWidth
            size="lg"
            loading={submitting}
            onClick={handleVerify}
          >
            Xác nhận mã OTP
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">hoặc</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Resend & Back */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex items-center justify-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
              {resending ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              Quay lại đăng ký
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
