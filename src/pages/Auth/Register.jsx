import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { register as registerService } from '../../services/authApi';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
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
      // Save register data for resend OTP functionality
      localStorage.setItem('pharmai-register-data', JSON.stringify(data));
      const response = await registerService(data);

      // If account was auto-activated (admin email), log in directly
      if (response.data?.token) {
        dispatch(loginSuccess(response.data));
        toast.success('Đăng ký thành công!');
        navigate('/');
      } else if (response.requiresVerification) {
        // Normal user: redirect to OTP verification page
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
      <AuthLayout
        title="Tạo tài khoản mới"
        subtitle="Tham gia PharmAI để mua thuốc và tư vấn sức khỏe cao cấp"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg flex items-start gap-2.5 text-sm animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <Input
            label="Họ và tên"
            type="text"
            icon={<User size={18} />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Địa chỉ email"
            type="email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Số điện thoại"
            type="tel"
            icon={<Phone size={18} />}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Mật khẩu"
            type="password"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            icon={<Lock size={18} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={submitting}
            >
              Đăng ký tài khoản
            </Button>
          </div>

          <div className="text-center text-sm text-text-secondary mt-6">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </AuthLayout>
    </PageTransition>
  );
}
