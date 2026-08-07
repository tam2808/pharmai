import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { ShoppingCart, FileText, Pill, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import Badge from '../ui/Badge';

/**
 * Category → color map for pill badges
 */
const categoryColors = {
  'Giảm đau': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  'Kháng sinh': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  'Tiêu hóa': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  'Vitamin': { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
  'Tim mạch': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  'default': { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100' },
};

function getCategoryStyle(category = '') {
  const key = Object.keys(categoryColors).find((k) => category.includes(k));
  return categoryColors[key || 'default'];
}

/**
 * DrugCard v2 — Rounded, gradient placeholder, colored category pill, smooth hover
 */
export default function DrugCard({ drug }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const catStyle = getCategoryStyle(drug.category);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(drug));
    toast.success(`Đã thêm ${drug.name} vào giỏ hàng`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link to={`/drug/${drug.id}`} className="block group h-full">
      <motion.div
        whileHover={{ y: -5, boxShadow: 'var(--shadow-hover)' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative bg-white border border-border/60 rounded-2xl p-4 pb-6 flex flex-col h-full shadow-xs"
      >
        {/* Top gradient bar accent — clipped inside rounded-t-2xl */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-full h-full gradient-primary" />
        </div>

        {/* Drug Image or Placeholder */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-primary-lighter to-primary-light rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-primary/10 group-hover:border-primary/20 transition-colors p-3 shrink-0">
          {/* Prescription Badge */}
          {drug.requiresPrescription && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/95 border border-amber-200 rounded-lg text-[10px] font-semibold text-amber-700 shadow-xs">
                <FileText size={10} />
                Kê đơn
              </span>
            </div>
          )}

          {drug.image && !imgError ? (
            <img
              src={drug.image}
              alt={drug.name}
              onError={() => setImgError(true)}
              className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <>
              {/* Decorative bg circles */}
              <div className="absolute inset-0">
                <div className="absolute top-2 left-2 w-10 h-10 rounded-full bg-primary/5" />
                <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-accent/8" />
              </div>

              {/* Pill icon */}
              <div className="relative flex flex-col items-center gap-2">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Pill size={26} className="text-white" strokeWidth={1.8} />
                </div>
                <span className="text-[10px] font-semibold text-primary/60 bg-white/80 px-2.5 py-1 rounded-full border border-primary/10">
                  {drug.form || 'Thuốc'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Drug Info */}
        <div className="flex-1 flex flex-col">
          {/* Category pill */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
              <Tag size={8} />
              {drug.category || 'Dược phẩm'}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-bold text-text-primary text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-1">
            {drug.name}
          </h3>

          {/* Active ingredient */}
          {drug.activeIngredient && (
            <p className="text-[11px] text-text-muted font-mono line-clamp-1 mt-0.5">
              {drug.activeIngredient}
            </p>
          )}

          {/* Price + Add to cart */}
          <div className="mt-auto pt-3.5 flex items-center justify-between border-t border-border/40 mt-3 shrink-0">
            <div className="pl-0.5">
              <span className="text-base font-extrabold text-primary">
                {formatCurrency(drug.price)}
              </span>
              {drug.unit && (
                <span className="text-[10px] text-text-muted ml-1">/ {drug.unit}</span>
              )}
            </div>

            {/* Add to cart button */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 ${
                added
                  ? 'bg-accent text-white'
                  : 'gradient-primary text-white opacity-0 group-hover:opacity-100'
              } shadow-sm`}
              aria-label={`Thêm ${drug.name} vào giỏ hàng`}
            >
              <ShoppingCart size={12} />
              {added ? 'Đã thêm!' : 'Thêm'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
