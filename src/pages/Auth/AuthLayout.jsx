import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pill } from 'lucide-react';

export default function AuthLayout({ children, activeTab = 'login' }) {
  const location = useLocation();

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden bg-slate-100"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #ee4d2d15 40%, #00b0ff10 70%, #f1f5f9 100%)'
      }}
    >
      {/* Background Subtle Shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ee4d2d]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Logo Header */}
      <div className="mb-5 relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#ee4d2d] to-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Pill size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              Pharm<span className="text-[#ee4d2d]">AI</span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest -mt-0.5">
              Smart Pharmacy
            </span>
          </div>
        </Link>
      </div>

      {/* Main White Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] bg-white rounded-md p-6 sm:p-8 shadow-xl relative z-10 text-slate-800 border border-slate-200/80"
      >
        {/* Content Form */}
        {children}
      </motion.div>
    </div>
  );
}
