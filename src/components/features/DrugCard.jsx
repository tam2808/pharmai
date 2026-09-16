import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Pill, Check } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';

/**
 * DrugCard — Template 995 Aesthetic Product Card
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

  const originalPrice = Math.round((drug.price * 1.25) / 1000) * 1000;

  return (
    <Link to={`/drug/${drug.id}`} className="block group h-full select-none">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col h-full shadow-2xs hover:shadow-lg hover:border-[#10b981] transition-all overflow-hidden text-center"
      >
        {/* Round Magenta Discount Badge (Template 995 Style) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="w-9 h-9 bg-[#E91E63] text-white text-[10px] font-black rounded-full shadow-md flex items-center justify-center">
            -15%
          </span>
        </div>

        {/* Product Image Container */}
        <div className="relative w-full aspect-square bg-[#FCFBFA] rounded-xl overflow-hidden mb-3 flex items-center justify-center p-3 border border-slate-100 group-hover:bg-emerald-50/30 transition-colors">
          {drug.image && !imgError ? (
            <img
              src={drug.image}
              alt={drug.name}
              onError={() => setImgError(true)}
              className="max-w-[90%] max-h-[90%] object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#10b981]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 flex items-center justify-center">
                <Pill size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">{drug.form || 'Dược phẩm'}</span>
            </div>
          )}
        </div>

        {/* Product Details (Centered Style of Template 995) */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            {/* Title (Centered Magenta / Dark Text) */}
            <h3 className="font-extrabold text-[#A81C5C] text-xs sm:text-sm line-clamp-2 group-hover:text-[#10b981] transition-colors leading-snug">
              {drug.name}
            </h3>

            {/* Subtitle / Active Ingredient */}
            {drug.activeIngredient && (
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                {drug.activeIngredient}
              </p>
            )}
          </div>

          {/* Pricing & "Mua Ngay" Pill Button */}
          <div className="pt-2 border-t border-[#F3ECE2] space-y-2">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[11px] text-slate-400 line-through font-mono">
                {formatCurrency(originalPrice)}
              </span>
              <span className="text-sm sm:text-base font-black text-[#D32F2F] font-mono">
                {formatCurrency(drug.price)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${added
                  ? 'bg-[#059669] text-white'
                  : 'bg-[#10b981] hover:bg-[#059669] text-white'
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
                  MUA NGAY
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
