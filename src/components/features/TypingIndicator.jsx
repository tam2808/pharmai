import { motion } from 'framer-motion';

/**
 * TypingIndicator - Hiển thị 3 dấu chấm nhảy lệch pha 0.15s
 */
export default function TypingIndicator() {
  const dotVariants = {
    bounce: {
      y: [0, -6, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-surface border border-border rounded-2xl rounded-bl-sm w-fit shadow-sm">
      <motion.div
        variants={dotVariants}
        animate="bounce"
        className="w-2 h-2 bg-text-secondary/50 rounded-full"
      />
      <motion.div
        variants={dotVariants}
        animate="bounce"
        transition={{ delay: 0.15 }}
        className="w-2 h-2 bg-text-secondary/50 rounded-full"
      />
      <motion.div
        variants={dotVariants}
        animate="bounce"
        transition={{ delay: 0.3 }}
        className="w-2 h-2 bg-text-secondary/50 rounded-full"
      />
    </div>
  );
}
