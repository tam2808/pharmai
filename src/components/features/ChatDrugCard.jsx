import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { ShoppingCart, ExternalLink, Pill, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';

/**
 * ChatDrugCard — Compact drug card rendered inside the chatbot bubble area.
 * Shows image, name, price, "Chi tiết" link and "Thêm giỏ" button.
 */
export default function ChatDrugCard({ drug, index = 0 }) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 w-40 bg-white border border-border/70 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Drug Image */}
      <Link to={`/drug/${drug.id}`} className="block">
        <div className="relative w-full h-24 bg-gradient-to-br from-primary-lighter to-primary-light flex items-center justify-center overflow-hidden">
          {drug.requiresPrescription && (
            <span className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 px-1.5 py-0.5 bg-white/90 border border-amber-200 rounded-md text-[9px] font-semibold text-amber-700">
              <FileText size={8} />
              Kê đơn
            </span>
          )}
          {drug.image && !imgError ? (
            <img
              src={drug.image}
              alt={drug.name}
              onError={() => setImgError(true)}
              className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Pill size={18} className="text-white" strokeWidth={1.8} />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-2">
        <Link to={`/drug/${drug.id}`}>
          <p className="text-[11px] font-bold text-text-primary line-clamp-2 leading-snug hover:text-primary transition-colors">
            {drug.name}
          </p>
        </Link>

        {drug.category && (
          <p className="text-[9px] text-text-muted mt-0.5 line-clamp-1">{drug.category}</p>
        )}

        <p className="text-sm font-extrabold text-primary mt-1.5 leading-none">
          {formatCurrency(drug.price)}
          {drug.unit && <span className="text-[9px] font-normal text-text-muted ml-0.5">/{drug.unit}</span>}
        </p>

        {/* Buttons */}
        <div className="flex gap-1 mt-2">
          <Link
            to={`/drug/${drug.id}`}
            className="flex-1 flex items-center justify-center gap-0.5 py-1.5 rounded-lg border border-primary/30 text-primary text-[9px] font-semibold hover:bg-primary/5 transition-colors"
          >
            <ExternalLink size={9} />
            Xem
          </Link>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-200 ${
              added ? 'bg-accent text-white' : 'gradient-primary text-white'
            }`}
            aria-label={`Thêm ${drug.name} vào giỏ hàng`}
          >
            <ShoppingCart size={9} />
            {added ? '✓' : 'Thêm'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
