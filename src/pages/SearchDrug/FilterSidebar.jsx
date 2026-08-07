import { useEffect, useState } from 'react';
import { getCategories } from '../../services/drugApi';
import { cn } from '../../utils/helpers';
import Button from '../../components/ui/Button';

/**
 * FilterSidebar - Sidebar bộ lọc thuốc
 * Nhóm thuốc, Dạng dùng, Yêu cầu kê đơn
 */
export default function FilterSidebar({ filters, onFilterChange, onReset }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };
    fetchCats();
  }, []);

  const handleCategorySelect = (categoryName) => {
    onFilterChange({
      category: filters.category === categoryName ? '' : categoryName,
    });
  };

  const handleFormSelect = (formName) => {
    onFilterChange({
      form: filters.form === formName ? '' : formName,
    });
  };

  const handlePrescriptionSelect = (requiresPrescription) => {
    // toggle hoặc chọn mới
    const currentVal = filters.requiresPrescription;
    let newVal = '';
    if (requiresPrescription === 'yes' && currentVal !== true) {
      newVal = true;
    } else if (requiresPrescription === 'no' && currentVal !== false) {
      newVal = false;
    }
    onFilterChange({ requiresPrescription: newVal });
  };

  const hasActiveFilters = filters.category || filters.form || filters.requiresPrescription !== '';

  return (
    <aside className="w-full bg-surface border border-border rounded-xl p-6 space-y-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-semibold text-text-primary text-base">Bộ lọc tìm kiếm</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-primary hover:text-accent font-semibold transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Nhóm thuốc */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Nhóm thuốc</h4>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start lg:gap-1.5">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={cn(
                  'px-3 py-1.5 lg:px-2.5 lg:py-1 rounded-lg text-xs font-medium border transition-all duration-200 w-fit text-left',
                  isSelected
                    ? 'bg-primary border-primary text-white'
                    : 'bg-bg border-border text-text-secondary hover:border-text-secondary/50 hover:text-text-primary'
                )}
              >
                {cat.name}
                <span className={cn('ml-1.5 text-[10px] opacity-60 font-mono', isSelected ? 'text-white' : 'text-text-secondary')}>
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dạng bào chế */}
      <div className="space-y-3 pt-4 border-t border-border/50">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Dạng dùng</h4>
        <div className="flex flex-wrap gap-2">
          {['Viên nén', 'Viên nang', 'Viên sủi', 'Viên nén bao phim'].map((form) => {
            const isSelected = filters.form === form;
            return (
              <button
                key={form}
                onClick={() => handleFormSelect(form)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  isSelected
                    ? 'bg-primary border-primary text-white'
                    : 'bg-bg border-border text-text-secondary hover:border-text-secondary/50'
                )}
              >
                {form}
              </button>
            );
          })}
        </div>
      </div>

      {/* Yêu cầu đơn thuốc */}
      <div className="space-y-3 pt-4 border-t border-border/50">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Yêu cầu đơn thuốc</h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handlePrescriptionSelect('yes')}
            className={cn(
              'px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left flex justify-between items-center',
              filters.requiresPrescription === true
                ? 'bg-primary border-primary text-white'
                : 'bg-bg border-border text-text-secondary hover:border-text-secondary/50'
            )}
          >
            <span>Cần đơn thuốc của bác sĩ</span>
            {filters.requiresPrescription === true && <span className="text-[10px]">✔</span>}
          </button>
          <button
            onClick={() => handlePrescriptionSelect('no')}
            className={cn(
              'px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left flex justify-between items-center',
              filters.requiresPrescription === false
                ? 'bg-primary border-primary text-white'
                : 'bg-bg border-border text-text-secondary hover:border-text-secondary/50'
            )}
          >
            <span>Không yêu cầu kê đơn</span>
            {filters.requiresPrescription === false && <span className="text-[10px]">✔</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
