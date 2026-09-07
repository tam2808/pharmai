import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import { User, Mail, Phone, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { register as registerService } from '../../services/authApi';
import AuthLayout from './AuthLayout';
import PageTransition from '../../components/layout/PageTransition';

// Validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Họ tên không được để trống'),
  email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  phone: z.string().min(10, 'Số điện thoại tối thiểu 10 số').regex(/^\d+$/, 'Số điện thoại chỉ bao gồm số'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setApiError(null);
    dispatch(loginStart());
    try {
      localStorage.setItem('pharmai-register-data', JSON.stringify(data));
      const response = await registerService(data);

      if (response.data?.token) {
        dispatch(loginSuccess(response.data));
        toast.success('Đăng ký thành công!');
        navigate('/');
      } else if (response.requiresVerification) {
        dispatch({ type: 'auth/loginFailure', payload: null });
        toast.info('Mã xác thực đã được gửi đến email của bạn');
        navigate('/verify-email', { 
          state: { 
            email: response.email,
            devOtp: response.otp
          } 
        });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Đăng ký thất bại. Vui lòng thử lại';
      setApiError(errMsg);
      dispatch(loginFailure(errMsg));
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <AuthLayout activeTab="register">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          
          {apiError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-xl flex items-start gap-2.5 text-xs animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} className="text-amber-400" />
              FULL NAME
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.name ? 'border-rose-400' : 'border-white/20'
              } rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white/15 transition-all`}
              {...register('name')}
            />
            {errors.name && <span className="text-[10px] text-rose-300 font-medium">{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={13} className="text-amber-400" />
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.email ? 'border-rose-400' : 'border-white/20'
              } rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white/15 transition-all`}
              {...register('email')}
            />
            {errors.email && <span className="text-[10px] text-rose-300 font-medium">{errors.email.message}</span>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Phone size={13} className="text-amber-400" />
              PHONE NUMBER
            </label>
            <input
              type="tel"
              placeholder="0901234567"
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.phone ? 'border-rose-400' : 'border-white/20'
              } rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white/15 transition-all`}
              {...register('phone')}
            />
            {errors.phone && <span className="text-[10px] text-rose-300 font-medium">{errors.phone.message}</span>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={13} className="text-amber-400" />
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-10 bg-white/10 border ${
                  errors.password ? 'border-rose-400' : 'border-white/20'
                } rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white/15 transition-all`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="text-[10px] text-rose-300 font-medium">{errors.password.message}</span>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={13} className="text-amber-400" />
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.confirmPassword ? 'border-rose-400' : 'border-white/20'
              } rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white/15 transition-all`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="text-[10px] text-rose-300 font-medium">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'SIGN UP'}
            </button>
          </div>

        </form>
      </AuthLayout>
    </PageTransition>
  );
}
