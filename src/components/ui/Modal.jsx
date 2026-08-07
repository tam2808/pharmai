import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalOverlay, modalContent } from '../../utils/motionVariants';
import { cn } from '../../utils/helpers';

/**
 * Modal — Overlay dialog với AnimatePresence
 *
 * @param {boolean} isOpen - Hiển thị modal
 * @param {function} onClose - Đóng modal
 * @param {string} title - Tiêu đề modal
 * @param {string} size - sm | md | lg
 * @param {ReactNode} children - Nội dung
 */
const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  className,
  children,
}) {
  // Đóng bằng phím Escape
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            {...modalOverlay}
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className={cn(
              'relative w-full bg-surface rounded-xl shadow-modal',
              'max-h-[90vh] overflow-y-auto',
              modalSizes[size],
              className
            )}
            {...modalContent}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 id="modal-title" className="text-h3 text-text-primary">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary-light transition-colors"
                  aria-label="Đóng"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
