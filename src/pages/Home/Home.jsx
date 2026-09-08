import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pill, 
  Sparkles, 
  Heart, 
  Activity, 
  Baby, 
  ArrowRight, 
  Bot, 
  MessageSquare,
  Users,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import HeroSection from './HeroSection';
import DrugCard from '../../components/features/DrugCard';
import Skeleton from '../../components/ui/Skeleton';
import { getDrugs } from '../../services/drugApi';

const categories = [
  { id: 'Thuốc kê đơn', name: 'Dược phẩm', icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'Giảm đau', name: 'Chăm sóc sức khỏe', icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'Chăm sóc cá nhân', name: 'Chăm sóc cá nhân', icon: Baby, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'Thực phẩm chức năng', name: 'Thực phẩm chức năng', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'Da liễu', name: 'Chăm sóc sắc đẹp', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'Thiết bị y tế', name: 'Thiết bị y tế', icon: Activity, color: 'text-sky-600', bg: 'bg-sky-50' },
];

export default function Home() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
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

  const filteredDrugs = activeTab === 'all'
    ? drugs
    : drugs.filter(d => d.category?.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <main className="min-h-screen bg-slate-50/60 pb-16 space-y-10 font-body">
      {/* ── 1. Dola Pharmacy Hero Slider & Category Sidebar ── */}
      <HeroSection />

      {/* ── 2. Quick Category Icons Grid ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-wide border-l-4 border-[#009640] pl-2.5">
              DANH MỤC SẢN PHẨM NỔI BẬT
            </h2>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="text-xs font-bold text-[#009640] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Xem tất cả <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat.id)}`)}
                className="bg-white border border-slate-200 hover:border-[#009640] rounded-xl p-3.5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md group flex flex-col items-center justify-center cursor-pointer"
              >
                <div className={`w-11 h-11 ${cat.bg} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={cat.color} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#009640] transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. Promo Banner Cards (3 Columns) ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/search?category=Th%E1%BB%B1c%20ph%E1%BA%A9m%20ch%E1%BB%A9c%20n%C4%83ng')}
            className="bg-gradient-to-r from-[#009640] to-emerald-600 text-white rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                GIẢM GIÁ 20%
              </span>
              <h3 className="font-black text-base uppercase">THỰC PHẨM CHỨC NĂNG</h3>
              <p className="text-xs text-emerald-100 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Mua ngay <ArrowRight size={12} />
              </p>
            </div>
            <Sparkles size={36} className="text-white/80 group-hover:scale-110 transition-transform" />
          </div>

          <div
            onClick={() => navigate('/search?category=Da%20li%E1%BB%85u')}
            className="bg-gradient-to-r from-[#EE4D2D] to-orange-500 text-white rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                DƯỢC MỸ PHẨM
              </span>
              <h3 className="font-black text-base uppercase">CHĂM SÓC SẮC ĐẸP</h3>
              <p className="text-xs text-orange-100 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Khám phá <ArrowRight size={12} />
              </p>
            </div>
            <Heart size={36} className="text-white/80 group-hover:scale-110 transition-transform" />
          </div>

          <div
            onClick={() => navigate('/search?category=Gi%E1%BA%A3m%20%C4%91au')}
            className="bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                THUỐC CHÍNH HÃNG
              </span>
              <h3 className="font-black text-base uppercase">GIẢM ĐAU HẠ SỐT</h3>
              <p className="text-xs text-sky-100 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Xem chi tiết <ArrowRight size={12} />
              </p>
            </div>
            <ShieldCheck size={36} className="text-white/80 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </section>

      {/* ── 4. Main Products Showcase Section ("SẢN PHẨM BÁN CHẠY") ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-wide border-l-4 border-[#009640] pl-2.5">
            SẢN PHẨM BÁN CHẠY
          </h2>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'Thuốc kê đơn', label: 'Dược phẩm' },
              { key: 'Thực phẩm chức năng', label: 'Thực phẩm chức năng' },
              { key: 'Da liễu', label: 'Dược mỹ phẩm' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-[#009640] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-[#009640]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3">
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredDrugs.length === 0 ? (
          <div className="text-center py-10 bg-white border border-slate-200 rounded-xl">
            <Pill size={32} className="mx-auto text-slate-400 mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-600">Chưa có sản phẩm nào thuộc danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDrugs.slice(0, 8).map((drug) => (
              <DrugCard key={drug.id} drug={drug} />
            ))}
          </div>
        )}
      </section>

      {/* ── 5. AI Pharmacist Feature Banner Card ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#007A33] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-500/20">
          <div className="space-y-2 max-w-xl">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold rounded-full inline-flex items-center gap-1">
              <Bot size={13} /> Trợ lý AI PharmAI 24/7
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display leading-tight">
              Tư Vấn Triệu Chứng & Kiểm Tra Tương Tác Thuốc Tức Thì
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Trò chuyện cùng Dược sĩ AI PharmAI để nhận giải đáp an toàn về biệt dược và liều dùng thích hợp.
            </p>
          </div>

          <button
            onClick={() => navigate('/chatbot')}
            className="px-5 py-3 rounded-full bg-[#009640] hover:bg-[#007A33] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <MessageSquare size={15} />
            HỎI DƯỢC SĨ AI NGAY
          </button>
        </div>
      </section>

      {/* ── 6. Family Health Section ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12 space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-wide border-l-4 border-[#009640] pl-2.5">
            BẢO VỆ SỨC KHỎE CHO GIA ĐÌNH
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all text-center space-y-2.5">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-[#009640] flex items-center justify-center">
              <Baby size={24} />
            </div>
            <h3 className="font-extrabold text-xs text-slate-900 uppercase">DÀNH CHO TRẺ EM</h3>
            <p className="text-[11px] text-slate-500">Siro ho, Vitamin tăng sức đề kháng & men vi sinh</p>
            <button
              onClick={() => navigate('/search')}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#009640] hover:text-white text-xs font-bold text-slate-700 transition-colors uppercase cursor-pointer"
            >
              Xem Sản Phẩm
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all text-center space-y-2.5">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Heart size={24} />
            </div>
            <h3 className="font-extrabold text-xs text-slate-900 uppercase">DÀNH CHO MẸ VÀ BÉ</h3>
            <p className="text-[11px] text-slate-500">Sắt, Canxi & Vitamin cho mẹ trước & sau sinh</p>
            <button
              onClick={() => navigate('/search')}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#009640] hover:text-white text-xs font-bold text-slate-700 transition-colors uppercase cursor-pointer"
            >
              Xem Sản Phẩm
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all text-center space-y-2.5">
            <div className="w-12 h-12 mx-auto rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="font-extrabold text-xs text-slate-900 uppercase">DÀNH CHO NGƯỜI CAO TUỔI</h3>
            <p className="text-[11px] text-slate-500">Bổ não, tim mạch, bổ xương khớp & điều hòa huyết áp</p>
            <button
              onClick={() => navigate('/search')}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#009640] hover:text-white text-xs font-bold text-slate-700 transition-colors uppercase cursor-pointer"
            >
              Xem Sản Phẩm
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
