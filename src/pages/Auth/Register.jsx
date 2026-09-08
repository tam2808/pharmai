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
        {/* Header Title */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl sm:text-2xl font-medium text-slate-800 tracking-tight">
            Đăng ký
          </h1>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-sm flex items-start gap-2 text-xs animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} className="text-[#ee4d2d]" />
              HỌ VÀ TÊN
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.name ? 'border-rose-500' : 'border-slate-300'
              } rounded-sm text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-500 transition-colors`}
              {...register('name')}
            />
            {errors.name && <span className="text-[11px] text-rose-500 font-medium block">{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={13} className="text-[#ee4d2d]" />
              ĐỊA CHỈ EMAIL
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.email ? 'border-rose-500' : 'border-slate-300'
              } rounded-sm text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-500 transition-colors`}
              {...register('email')}
            />
            {errors.email && <span className="text-[11px] text-rose-500 font-medium block">{errors.email.message}</span>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Phone size={13} className="text-[#ee4d2d]" />
              SỐ ĐIỆN THOẠI
            </label>
            <input
              type="tel"
              placeholder="0901234567"
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.phone ? 'border-rose-500' : 'border-slate-300'
              } rounded-sm text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-500 transition-colors`}
              {...register('phone')}
            />
            {errors.phone && <span className="text-[11px] text-rose-500 font-medium block">{errors.phone.message}</span>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={13} className="text-[#ee4d2d]" />
              MẬT KHẨU
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className={`w-full px-3.5 py-2.5 pr-10 bg-white border ${
                  errors.password ? 'border-rose-500' : 'border-slate-300'
                } rounded-sm text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-500 transition-colors`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && <span className="text-[11px] text-rose-500 font-medium block">{errors.password.message}</span>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={13} className="text-[#ee4d2d]" />
              XÁC NHẬN MẬT KHẨU
            </label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.confirmPassword ? 'border-rose-500' : 'border-slate-300'
              } rounded-sm text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-500 transition-colors`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="text-[11px] text-rose-500 font-medium block">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-medium text-sm rounded-sm uppercase tracking-wide shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
            </button>
          </div>
        </form>

        {/* Footer Navigation Link */}
        <div className="text-center mt-5 pt-4 border-t border-slate-100 text-sm text-slate-500">
          Bạn đã có tài khoản?{' '}
          <Link to="/login" className="text-[#ee4d2d] font-medium hover:underline">
            Đăng nhập
          </Link>
        </div>
      </AuthLayout>
    </PageTransition>
  );
}

