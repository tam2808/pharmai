import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Bot, 
  Database, 
  Sparkles, 
  Award, 
  HeartHandshake, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight,
  Pill,
  Clock,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { fadeInUp, staggerContainer } from '../../utils/motionVariants';

export default function About() {
  const highlights = [
    {
      icon: Bot,
      title: 'Tư vấn Dược sĩ AI 24/7',
      desc: 'Hệ thống trí tuệ nhân tạo hỗ trợ giải đáp thắc mắc về liều dùng, công dụng và tác dụng phụ mọi lúc.',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      icon: Database,
      title: 'Dữ liệu chuẩn openFDA',
      desc: 'Kho thông tin thuốc được đồng bộ từ Cục quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA) và Bộ Y Tế.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: ShieldCheck,
      title: '100% Thuốc chính hãng',
      desc: 'Tất cả sản phẩm đều được kiểm định chất lượng, có xuất xứ rõ ràng và được bảo quản chuẩn GSP.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: Zap,
      title: 'Giao hàng siêu tốc 2H',
      desc: 'Đội ngũ giao hàng chuyên nghiệp hỗ trợ vận chuyển thuốc tận nơi nhanh chóng trong nội thành.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const stats = [
    { label: 'Khách hàng tin dùng', value: '50.000+' },
    { label: 'Danh mục sản phẩm', value: '10.000+' },
    { label: 'Đội ngũ Dược sĩ tư vấn', value: '100+' },
    { label: 'Tỷ lệ hài lòng', value: '99.2%' },
  ];

  const commitments = [
    'Chỉ bán thuốc chính hãng có giấy phép lưu hành.',
    'Dược sĩ chuyên môn cao kiểm tra kỹ trước khi giao.',
    'Cảnh báo tương tác thuốc tự động bằng thuật toán AI.',
    'Bảo mật thông tin đơn thuốc và lịch sử khám của khách hàng.',
  ];

  return (
    <main className="min-h-screen bg-background pt-6 pb-16">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden py-12 lg:py-16 gradient-hero border-b border-border/40">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-500" />
              Giới thiệu về PharmAI
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
              Hệ thống Nhà thuốc AI <span className="gradient-text">Thông minh & Tin cậy</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              PharmAI là giải pháp thương mại điện tử y tế tiên phong tích hợp trí tuệ nhân tạo, giúp người dân dễ dàng tiếp cận sản phẩm chăm sóc sức khỏe chính hãng cùng sự tư vấn chuyên sâu 24/7.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
            {stats.map((st, idx) => (
              <div key={idx} className="bg-surface/80 border border-border p-4 rounded-2xl shadow-xs backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary font-display">{st.value}</div>
                <div className="text-xs text-text-muted mt-1">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-12 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Giá trị cốt lõi & Công nghệ</h2>
          <p className="text-sm text-text-secondary mt-2">
            Ứng dụng công nghệ hiện đại nhằm đem đến trải nghiệm mua thuốc an toàn, minh bạch và nhanh chóng.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div key={i} variants={fadeInUp} className="h-full">
                <Card className="h-full p-6 flex flex-col justify-between hover:shadow-card-hover transition-all duration-300">
                  <div>
                    <div className={`w-12 h-12 ${h.bg} rounded-2xl flex items-center justify-center mb-4`}>
                      <Icon size={24} className={h.color} />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{h.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{h.desc}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Mission & Commitments */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Cam kết chất lượng</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-2 mb-4">
                Sức khỏe của bạn là ưu tiên hàng đầu của PharmAI
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Chúng tôi không chỉ cung cấp sản phẩm y tế mà còn đồng hành cùng bạn trong việc sử dụng thuốc an toàn, đúng liều lượng và tránh các tương tác nguy hiểm.
              </p>

              <div className="space-y-3">
                {commitments.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-text-primary">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/search">
                  <Button variant="primary" className="gap-2">
                    Khám phá sản phẩm
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button variant="outline" className="gap-2">
                    <Bot size={16} />
                    Tư vấn với Dược sĩ AI
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Box */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                    <Pill size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-lg">PharmAI Security & Safety</h4>
                    <p className="text-xs text-text-muted">Chuẩn hóa dữ liệu y tế openFDA</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/80 p-4 rounded-xl border border-border shadow-xs">
                    <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1">
                      <span>Cơ sở dữ liệu thuốc</span>
                      <span className="text-emerald-600">Đã xác minh</span>
                    </div>
                    <p className="text-xs text-text-secondary">Tích hợp mã ATC, tên thương mại & thành phần hoạt chất chính xác.</p>
                  </div>

                  <div className="bg-white/80 p-4 rounded-xl border border-border shadow-xs">
                    <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1">
                      <span>Tương tác thuốc & Cảnh báo</span>
                      <span className="text-emerald-600">Tự động 24/7</span>
                    </div>
                    <p className="text-xs text-text-secondary">Phân tích rủi ro khi dùng kết hợp nhiều loại thuốc cùng lúc.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support / Contact Hotline */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-12 py-16 text-center">
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Cần tư vấn trực tiếp từ Dược sĩ?</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              Tổng đài tư vấn sức khỏe miễn phí hoạt động từ 7:00 - 22:00 hàng ngày. Đội ngũ chuyên môn sẵn sàng hỗ trợ bạn.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <a 
                href="tel:18006868" 
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary font-extrabold rounded-xl shadow-lg hover:bg-slate-100 transition-colors text-base"
              >
                <PhoneCall size={20} />
                Hotline miễn phí: 1800-6868
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
