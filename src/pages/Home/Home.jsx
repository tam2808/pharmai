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
  PhoneCall,
  ChevronRight
} from 'lucide-react';
import HeroSection from './HeroSection';
import DrugCard from '../../components/features/DrugCard';
import Skeleton from '../../components/ui/Skeleton';
import { getDrugs } from '../../services/drugApi';

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
    <main className="min-h-screen bg-[#FAF8F5] pb-24 space-y-16 font-body relative">
      {/* ── 1. Hero Slider Banner & Commitment Cards ── */}
      <HeroSection />

      {/* ── 2. Template 995 Main Section: "SẢN PHẨM CỦA CHÚNG TÔI" ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12 space-y-8" style={{ paddingTop: '24px' }}>
        
        {/* Horizontal Line Divider Section Header (Matching Sample Screenshot) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '8px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#cbd5e1' }} />
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#2B2621', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.2 }}>
            SẢN PHẨM CỦA CHÚNG TÔI
          </h2>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#cbd5e1' }} />
        </div>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', fontWeight: 500, marginTop: '-8px', marginBottom: '16px' }}>
          100% Sản phẩm chuẩn y tế GPP, đạt chứng nhận an toàn Bộ Y tế & openFDA Hoa Kỳ.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'Tất cả sản phẩm' },
            { key: 'Thuốc kê đơn', label: 'Dược phẩm kê đơn' },
            { key: 'Thực phẩm chức năng', label: 'Thực phẩm chức năng' },
            { key: 'Da liễu', label: 'Dược mỹ phẩm' },
            { key: 'Thiết bị y tế', label: 'Thiết bị y tế' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                activeTab === tab.key
                  ? 'bg-[#10b981] text-white border-[#10b981] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#10b981]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid (4-Column Grid) */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-3">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredDrugs.length === 0 ? (
          <div className="text-center py-12 bg-white border-2 border-slate-200 rounded-2xl">
            <Pill size={36} className="mx-auto text-[#10b981] mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-600">Chưa có sản phẩm nào thuộc danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredDrugs.slice(0, 8).map((drug) => (
              <DrugCard key={drug.id} drug={drug} />
            ))}
          </div>
        )}

        {/* Outline "Xem Thêm" Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/search')}
            className="px-8 py-3 rounded-full border-2 border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs inline-flex items-center gap-2"
          >
            <span>XEM THÊM SẢN PHẨM</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 3. AI Pharmacist Consultation Feature Banner ── */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-12">
        <div className="bg-gradient-to-r from-[#2B2621] via-slate-900 to-[#047857] rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#10b981]">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 bg-[#10b981] text-white text-xs font-black uppercase tracking-wider rounded-full inline-flex items-center gap-1.5 shadow-xs">
              <Bot size={14} /> DƯỢC SĨ AI PHARMAI 24/7
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display leading-tight">
              Tư Vấn Triệu Chứng & Hướng Dẫn Dùng Thuốc An Toàn
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Trò chuyện trực tiếp cùng trợ lý Dược sĩ AI để tra cứu thông tin biệt dược, kiểm tra tương tác thuốc và giải đáp bệnh lý 24/7.
            </p>
          </div>

          <button
            onClick={() => navigate('/chatbot')}
            className="px-6 py-3.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageSquare size={16} />
            HỎI DƯỢC SĨ AI NGAY
          </button>
        </div>
      </section>

      {/* ── 4. Floating Contact Widgets (Template 995 Style) ── */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => navigate('/chatbot')}
          className="px-4 py-2.5 rounded-full bg-[#0084FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
        >
          <MessageSquare size={16} />
          <span>Chat AI Tư Vấn</span>
        </button>

        <a
          href="tel:0988888888"
          className="px-4 py-2.5 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white text-xs font-black shadow-xl flex items-center gap-2 transition-all hover:scale-105"
        >
          <PhoneCall size={16} className="animate-bounce" />
          <span>0988.888.888</span>
        </a>
      </div>

    </main>
  );
}
