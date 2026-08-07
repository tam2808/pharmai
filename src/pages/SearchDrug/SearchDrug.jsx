import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getDrugs } from '../../services/drugApi';
import FilterSidebar from './FilterSidebar';
import DrugCard from '../../components/features/DrugCard';
import { DrugCardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/features/EmptyState';
import PageTransition from '../../components/layout/PageTransition';
import { staggerContainer, fadeInUp } from '../../utils/motionVariants';

export default function SearchDrug() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    category: '',
    form: '',
    requiresPrescription: '',
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      form: '',
      requiresPrescription: '',
    });
    setSearchParams({});
  };

  const fetchFilteredDrugs = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiParams = {
        search: searchQuery,
        category: filters.category,
        form: filters.form,
      };
      if (filters.requiresPrescription !== '') {
        apiParams.requiresPrescription = filters.requiresPrescription;
      }
      const response = await getDrugs(apiParams);
      setDrugs(response.data);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách thuốc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredDrugs();
  }, [searchQuery, filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryVal = e.target.search.value.trim();
    if (queryVal) {
      setSearchParams({ q: queryVal });
    } else {
      setSearchParams({});
    }
  };

  return (
    <PageTransition className="py-12 bg-bg min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        
        {/* Header & Local Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Tra cứu dược phẩm
            </span>
            <h1 className="text-h3 lg:text-h2 text-text-primary mt-2">
              Danh mục sản phẩm
            </h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
              <Search size={18} />
            </div>
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Tìm tên thuốc, hoạt chất..."
              className="w-full bg-surface border border-border text-text-primary pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(11,61,46,0.1)]"
            />
          </form>
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
