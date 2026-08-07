/* ============================================================
   Motion Variants — Framer Motion reusable animation configs
   "Spend boldness in one place" — chỉ animate có chủ đích
   ============================================================ */

// Ease curve: cubic-bezier for smooth, premium feel
const smoothEase = [0.22, 1, 0.36, 1];

/**
 * Fade in + slide up — dùng cho section, card khi vào viewport
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: smoothEase },
  },
};

/**
 * Stagger container — parent wrapper để stagger children animation
 * Dùng kèm với fadeInUp cho grid items
 */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/**
 * Page transition — dùng cho mỗi Page component trong AnimatePresence
 */
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeInOut' },
};

/**
 * Scale on hover — dùng cho DrugCard, interactive elements
 */
export const scaleOnHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

/**
 * Fade in — simple opacity animation
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: smoothEase },
  },
};

/**
 * Slide in from right — dùng cho Auth form transition
 */
export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: smoothEase },
};

/**
 * Slide in from left — dùng cho Auth form transition (reverse)
 */
export const slideInLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
  transition: { duration: 0.3, ease: smoothEase },
};

/**
 * Number pop — dùng cho quantity stepper, count-up
 */
export const numberPop = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

/**
 * Layout item — dùng cho CartItem khi thêm/xóa
 */
export const layoutItem = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

/**
 * Chat bubble — fade in + slide up nhẹ
 */
export const chatBubble = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: smoothEase },
  },
};

/**
 * Modal overlay + content
 */
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 8 },
  transition: { duration: 0.25, ease: smoothEase },
};
