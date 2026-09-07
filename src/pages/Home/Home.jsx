import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Pill, 
  Sparkles, 
  Activity, 
  Heart, 
  Stethoscope, 
  Baby, 
  ArrowRight, 
  Camera, 
  PhoneCall, 
  Info
} from 'lucide-react';
import HeroSection from './HeroSection';
import DrugCard from '../../components/features/DrugCard';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { getDrugs } from '../../services/drugApi';
import { fadeInUp, staggerContainer } from '../../utils/motionVariants';

const categories = [
  { id: 'ke-don', name: 'Thuốc kê đơn', icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'tpcn', name: 'Thực phẩm chức năng', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'duoc-my-pham', name: 'Dược mỹ phẩm', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'thiet-bi-y-te', name: 'Thiết bị y tế', icon: Activity, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'cham-soc-ca-nhan', name: 'Chăm sóc cá nhân', icon: Baby, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'cam-cum', name: 'Cảm cúm & Hạ sốt', icon: Stethoscope, color: 'text-teal-600', bg: 'bg-teal-50' },
];

export default function Home() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchDrugs = async () => {
      try {
        const data = await getDrugs();
        const list = Array.isArray(data) ? data : data?.content || data?.data || [];
        if (isMounted) {
          setDrugs(list);
          setLoading(false);
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách thuốc:', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchDrugs();
    return () => { isMounted = false; };
  }, []);

  const filteredDrugs = activeCategory === 'all'
    ? drugs
    : drugs.filter(d => d.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* 1. Pharmacity Visual Banner Hero Section */}
      <HeroSection />

      {/* 2. Quick Category Icons Grid */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-12 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-text-primary">Danh mục nổi bật</h2>
          <Link to="/search" className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/search?category=${cat.id}`)}
                className="bg-surface border border-border/80 hover:border-primary/50 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card group flex flex-col items-center justify-center cursor-pointer"
              >
                <div className={`w-12 h-12 ${cat.bg} rounded-2xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className={cat.color} />
                </div>
                <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Prescription Upload Fast Banner */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-12 mb-10">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
          {/* Decorative Image */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-25 pointer-events-none hidden md:block">
            <img src="/images/prescription_banner.png" alt="Prescription Banner" className="w-full h-full object-cover object-right" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-inner">
              <Camera size={28} />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Hỗ trợ đọc đơn thuốc</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Bạn có đơn thuốc của bác sĩ?
              </h3>
              <p className="text-xs text-white/90 mt-0.5">
                Tải ảnh đơn để Dược sĩ báo giá và giao tận nơi trong 2 giờ.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
            <Link to="/cart">
              <Button variant="secondary" className="gap-2 text-xs sm:text-sm font-extrabold py-3 px-5 bg-white text-emerald-800 hover:bg-slate-100 shadow-md">
                <Camera size={16} />
                Tải ảnh đơn ngay
              </Button>
            </Link>
            <a href="tel:18006868">
              <Button variant="outline" className="gap-2 text-xs sm:text-sm font-bold py-3 px-4 border-white/40 text-white hover:bg-white/10">
                <PhoneCall size={16} />
                1800-6868
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Featured Drugs Showcase */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-12 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">Thuốc & Sản phẩm nổi bật</h2>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveCategory('Thuốc kê đơn')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'Thuốc kê đơn'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Thuốc kê đơn
            </button>
            <button
              onClick={() => setActiveCategory('Thực phẩm chức năng')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'Thực phẩm chức năng'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Thực phẩm chức năng
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-4 space-y-3">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredDrugs.length === 0 ? (
          <div className="text-center py-12 bg-surface border border-border rounded-2xl">
            <Pill size={36} className="mx-auto text-text-muted mb-2 opacity-50" />
            <p className="text-sm font-semibold text-text-secondary">Chưa tìm thấy sản phẩm thuộc danh mục này.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredDrugs.slice(0, 8).map((drug) => (
              <motion.div key={drug.id} variants={fadeInUp}>
                <DrugCard drug={drug} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* 5. Minimal About Strip (Redirect to /about) */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-12 mt-10">
        <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-sm">
                Tìm hiểu về Chuẩn Y Tế openFDA & Công nghệ PharmAI
              </h3>
            </div>
          </div>

          <Link to="/about" className="shrink-0">
            <Button variant="outline" className="gap-2 text-xs font-bold py-2">
              Xem trang Giới thiệu
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
