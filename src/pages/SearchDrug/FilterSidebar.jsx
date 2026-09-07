import { useEffect, useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Pill, 
  Sparkles, 
  Heart, 
  Activity, 
  ShieldCheck, 
  FileText, 
  Check,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { getCategories } from '../../services/drugApi';
import { cn } from '../../utils/helpers';

const categoryIconMap = {
  'Giảm đau - Hạ sốt': { icon: Pill, color: 'text-rose-600', bg: 'bg-rose-50' },
  'Kháng sinh': { icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Tiêu hóa': { icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Vitamin': { icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50' },
  'Tim mạch': { icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
  'Thuốc kê đơn': { icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Thực phẩm chức năng': { icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Dược mỹ phẩm': { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
  'Thiết bị y tế': { icon: Stethoscope, color: 'text-sky-600', bg: 'bg-sky-50' },
  'default': { icon: Pill, color: 'text-primary', bg: 'bg-primary-lighter/40' },
};

function getCategoryMeta(name = '') {
  const matchedKey = Object.keys(categoryIconMap).find((k) => name.includes(k));
  return categoryIconMap[matchedKey || 'default'];
}

export default function FilterSidebar({ filters, onFilterChange, onReset }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await getCategories();
        const data = Array.isArray(response) ? response : response?.data || [];
        setCategories(data);
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
    <aside className="w-full bg-surface border border-border/80 rounded-3xl p-5 lg:p-6 shadow-xs space-y-6 lg:sticky lg:top-24">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Filter size={16} />
          </div>
          <h3 className="font-extrabold text-text-primary text-base">Bộ lọc danh mục</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold transition-colors"
          >
            <RotateCcw size={13} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* 1. Nhóm thuốc / Danh mục */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-text-muted uppercase tracking-wider">
          Nhóm thuốc chính
        </h4>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.name;
            const meta = getCategoryMeta(cat.name);
            const Icon = meta.icon;

            return (
              <button
                key={cat.id || cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 text-left group',
                  isSelected
                    ? 'gradient-primary text-white shadow-xs'
                    : 'bg-surface-hover/40 hover:bg-surface-hover border border-border/50 text-text-primary'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                      isSelected ? 'bg-white/20 text-white' : `${meta.bg} ${meta.color}`
                    )}
                  >
                    <Icon size={14} />
                  </div>
                  <span className="line-clamp-1">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  {cat.count !== undefined && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-mono',
                        isSelected ? 'bg-white/20 text-white' : 'bg-surface border border-border text-text-muted'
                      )}
                    >
                      {cat.count}
                    </span>
                  )}
                  {isSelected && <Check size={14} className="text-white ml-0.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Dạng bào chế */}
      <div className="space-y-3 pt-4 border-t border-border/60">
        <h4 className="text-xs font-extrabold text-text-muted uppercase tracking-wider">Dạng dùng</h4>
        <div className="flex flex-wrap gap-2">
          {['Viên nén', 'Viên nang', 'Viên sủi', 'Viên nén bao phim', 'Kem bôi'].map((form) => {
            const isSelected = filters.form === form;
            return (
              <button
                key={form}
                onClick={() => handleFormSelect(form)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200',
                  isSelected
                    ? 'bg-primary border-primary text-white shadow-xs'
                    : 'bg-surface border border-border text-text-secondary hover:border-primary/40 hover:text-text-primary'
                )}
              >
                {form}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Yêu cầu đơn thuốc */}
      <div className="space-y-3 pt-4 border-t border-border/60">
        <h4 className="text-xs font-extrabold text-text-muted uppercase tracking-wider">Yêu cầu đơn thuốc</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePrescriptionSelect('yes')}
            className={cn(
              'px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center justify-center gap-1.5',
              filters.requiresPrescription === true
                ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                : 'bg-surface border border-border text-text-secondary hover:border-amber-400'
            )}
          >
            <FileText size={13} />
            <span>Cần đơn</span>
          </button>

          <button
            onClick={() => handlePrescriptionSelect('no')}
            className={cn(
              'px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center justify-center gap-1.5',
              filters.requiresPrescription === false
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-surface border border-border text-text-secondary hover:border-emerald-400'
            )}
          >
            <ShieldCheck size={13} />
            <span>Không đơn</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
