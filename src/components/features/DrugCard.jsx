import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Pill, Check, Star } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';

export default function DrugCard({ drug }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(drug));
    toast.success(`Đã thêm ${drug.name} vào giỏ hàng`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const originalPrice = Math.round((drug.price * 1.2) / 1000) * 1000;

  return (
    <Link to={`/drug/${drug.id}`} className="block group h-full select-none">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col h-full shadow-2xs hover:shadow-md hover:border-[#009640]/50 transition-all overflow-hidden"
      >
        {/* Discount Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 bg-[#EE4D2D] text-white text-[10px] font-black rounded-md uppercase tracking-wider shadow-2xs">
            Giảm 15%
          </span>
        </div>

        {/* Product Image Container */}
        <div className="relative w-full aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center p-2.5 border border-slate-100 group-hover:bg-emerald-50/20 transition-colors">
          {drug.image && !imgError ? (
            <img
              src={drug.image}
              alt={drug.name}
              onError={() => setImgError(true)}
              className="max-w-[88%] max-h-[88%] object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#009640]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/60 flex items-center justify-center">
                <Pill size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">{drug.form || 'Dược phẩm'}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            {/* Category */}
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#009640] bg-emerald-50 px-2 py-0.5 rounded mb-1 border border-emerald-100">
              {drug.category || 'Dược phẩm'}
            </span>

            {/* Title */}
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 group-hover:text-[#009640] transition-colors leading-snug">
              {drug.name}
            </h3>

            {/* Active Ingredient / Subtitle */}
            {drug.activeIngredient && (
              <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                {drug.activeIngredient}
              </p>
            )}

            {/* Stars */}
            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[10px] text-slate-400 ml-1">(5.0)</span>
            </div>
          </div>

          {/* Pricing & Add Button */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black text-[#009640] font-mono">
                {formatCurrency(drug.price)}
              </span>
              <span className="text-[11px] text-slate-400 line-through font-mono">
                {formatCurrency(originalPrice)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#009640] hover:bg-[#007A33] text-white'
              }`}
            >
              {added ? (
                <>
                  <Check size={13} />
                  ĐÃ THÊM
                </>
              ) : (
                <>
                  <ShoppingCart size={13} />
                  THÊM VÀO GIỎ
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
