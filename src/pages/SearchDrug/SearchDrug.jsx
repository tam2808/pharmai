import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Pill, Sparkles, Heart, Activity, Stethoscope, Baby, FileText, Filter } from 'lucide-react';
import { getDrugs } from '../../services/drugApi';
import FilterSidebar from './FilterSidebar';
import DrugCard from '../../components/features/DrugCard';
import { DrugCardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/features/EmptyState';
import PageTransition from '../../components/layout/PageTransition';
import { staggerContainer, fadeInUp } from '../../utils/motionVariants';

const quickCategories = [
  { id: '', name: 'Tất cả sản phẩm', icon: Pill, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'ke-don', name: 'Thuốc kê đơn', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'tpcn', name: 'Thực phẩm chức năng', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'duoc-my-pham', name: 'Dược mỹ phẩm', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'thiet-bi-y-te', name: 'Thiết bị y tế', icon: Activity, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'cam-cum', name: 'Cảm cúm & Hạ sốt', icon: Stethoscope, color: 'text-teal-600', bg: 'bg-teal-50' },
];

export default function SearchDrug() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    category: categoryParam,
    form: '',
    requiresPrescription: '',
  });

  useEffect(() => {
    if (categoryParam !== filters.category) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      form: '',
      requiresPrescription: '',
    });
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchFilteredDrugs = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiParams = {};
      if (searchQuery) apiParams.q = searchQuery;
      if (filters.category) apiParams.category = filters.category;
      if (filters.form) apiParams.form = filters.form;
      if (filters.requiresPrescription !== '') {
        apiParams.requiresPrescription = filters.requiresPrescription;
      }
      const response = await getDrugs(apiParams);
      const list = Array.isArray(response) ? response : response?.content || response?.data || [];
      setDrugs(list);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách thuốc');
    } fontally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getDrugs({
      ...(searchQuery && { q: searchQuery }),
      ...(filters.category && { category: filters.category }),
      ...(filters.form && { form: filters.form }),
      ...(filters.requiresPrescription !== '' && { requiresPrescription: filters.requiresPrescription }),
    })
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : res?.content || res?.data || [];
        setDrugs(list);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Lỗi khi tải danh sách thuốc');
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [searchQuery, filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryVal = e.target.search.value.trim();
    if (queryVal) {
      setSearchParams({ q: queryVal });
    } else {
      setSearchParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageTransition className="py-8 bg-background min-h-screen">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-12">
        
        {/* Header & Local Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-6">
          <div>
            <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
              Hệ thống dược phẩm PharmAI
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-text-primary mt-1">
              Tra cứu & Đặt thuốc chính hãng
            </h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Search size={18} />
            </div>
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Tìm tên thuốc, hoạt chất hoặc mã..."
              className="w-full bg-surface border border-border text-text-primary pl-12 pr-4 py-3.5 rounded-2xl text-xs sm:text-sm outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(11,61,46,0.1)] shadow-xs"
            />
          </form>
        </div>

        {/* Top Quick Category Chips Bar */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = (!filters.category && !cat.id) || filters.category?.toLowerCase() === cat.name.toLowerCase() || filters.category === cat.id;

              return (
                <button
                  key={cat.id || 'all'}
                  onClick={() => {
                    handleFilterChange({ category: cat.id ? cat.name : '' });
                    if (cat.id) {
                      setSearchParams({ category: cat.id });
                    } else {
                      setSearchParams({});
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-xs ${
                    isSelected
                      ? 'gradient-primary text-white shadow-glow'
                      : 'bg-surface border border-border/80 text-text-primary hover:border-primary/40 hover:bg-surface-hover'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : `${cat.bg} ${cat.color}`}`}>
                    <Icon size={14} />
                  </div>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Column 1 - Filters (Sticky sidebar) */}
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Column 2 - Drug Grid / Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <DrugCardSkeleton key={idx} />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                title="Lỗi tải dữ liệu"
                description={error}
                onRetry={fetchFilteredDrugs}
              />
            ) : drugs.length === 0 ? (
              <EmptyState
                title="Không tìm thấy thuốc"
                description="Chúng tôi không tìm thấy thuốc phù hợp với từ khóa hoặc bộ lọc của bạn. Hãy thử xóa bớt tiêu chí lọc."
                onRetry={handleResetFilters}
                retryText="Xóa tất cả bộ lọc"
              />
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {drugs.map((drug) => (
                  <motion.div key={drug.id} variants={fadeInUp} className="h-full">
                    <DrugCard drug={drug} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
