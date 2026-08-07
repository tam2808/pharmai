import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { login as loginService } from '../../services/authApi';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const response = await loginService(data);
      dispatch(loginSuccess(response.data));
      toast.success('Đăng nhập thành công!');
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;
      const serverEmail = err.response?.data?.email;

      if (status === 403 && serverEmail) {
        // Account not activated yet → redirect to OTP screen
        dispatch({ type: 'auth/loginFailure', payload: null });
        toast.warning('Tài khoản chưa xác thực. Vui lòng nhập mã OTP.');
        navigate('/verify-email', { state: { email: serverEmail } });
      } else {
        const errMsg = serverMsg || err.message || 'Đăng nhập thất bại';
        dispatch(loginFailure(errMsg));
        toast.error(errMsg);
      }
    }
  };

  return (
    <PageTransition>
      <AuthLayout
        title="Chào mừng quay trở lại"
        subtitle="Đăng nhập để quản lý đơn hàng và nhận tư vấn AI"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg flex items-start gap-2.5 text-sm animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Địa chỉ email"
            type="email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Mật khẩu"
            type="password"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-end text-sm">
            <Link
              to="#"
              className="text-primary font-medium hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Đăng nhập
          </Button>

          <div className="text-center text-sm text-text-secondary mt-6">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </AuthLayout>
    </PageTransition>
  );
}
