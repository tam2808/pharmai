import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import Skeleton from '../components/ui/Skeleton';

// Lazy load pages
const Home = lazy(() => import('../pages/Home/Home'));
const SearchDrug = lazy(() => import('../pages/SearchDrug/SearchDrug'));
const DrugDetail = lazy(() => import('../pages/DrugDetail/DrugDetail'));
const Cart = lazy(() => import('../pages/Cart/Cart'));
const Checkout = lazy(() => import('../pages/Checkout/Checkout'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const VerifyEmail = lazy(() => import('../pages/Auth/VerifyEmail'));
const Chatbot = lazy(() => import('../pages/Chatbot/Chatbot'));
const OrderSuccess = lazy(() => import('../pages/OrderSuccess/OrderSuccess'));

// Admin pages
const Dashboard = lazy(() => import('../pages/Admin/Dashboard'));
const ManageDrugs = lazy(() => import('../pages/Admin/ManageDrugs'));
const ManageOrders = lazy(() => import('../pages/Admin/ManageOrders'));

// Loading fallback component
const PageLoader = () => (
  <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-12 space-y-8">
    <Skeleton shape="text" className="h-12 w-1/3" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton shape="card" className="h-64" />
      <Skeleton shape="card" className="h-64" />
      <Skeleton shape="card" className="h-64" />
    </div>
  </div>
);

const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0f1117]">
    <div className="w-10 h-10 border-2 border-[#0b3d2e] border-t-transparent rounded-full animate-spin" />
  </div>
);

function AdminGuard({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ROLE_ADMIN') return <Navigate to="/" replace />;
  return children;
}

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Main Layout routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<SearchDrug />} />
            <Route path="drug/:id" element={<DrugDetail />} />
            <Route path="cart" element={<Cart />} />
            
            {/* Protected Checkout route */}
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="order-success" element={<OrderSuccess />} />
          </Route>

          {/* Auth routes (no header/footer layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <Suspense fallback={<AdminLoader />}>
                  <AdminLayout />
                </Suspense>
              </AdminGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="drugs" element={<ManageDrugs />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

