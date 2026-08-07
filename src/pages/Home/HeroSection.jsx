import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Star, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/features/SearchBar';

const slides = [
  {
    id: 1,
    tag: '🏥 Hệ thống y tế thông minh',
    title: 'Đặt thuốc online',
    titleHighlight: 'An toàn & Nhanh chóng',
    subtitle: 'Tìm thuốc chính xác, nhận tư vấn AI 24/7, giao hàng tận nơi. Trải nghiệm mua thuốc thông minh nhất Việt Nam.',
    color: 'from-sky-50 to-blue-50',
  },
  {
    id: 2,
    tag: '🤖 Công nghệ AI tiên tiến',
    title: 'Chatbot AI',
    titleHighlight: 'Tư vấn mọi lúc',
    subtitle: 'Tra cứu tương tác thuốc, chỉ định, chống chỉ định và liều lượng chuẩn FDA chỉ trong vài giây.',
    color: 'from-blue-50 to-indigo-50',
  },
  {
    id: 3,
    tag: '✅ Kiểm định chất lượng',
    title: 'Thuốc chính hãng',
    titleHighlight: 'Đảm bảo nguồn gốc',
    subtitle: 'Toàn bộ dược phẩm được kiểm duyệt nghiêm ngặt. Cam kết 100% thuốc chính hãng, có giấy phép lưu hành.',
    color: 'from-emerald-50 to-teal-50',
  },
];

/* Floating feature cards */
const floatingCards = [
  {
    id: 'shield',
    icon: ShieldCheck,
    label: 'Thuốc chính hãng',
    value: '100%',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    delay: 0,
    position: 'top-4 right-4',
  },
  {
    id: 'speed',
    icon: Zap,
    label: 'Giao hàng nhanh',
    value: '2 giờ',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    delay: 0.5,
    position: 'bottom-16 left-4',
  },
  {
    id: 'rating',
    icon: Star,
    label: 'Đánh giá',
    value: '4.9 ⭐',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    delay: 1,
    position: 'bottom-4 right-8',
  },
  {
    id: 'support',
    icon: Clock,
    label: 'Hỗ trợ',
    value: '24/7',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    delay: 1.5,
    position: 'top-20 left-6',
  },
];

/* Medical pill illustration */
function MedicalIllustration({ slide }) {
  return (
    <div className="relative w-full max-w-[420px] mx-auto aspect-square flex items-center justify-center">
      {/* Outer decorative rings */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/10 animate-spin-slow" />
      <div className="absolute inset-6 rounded-full border border-primary/8" />

      {/* Central orb */}
      <div className="relative w-52 h-52 lg:w-64 lg:h-64">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl animate-pulse" />

        {/* Circle gradient bg */}
        <div className="absolute inset-0 rounded-full gradient-primary opacity-10" />
        <div className="absolute inset-3 rounded-full bg-white shadow-xl flex items-center justify-center">
          <div className="text-center">
            {/* Animated medical cross */}
            <div className="w-20 h-20 mx-auto gradient-primary rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 6v28M6 20h28" stroke="white" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">PharmAI</p>
              <p className="text-[10px] text-text-muted">Smart Pharmacy</p>
            </div>
          </div>
        </div>

        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
      </div>

      {/* Floating mini cards */}
      {floatingCards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: card.delay + 0.5, duration: 0.5 }}
            className={`absolute ${card.position} glass rounded-2xl px-3 py-2.5 shadow-card border ${card.border} flex items-center gap-2 min-w-[110px]`}
            style={{ animation: `float ${3 + card.delay}s ease-in-out infinite`, animationDelay: `${card.delay}s` }}
          >
            <div className={`w-8 h-8 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={15} className={card.color} />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold text-text-primary">{card.value}</p>
              <p className="text-[9px] text-text-muted">{card.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section 
      className="relative pb-12 lg:pb-16 gradient-hero border-b border-border/30"
      style={{ paddingTop: '80px' }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/8 blur-3xl"
          style={{ animation: 'orbDrift 12s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent/8 blur-3xl"
          style={{ animation: 'orbDrift 15s ease-in-out infinite', animationDelay: '4s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet/5 blur-3xl"
          style={{ animation: 'orbDrift 18s ease-in-out infinite', animationDelay: '8s' }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 section-dots opacity-40" />
      </div>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: Text Content ── */}
          <div className="flex flex-col">
            {/* Min-height container to avoid layout shift */}
            <div className="min-h-[280px] lg:min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5"
                >
                  {/* Tag pill */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 border border-primary/20 rounded-full text-sm font-semibold text-primary shadow-xs">
                      <Sparkles size={13} className="text-amber-500" />
                      {slide.tag}
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-h1 text-text-primary"
                  >
                    {slide.title}{' '}
                    <span className="gradient-text block">{slide.titleHighlight}</span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-body-lg text-text-secondary max-w-[500px]"
                  >
                    {slide.subtitle}
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="flex flex-wrap gap-3 pt-1"
                  >
                    <Link
                      to="/search"
                      className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl shadow-glow hover:opacity-90 transition-opacity text-sm"
                    >
                      Đặt thuốc ngay
                      <ArrowRight size={15} />
                    </Link>
                    <Link
                      to="/chatbot"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-border text-text-primary font-semibold rounded-xl hover:border-primary hover:text-primary transition-colors shadow-xs text-sm"
                    >
                      <span className="text-base">🤖</span>
                      Hỏi AI ngay
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Search Bar */}
            <div className="mt-6 max-w-[540px]">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
                🔍 Tìm kiếm nhanh
              </p>
              <SearchBar placeholder="Tìm tên thuốc, hoạt chất, bệnh lý..." />
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-2 mt-6">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-400 ${
                    current === idx
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-border hover:bg-primary/40'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs text-text-muted font-medium">
                {current + 1}/{slides.length}
              </span>
            </div>
          </div>

          {/* ── Right: Illustration ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative hidden lg:flex justify-center"
          >
            <MedicalIllustration slide={slide} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
