import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Star, Pill, Check } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';

/**
 * DrugCard — Traphaco Pharmacy E-Commerce Style Card
 */
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

  // Fake original price (+30%) for strikethrough effect like in reference image
  const originalPrice = Math.round((drug.price * 1.33) / 1000) * 1000;

  return (
    <Link to={`/drug/${drug.id}`} className="block group h-full select-none">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col h-full shadow-2xs hover:shadow-md transition-all overflow-hidden"
      >
        {/* Top Discount Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 bg-[#EE4D2D] text-white text-[10px] font-black rounded-full shadow-xs flex items-center gap-0.5 uppercase tracking-wide">
            Giảm -25%
          </span>
        </div>

        {/* Product Image */}
        <div className="relative w-full aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center p-3 border border-slate-100 group-hover:bg-emerald-50/30 transition-colors">
          {drug.image && !imgError ? (
            <img
              src={drug.image}
              alt={drug.name}
              onError={() => setImgError(true)}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#009640]">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/60 flex items-center justify-center">
                <Pill size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">{drug.form || 'Dược phẩm'}</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between space-y-1.5">
          <div>
            {/* Title (Uppercase Bold) */}
            <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-tight line-clamp-1 group-hover:text-[#009640] transition-colors">
              {drug.name}
            </h3>

            {/* Description Subtitle */}
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
              {drug.description || drug.activeIngredient || 'Bổ khí huyết, tăng cường sức khỏe toàn diện'}
            </p>

            {/* Rating Stars */}
            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[10px] text-slate-400 ml-1">(5.0)</span>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 line-through font-mono">
                {formatCurrency(originalPrice)}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#009640] font-mono">
                {formatCurrency(drug.price)}
              </span>
            </div>

            {/* Button full-width */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
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
                  XEM CHI TIẾT
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
