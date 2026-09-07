import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, Eye, EyeOff, QrCode, HelpCircle, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { login as loginService, googleLogin as googleLoginService } from '../../services/authApi';
import AuthLayout from './AuthLayout';
import PageTransition from '../../components/layout/PageTransition';

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email / Tên đăng nhập không được để trống'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isQrMode, setIsQrMode] = useState(false);

  // Google Login Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  const from = location.state?.from?.pathname || '/';
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '982146371200-kek0fer63otiihm603kpdliv1e5incrs.apps.googleusercontent.com';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // Check if redirected from Google OAuth Implicit Flow popup/redirect
  useEffect(() => {
    if (location.hash && location.hash.includes('access_token=')) {
      const params = new URLSearchParams(location.hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        dispatch(loginStart());
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((userInfo) => {
            if (userInfo.email) {
              handleGoogleLoginSubmit(userInfo.email, userInfo.name || userInfo.email.split('@')[0]);
              window.history.replaceState(null, '', window.location.pathname);
            }
          })
          .catch((err) => {
            console.error('OAuth redirect fetch error:', err);
            dispatch(loginFailure('Đăng nhập Google thất bại'));
          });
      }
    }
  }, [location.hash]);

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

  const handleGoogleLoginSubmit = async (email, name) => {
    if (!email) return;
    dispatch(loginStart());
    try {
      const response = await googleLoginService({ email, name });
      dispatch(loginSuccess(response.data));
      toast.success(`Chào mừng ${response.data.data?.user?.name || 'bạn'}! Đăng nhập Google thành công.`);
      setShowGoogleModal(false);
      navigate(from, { replace: true });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Đăng nhập Google thất bại';
      dispatch(loginFailure(errMsg));
      toast.error(errMsg);
    }
  };

  const triggerGoogleLogin = () => {
    // 1. Try Google Identity Services (GIS) token client popup
    if (window.google?.accounts?.oauth2 && googleClientId) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();
                if (userInfo.email) {
                  handleGoogleLoginSubmit(userInfo.email, userInfo.name || userInfo.email.split('@')[0]);
                  return;
                }
              } catch (e) {
                console.error('Failed to fetch Google userinfo', e);
              }
            }
            if (tokenResponse.error) {
              setShowGoogleModal(true);
            }
          },
          error_callback: () => {
            setShowGoogleModal(true);
          }
        });
        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('GIS Token client error, fallback to direct popup', err);
      }
    }

    // 2. Direct Google OAuth 2.0 Popup Window
    if (googleClientId) {
      const redirectUri = window.location.origin + '/login';
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=${encodeURIComponent('email profile')}`;

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        googleAuthUrl,
        'GoogleSignIn',
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes`
      );

      if (popup) return;
    }

    // 3. Fallback: Show Modal selector
    setShowGoogleModal(true);
  };

  const handleFacebookLogin = () => {
    toast.info('Tính năng đăng nhập bằng Facebook sắp ra mắt!');
  };

  return (
    <PageTransition>
      <AuthLayout activeTab="login">
        {/* Top Title & QR Badge Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-medium text-slate-800 tracking-tight">
            {isQrMode ? 'Đăng nhập với mã QR' : 'Đăng nhập'}
          </h1>

          {/* QR Code / Password Mode Toggle with Speech Bubble Tooltip */}
          <div className="flex items-center gap-2 relative">
            <div className="relative group">
              <div className="bg-[#fffbf1] text-[#ee4d2d] border border-[#ffbf00] px-3 py-1.5 rounded-xs text-[11px] font-bold shadow-xs whitespace-nowrap flex items-center gap-1">
                {isQrMode ? 'Đăng nhập với mật khẩu' : 'Đăng nhập với mã QR'}
                {/* Speech Bubble Arrow */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-[#ffbf00]"></div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsQrMode(!isQrMode)}
              className="p-1.5 text-[#ee4d2d] hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
              title={isQrMode ? 'Đăng nhập với mật khẩu' : 'Đăng nhập với mã QR'}
            >
              {isQrMode ? (
                <KeyRound size={36} className="stroke-[1.75]" />
              ) : (
                <QrCode size={36} className="stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* QR Mode View */}
        {isQrMode ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
            <div className="p-4 bg-white border-2 border-[#ee4d2d] rounded-lg shadow-md relative group">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://pharmai.vn/login-qr"
                alt="PharmAI Login QR"
                className="w-44 h-44 object-contain"
              />
              <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
                <span className="text-xs font-bold text-slate-800">Quét qua ứng dụng</span>
                <span className="text-[10px] text-slate-500">Mã làm mới sau 60s</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium max-w-[240px]">
              Quét mã QR bằng ứng dụng <span className="font-bold text-[#ee4d2d]">PharmAI</span> trên di động
            </p>
          </div>
        ) : (
          /* Password Form View */
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-sm flex items-start gap-2 text-xs animate-in fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Input 1: Email / Username */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Email/Số điện thoại/Tên đăng nhập"
                  className={`w-full px-3.5 py-3 border ${
                    errors.email ? 'border-rose-500' : 'border-slate-300'
                  } rounded-sm text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-500 transition-colors`}
                  {...register('email')}
                />
                {errors.email && (
                  <span className="text-[11px] text-rose-500 font-medium block">{errors.email.message}</span>
                )}
              </div>

              {/* Input 2: Password + Inner Eye & Forgot Password */}
              <div className="space-y-1">
                <div
                  className={`relative flex items-center border ${
                    errors.password ? 'border-rose-500' : 'border-slate-300'
                  } rounded-sm focus-within:border-slate-500 bg-white transition-colors`}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu"
                    className="w-full px-3.5 py-3 pr-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    {...register('password')}
                  />
                  
                  {/* Eye Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 p-1 shrink-0 transition-colors"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>

                  {/* Vertical Divider */}
                  <div className="w-[1px] h-4 bg-slate-300 mx-1.5 shrink-0"></div>

                  {/* Forgot Password Link inside Input Box */}
                  <Link
                    to="#"
                    className="text-xs text-[#0055aa] hover:underline font-normal shrink-0 pr-3.5 whitespace-nowrap"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                {errors.password && (
                  <span className="text-[11px] text-rose-500 font-medium block">{errors.password.message}</span>
                )}
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-medium text-sm rounded-sm uppercase tracking-wide shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
              </button>

              {/* Remember me Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-normal">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-xs border-slate-300 text-[#ee4d2d] accent-[#ee4d2d] cursor-pointer"
                  />
                  <span>Duy trì đăng nhập</span>
                </label>
                <div className="group relative flex items-center">
                  <HelpCircle size={15} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block bg-slate-800 text-white text-[11px] py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-20">
                    Ghi nhớ phiên đăng nhập trên trình duyệt này
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full border-t border-slate-200"></div>
                <span className="px-4 text-xs uppercase text-slate-400 bg-white shrink-0 font-normal">
                  HOẶC
                </span>
                <div className="w-full border-t border-slate-200"></div>
              </div>

              {/* Social Login Buttons (Grid 2 cols) */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full py-2.5 px-3 border border-slate-300 rounded-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-sm text-slate-700 font-normal shadow-2xs cursor-pointer"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  <span>Facebook</span>
                </button>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={triggerGoogleLogin}
                  className="w-full py-2.5 px-3 border border-slate-300 rounded-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-sm text-slate-700 font-normal shadow-2xs cursor-pointer"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Terms & Privacy Note */}
              <p className="text-[12px] text-center text-slate-500 mt-6 leading-relaxed px-2">
                Bằng việc đăng nhập, bạn đồng ý với{' '}
                <Link to="#" className="text-[#ee4d2d] hover:underline">
                  Điều khoản dịch vụ
                </Link>{' '}
                &{' '}
                <Link to="#" className="text-[#ee4d2d] hover:underline">
                  Chính sách bảo mật
                </Link>{' '}
                của PharmAI
              </p>
            </form>
          </div>
        )}

        {/* Footer Navigation Link */}
        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-sm text-slate-400">
          Bạn mới biết đến PharmAI?{' '}
          <Link to="/register" className="text-[#ee4d2d] font-medium hover:underline">
            Đăng ký
          </Link>
        </div>

        {/* Modal Chọn / Nhập Tài khoản Google */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl text-slate-800 space-y-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <h3 className="text-base font-bold text-slate-800">Đăng nhập bằng Google</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Chọn tài khoản Google mẫu bên dưới hoặc nhập email Google của bạn:
              </p>

              {/* Quick Select Accounts */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleLoginSubmit('user.google@gmail.com', 'Google User')}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                      G
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-[#ee4d2d] transition-colors">
                        Google User
                      </div>
                      <div className="text-[11px] text-slate-500">user.google@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#ee4d2d]">Chọn</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleLoginSubmit('admin@pharmai.com', 'Admin PharmAI')}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-[#ee4d2d] transition-colors">
                        Admin PharmAI (Google Auth)
                      </div>
                      <div className="text-[11px] text-slate-500">admin@pharmai.com</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#ee4d2d]">Chọn</span>
                </button>
              </div>

              {/* Custom Input Option */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Hoặc nhập Email Google khác:</label>
                <input
                  type="email"
                  placeholder="vi_du@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-sm text-xs text-slate-800 outline-none focus:border-slate-500"
                />
                <input
                  type="text"
                  placeholder="Họ và tên (Tùy chọn)"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-sm text-xs text-slate-800 outline-none focus:border-slate-500"
                />
                <button
                  type="button"
                  onClick={() => handleGoogleLoginSubmit(googleEmailInput, googleNameInput)}
                  disabled={!googleEmailInput.trim()}
                  className="w-full py-2.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Xác nhận đăng nhập với Email này
                </button>
              </div>
            </div>
          </div>
        )}
      </AuthLayout>
    </PageTransition>
  );
}
