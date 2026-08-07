import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute - Bảo vệ các route yêu cầu đăng nhập
 * Nếu chưa đăng nhập, redirect về trang login và lưu lại trang trước đó
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Lưu lại location hiện tại để sau khi login thành công có thể quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
