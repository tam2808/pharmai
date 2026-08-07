import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * AuthLayout - Layout dùng chung cho Login & Register
 * Có nền gradient-mesh thương hiệu và căn giữa card form
 */
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 gradient-mesh">
      {/* Brand Logo */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="text-2xl font-semibold text-text-primary font-display tracking-tight">
            Pharm<span className="text-accent">AI</span>
          </span>
        </Link>
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] bg-surface rounded-xl border border-border p-8 shadow-modal"
      >
        <div className="text-center mb-6">
          <h1 className="text-h3 font-semibold text-text-primary font-display mb-1.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </motion.div>
    </div>
  );
}
