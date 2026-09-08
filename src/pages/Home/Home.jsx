import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Activity, 
  Baby, 
  UserCheck, 
  Users, 
  Pill,
  Award
} from 'lucide-react';
import HeroSection from './HeroSection';
import DrugCard from '../../components/features/DrugCard';
import Skeleton from '../../components/ui/Skeleton';
import { getDrugs } from '../../services/drugApi';

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
    : drugs.filter(d => d.category?.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <main className="min-h-screen bg-slate-50 pb-16 space-y-8">
      {/* ── 1. Traphaco Visual Hero Carousel + Advisory Widget ── */}
      <HeroSection />

      {/* ── 2. 3 Featured Promo Category Banner Cards ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Green Banner */}
          <Link
            to="/search?category=Gi%E1%BA%A3m%20%C4%91au"
            className="group relative rounded-2xl overflow-hidden p-6 bg-gradient-to-r from-[#009640] to-[#059669] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-between min-h-[130px]"
          >
            <div className="space-y-1 z-10">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Hot Tháng Này
              </span>
              <h3 className="text-lg font-black tracking-tight uppercase leading-tight">
                TĂNG SỨC ĐỀ KHÁNG
              </h3>
              <p className="text-xs text-emerald-100 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Xem ngay sản phẩm <ArrowRight size={13} />
              </p>
            </div>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck size={40} />
            </div>
          </Link>

          {/* Card 2: Red/Orange Banner */}
          <Link
            to="/search?category=Da%20li%E1%BB%85u"
            className="group relative rounded-2xl overflow-hidden p-6 bg-gradient-to-r from-[#EE4D2D] to-[#EA580C] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-between min-h-[130px]"
          >
            <div className="space-y-1 z-10">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Chăm Sóc Sức Khỏe
              </span>
              <h3 className="text-lg font-black tracking-tight uppercase leading-tight">
                ĐẸP HƠN KHỎE MẠNH HƠN
              </h3>
              <p className="text-xs text-orange-100 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Khám phá ưu đãi <ArrowRight size={13} />
              </p>
            </div>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles size={40} />
            </div>
          </Link>

          {/* Card 3: Cyan/Blue Banner */}
          <Link
            to="/search?category=Ti%C3%AAu%20h%C3%B3a"
            className="group relative rounded-2xl overflow-hidden p-6 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-between min-h-[130px]"
          >
            <div className="space-y-1 z-10">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Tiêu Hóa Khỏe
              </span>
              <h3 className="text-lg font-black tracking-tight uppercase leading-tight">
                TỐT CHO HỆ TIÊU HÓA
              </h3>
              <p className="text-xs text-sky-100 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Mua ngay giá tốt <ArrowRight size={13} />
              </p>
            </div>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <Activity size={40} />
            </div>
          </Link>

        </div>
      </section>

      {/* ── 3. Section: "SẢN PHẨM BÁN CHẠY" ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12 py-4">
        {/* Section Title with Diamond Line Accent */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-wide font-display">
            SẢN PHẨM BÁN CHẠY
          </h2>
          <div className="flex items-center justify-center gap-3 text-[#009640]">
            <span className="w-12 h-[1px] bg-emerald-300" />
            <span className="w-2 h-2 rotate-45 bg-[#009640]" />
            <span className="w-12 h-[1px] bg-emerald-300" />
          </div>
        </div>

        {/* Product Carousel Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative group">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {drugs.slice(0, 5).map((drug) => (
                <DrugCard key={drug.id} drug={drug} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 4. Banner Section: "BẢO VỆ SỨC KHỎE CHO GIA ĐÌNH BẠN" ── */}
      <section className="bg-gradient-to-r from-[#009640] via-[#059669] to-[#007A33] py-10 text-white border-y border-emerald-700">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
              An Tâm Chăm Sóc
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide font-display">
              BẢO VỆ SỨC KHỎE CHO GIA ĐÌNH BẠN
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Giải pháp toàn diện từ sản phẩm dược phẩm chuẩn y tế GPP cho mọi lứa tuổi
            </p>
          </div>

          {/* 3 Family Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Dành Cho Trẻ Em */}
            <div className="bg-white rounded-2xl p-4 text-center shadow-lg text-slate-800 group hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-[#009640] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Baby size={32} />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#009640] mb-1">
                DÀNH CHO TRẺ EM
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Siro ho, Vitamin tăng sức đề kháng, tiêu hóa nhi khoa
              </p>
              <button
                onClick={() => navigate('/search')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#009640] hover:text-white text-xs font-bold text-slate-700 transition-colors uppercase"
              >
                Xem Danh Mục
              </button>
            </div>

            {/* Card 2: Dành Cho Mẹ Và Bé */}
            <div className="bg-white rounded-2xl p-4 text-center shadow-lg text-slate-800 group hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Heart size={32} />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#009640] mb-1">
                DÀNH CHO MẸ VÀ BÉ
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Sắt bầu, Canxi, Vitamin tổng hợp cho mẹ trước & sau sinh
              </p>
              <button
                onClick={() => navigate('/search')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#009640] hover:text-white text-xs font-bold text-slate-700 transition-colors uppercase"
              >
                Xem Danh Mục
              </button>
            </div>

            {/* Card 3: Dành Cho Người Cao Tuổi */}
            <div className="bg-white rounded-2xl p-4 text-center shadow-lg text-slate-800 group hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#009640] mb-1">
                DÀNH CHO NGƯỜI CAO TUỔI
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Bổ não, tim mạch, bổ xương khớp, tăng cường trí nhớ
              </p>
              <button
                onClick={() => navigate('/search')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#009640] hover:text-white text-xs font-bold text-slate-700 transition-colors uppercase"
              >
                Xem Danh Mục
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. Section: "SẢN PHẨM THEO BỆNH LÝ" ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12 py-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-wide font-display flex items-center gap-2">
              <Activity className="text-[#009640]" size={24} />
              SẢN PHẨM THEO BỆNH LÝ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Lựa chọn thuốc theo nhu cầu điều trị cụ thể</p>
          </div>

          {/* Disease Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'Giảm đau', label: 'Giảm đau - Hạ sốt' },
              { key: 'Kháng sinh', label: 'Kháng sinh' },
              { key: 'Tiêu hóa', label: 'Tiêu hóa' },
              { key: 'Da liễu', label: 'Da liễu' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === tab.key
                    ? 'bg-[#009640] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-[#009640] hover:bg-emerald-50/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredDrugs.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
            <Pill size={36} className="mx-auto text-slate-400 mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-600">Chưa có sản phẩm nào thuộc danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredDrugs.slice(0, 10).map((drug) => (
              <DrugCard key={drug.id} drug={drug} />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
