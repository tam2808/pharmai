import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, ShieldCheck, HeartHandshake, Truck, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedDrugs } from '../../services/drugApi';
import HeroSection from './HeroSection';
import TrustStrip from './TrustStrip';
import DrugCard from '../../components/features/DrugCard';
import { DrugCardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import { fadeInUp, staggerContainer } from '../../utils/motionVariants';

const features = [
  {
    id: 'ai',
    icon: Bot,
    title: 'Tư vấn chuẩn hóa AI',
    desc: 'Chatbot AI thông minh sẵn sàng hỗ trợ tra cứu thành phần, chỉ định, tác dụng phụ của thuốc mọi lúc mọi nơi.',
    gradient: 'from-sky-50 to-blue-100',
    iconBg: 'from-sky-400 to-blue-500',
    iconColor: 'text-sky-600',
    accentColor: 'text-sky-600',
    link: '/chatbot',
  },
  {
    id: 'safe',
    icon: ShieldCheck,
    title: 'An toàn tuyệt đối',
    desc: 'Hệ thống cảnh báo chống chỉ định nghiêm ngặt. Xác minh chính xác các dược phẩm cần đơn thuốc từ bác sĩ.',
    gradient: 'from-emerald-50 to-green-100',
    iconBg: 'from-emerald-400 to-green-500',
    iconColor: 'text-emerald-600',
    accentColor: 'text-emerald-600',
    link: '/search',
  },
  {
    id: 'care',
    icon: HeartHandshake,
    title: 'Dịch vụ tận tâm',
    desc: 'Giao hàng nhanh chóng và chu đáo. Đội ngũ hỗ trợ chuyên môn cam kết làm hài lòng khách hàng tốt nhất.',
    gradient: 'from-violet-50 to-purple-100',
    iconBg: 'from-violet-400 to-purple-500',
    iconColor: 'text-violet-600',
    accentColor: 'text-violet-600',
    link: '/search',
  },
  {
    id: 'fast',
    icon: Truck,
    title: 'Giao hàng siêu tốc',
    desc: 'Đặt thuốc trước 4 giờ chiều, nhận hàng trong ngày. Giao hàng 2 giờ cho khu vực nội thành TP.HCM.',
    gradient: 'from-amber-50 to-orange-100',
    iconBg: 'from-amber-400 to-orange-500',
    iconColor: 'text-amber-600',
    accentColor: 'text-amber-600',
    link: '/search',
  },
];

const checkpoints = [
  'Thuốc 100% chính hãng, có nguồn gốc rõ ràng',
  'Dữ liệu dược phẩm chuẩn hóa theo openFDA',
  'Đội ngũ dược sĩ kiểm duyệt mỗi đơn hàng',
  'Bảo mật thông tin khách hàng tuyệt đối',
  'Hỗ trợ đổi trả trong vòng 7 ngày',
];

export default function Home() {
  const [featuredDrugs, setFeaturedDrugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getFeaturedDrugs();
        setFeaturedDrugs(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thuốc nổi bật:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <PageTransition>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* ───────────────────────────────────────────────
          3. Featured Drugs Section
      ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-bg">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 gradient-primary rounded-full" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Dành cho bạn
                </span>
              </div>
              <h2 className="text-h2 text-text-primary">
                Dược phẩm{' '}
                <span className="gradient-text">khuyên dùng</span>
              </h2>
              <p className="text-text-secondary mt-2 text-sm max-w-[400px]">
                Được lựa chọn bởi dược sĩ, đánh giá cao bởi hàng nghìn khách hàng.
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary-light px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all duration-200 shrink-0"
            >
              Xem tất cả
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Drug Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, idx) => (
                <DrugCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {featuredDrugs.map((drug) => (
                <motion.div key={drug.id} variants={fadeInUp} className="h-full">
                  <DrugCard drug={drug} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ───────────────────────────────────────────────
          4. Features Section — 2x2 gradient cards
      ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white border-y border-border/40 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/4 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/4 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-12 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-[600px] mx-auto mb-14"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-light text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              <Sparkles size={12} />
              Tại sao chọn PharmAI
            </span>
            <h2 className="text-h2 text-text-primary">
              Dịch vụ y tế{' '}
              <span className="gradient-text">kỷ nguyên số</span>
            </h2>
            <p className="text-text-secondary mt-4 text-body">
              Kết hợp chuyên môn y khoa cao cấp cùng sức mạnh trí tuệ nhân tạo, mang đến quy trình mua thuốc tối ưu nhất.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.id}
                  variants={fadeInUp}
                >
                  <Link to={feat.link} className="group block h-full">
                    <div className={`relative h-full bg-gradient-to-br ${feat.gradient} border border-white rounded-2xl p-6 shadow-xs hover:shadow-hover transition-all duration-300 group-hover:-translate-y-1 overflow-hidden`}>
                      {/* Corner decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-3xl bg-white/40" />

                      {/* Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${feat.iconBg} rounded-2xl flex items-center justify-center shadow-sm mb-4`}>
                        <Icon size={22} className="text-white" />
                      </div>

                      <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {feat.desc}
                      </p>

                      {/* Arrow link */}
                      <div className={`flex items-center gap-1 mt-4 text-xs font-semibold ${feat.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        Tìm hiểu thêm
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────
          5. Why Trust Us — checklist + visual
      ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-bg">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: checklist */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 gradient-primary rounded-full" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Cam kết của chúng tôi</span>
              </div>
              <h2 className="text-h2 text-text-primary mb-4">
                Đặt niềm tin vào{' '}
                <span className="gradient-text">PharmAI</span>
              </h2>
              <p className="text-text-secondary text-body mb-8">
                Chúng tôi hiểu rằng sức khỏe của bạn là tài sản quý giá nhất. Đó là lý do tại sao mọi quy trình đều được chuẩn hóa nghiêm ngặt.
              </p>

              <ul className="space-y-3.5">
                {checkpoints.map((point, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} className="text-accent" />
                    </div>
                    <span className="text-sm text-text-primary font-medium">{point}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/search">
                  <Button variant="primary" size="md">
                    Khám phá danh mục
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button variant="outline" size="md">
                    Hỏi dược sĩ AI
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: visual card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative gradient-hero rounded-3xl p-8 border border-border/30 shadow-hover overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/8 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/8 blur-2xl" />

                {/* Mock pharmacy interface */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">PharmAI Assistant</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <p className="text-xs text-accent font-medium">Đang hoạt động</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat bubbles */}
                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-xs max-w-[85%]">
                      <p className="text-sm text-text-primary">Xin chào! Tôi cần tìm thuốc hạ sốt cho trẻ em 5 tuổi, khoảng 18kg.</p>
                    </div>
                    <div className="bg-primary rounded-2xl rounded-tr-sm p-3.5 shadow-xs max-w-[85%] ml-auto">
                      <p className="text-sm text-white">✅ Tôi đề nghị <strong>Paracetamol 250mg</strong> — liều dùng 9mg/kg, mỗi 4-6 giờ. Cần đơn thuốc không?</p>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-xs max-w-[85%]">
                      <p className="text-sm text-text-primary">Thuốc không cần kê đơn, tôi có thể đặt ngay không?</p>
                    </div>
                    {/* Typing indicator */}
                    <div className="bg-primary/10 rounded-2xl rounded-tr-sm p-3.5 max-w-[100px] ml-auto">
                      <div className="flex items-center gap-1">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${delay}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick action chips */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Đặt hàng', 'Xem chi tiết', 'Sản phẩm tương tự'].map((chip) => (
                      <span key={chip} className="px-3 py-1.5 bg-white border border-border text-xs font-medium text-text-secondary rounded-full hover:border-primary hover:text-primary transition-colors cursor-pointer">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-3 -left-3 glass border border-border/50 rounded-2xl px-3 py-2 shadow-card flex items-center gap-2 animate-float">
                <div className="w-7 h-7 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Clock size={13} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-primary">Giao trong 2h</p>
                  <p className="text-[9px] text-text-muted">Nội thành TP.HCM</p>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 glass border border-border/50 rounded-2xl px-3 py-2 shadow-card flex items-center gap-2 animate-float-delay">
                <div className="w-7 h-7 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-xs">⭐</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-primary">4.9/5</p>
                  <p className="text-[9px] text-text-muted">8,500+ đánh giá</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────
          6. CTA Banner
      ─────────────────────────────────────────────── */}
      <section className="py-20 gradient-cta text-white relative overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-orb-drift" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" style={{ animation: 'orbDrift 15s ease-in-out infinite', animationDelay: '5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/3 blur-2xl pointer-events-none" />
        {/* Grid overlay */}
        <div className="absolute inset-0 section-grid opacity-10 pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 border border-white/20 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={14} className="text-amber-300" />
              Trải nghiệm ngay hôm nay — Miễn phí
            </span>
            <h2 className="text-h1 font-extrabold font-display max-w-[700px] mx-auto leading-tight gradient-text-cta">
              Bảo vệ sức khỏe gia đình với PharmAI
            </h2>
            <p className="text-body-lg text-white/70 max-w-[540px] mx-auto mt-5">
              Tư vấn thuốc bằng AI, đặt hàng nhanh, giao tận nơi. Tất cả chỉ trong một ứng dụng.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/chatbot">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  🤖 Trò chuyện với AI
                </motion.button>
              </Link>
              <Link to="/search">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 border border-white/25 text-white font-bold rounded-xl hover:bg-white/25 transition-all text-sm"
                >
                  Tra cứu danh mục thuốc
                  <ArrowRight size={15} />
                </motion.button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/60">
              {['✅ Không cần đăng ký để dùng thử', '🔒 Bảo mật tuyệt đối', '⚡ Phản hồi trong 3 giây'].map((item) => (
                <span key={item} className="font-medium">{item}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
