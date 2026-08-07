import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/motionVariants';

/**
 * PageTransition — Wrapper cho mỗi page component
 * Sử dụng pageTransition variants từ motionVariants.js
 */
export default function PageTransition({ children, className, ...props }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
