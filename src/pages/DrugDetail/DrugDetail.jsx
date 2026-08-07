import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
  ChevronLeft, ShoppingCart, ShieldAlert, FileText,
  CheckCircle2, Star, ShieldCheck, TrendingUp, Package,
  Heart, Share2, Truck
} from 'lucide-react';
import { toast } from 'sonner';
import { getDrugById, getAllDrugs } from '../../services/drugApi';
import { addToCart } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import DrugTabs from './DrugTabs';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import PageTransition from '../../components/layout/PageTransition';

/** Màu nền theo category */
const CATEGORY_COLORS = {
  'Giảm đau - Hạ sốt': { bg: 'bg-blue-500/10', icon: 'text-blue-500', ring: 'ring-blue-200' },
  'Kháng sinh': { bg: 'bg-rose-500/10', icon: 'text-rose-500', ring: 'ring-rose-200' },
  'Tiêu hóa': { bg: 'bg-amber-500/10', icon: 'text-amber-500', ring: 'ring-amber-200' },
  'Dị ứng': { bg: 'bg-purple-500/10', icon: 'text-purple-500', ring: 'ring-purple-200' },
  'Tiểu đường': { bg: 'bg-cyan-500/10', icon: 'text-cyan-500', ring: 'ring-cyan-200' },
  'Tim mạch': { bg: 'bg-red-500/10', icon: 'text-red-500', ring: 'ring-red-200' },
  'Vitamin & Khoáng chất': { bg: 'bg-yellow-500/10', icon: 'text-yellow-500', ring: 'ring-yellow-200' },
  'Hô hấp': { bg: 'bg-sky-500/10', icon: 'text-sky-500', ring: 'ring-sky-200' },
  'Xương khớp': { bg: 'bg-orange-500/10', icon: 'text-orange-500', ring: 'ring-orange-200' },
  'Da liễu': { bg: 'bg-pink-500/10', icon: 'text-pink-500', ring: 'ring-pink-200' },
  'Nhãn khoa': { bg: 'bg-teal-500/10', icon: 'text-teal-500', ring: 'ring-teal-200' },
};

/** Dữ liệu rating giả lập theo id thuốc */
const MOCK_RATINGS = {
  1: { score: 4.8, count: 1247 }, 2: { score: 4.6, count: 832 }, 3: { score: 4.5, count: 672 },
  4: { score: 4.7, count: 956 }, 5: { score: 4.9, count: 403 }, 6: { score: 4.8, count: 289 },
  7: { score: 4.6, count: 1103 }, 8: { score: 4.5, count: 567 }, 9: { score: 4.7, count: 892 },
  10: { score: 4.8, count: 234 }, 11: { score: 4.6, count: 1456 }, 12: { score: 4.5, count: 789 },
  13: { score: 4.7, count: 623 }, 14: { score: 4.8, count: 978 }, 15: { score: 4.9, count: 445 },
  16: { score: 4.7, count: 334 }, 17: { score: 4.6, count: 521 }, 18: { score: 4.8, count: 1123 },
  19: { score: 4.5, count: 445 }, 20: { score: 4.7, count: 267 }, 21: { score: 4.6, count: 389 },
  22: { score: 4.8, count: 712 }, 23: { score: 4.7, count: 298 }, 24: { score: 4.5, count: 534 },
  25: { score: 4.6, count: 623 }, 26: { score: 4.8, count: 445 }, 27: { score: 4.7, count: 356 },
  28: { score: 4.5, count: 289 }, 29: { score: 4.9, count: 178 }, 30: { score: 4.6, count: 234 },
};

const MOCK_SOLD = {
  1: 15420, 2: 9832, 3: 7251, 4: 11203, 5: 4312, 6: 3201, 7: 13562, 8: 6478,
  9: 8901, 10: 2345, 11: 17823, 12: 8932, 13: 7102, 14: 11045, 15: 4823,
  16: 3902, 17: 5621, 18: 14521, 19: 4901, 20: 2873, 21: 3421, 22: 7823,
  23: 3014, 24: 5612, 25: 6823, 26: 4523, 27: 3812, 28: 2901, 29: 1823, 30: 2412,
};

/** Component hiển thị sao */
function StarRating({ score }) {
  const full = Math.floor(score);
  const half = score - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(full)].map((_, i) => (
        <Star key={`f${i}`} size={14} className="fill-amber-400 text-amber-400" />
      ))}
      {half === 1 && (
        <div className="relative">
          <Star size={14} className="text-border" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={14} className="fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {[...Array(empty)].map((_, i) => (
        <Star key={`e${i}`} size={14} className="text-border" />
      ))}
    </div>
  );
}

/** Component Card thuốc liên quan */
function RelatedDrugCard({ drug, navigate }) {
  const colors = CATEGORY_COLORS[drug.category] || { bg: 'bg-primary/10', icon: 'text-primary' };
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/drug/${drug.id}`)}
      className="flex items-center gap-3 p-3 bg-bg border border-border rounded-xl cursor-pointer hover:border-primary/30 transition-all"
    >
      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
        <svg className={`w-5 h-5 ${colors.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary truncate">{drug.name}</p>
        <p className="text-xs text-text-secondary">{formatCurrency(drug.price)}</p>
      </div>
      <ChevronLeft size={14} className="text-text-secondary rotate-180 shrink-0" />
    </motion.div>
  );
}

export default function DrugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [drug, setDrug] = useState(null);
  const [relatedDrugs, setRelatedDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDrug = async () => {
      setLoading(true);
      setError(null);
      setImgError(false);
      try {
        const response = await getDrugById(id);
        const drugData = response.data;
        setDrug(drugData);
        // Fetch related drugs cùng category
        try {
          const allRes = await getAllDrugs({ category: drugData.category });
          const others = (allRes.data?.content || allRes.data || [])
            .filter(d => String(d.id) !== String(id))
            .slice(0, 3);
          setRelatedDrugs(others);
        } catch (_) { /* related drugs optional */ }
      } catch (err) {
        setError(err.message || 'Không tìm thấy thông tin thuốc');
      } finally {
        setLoading(false);
      }
    };
    fetchDrug();
  }, [id]);

  const handleAddToCart = () => {
    if (!drug) return;
    dispatch(addToCart(drug));
    toast.success(`Đã thêm ${drug.name} vào giỏ hàng`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: drug.name, url: window.location.href });
    } catch (_) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép đường dẫn!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-12 space-y-8 animate-in fade-in">
        <Skeleton shape="text" className="h-6 w-24" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton shape="image" className="h-96" />
          <div className="space-y-6">
            <Skeleton shape="text" className="h-10 w-3/4" />
            <Skeleton shape="text" className="h-6 w-1/2" />
            <Skeleton shape="text" className="h-20" />
            <Skeleton shape="text" className="h-12 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !drug) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-20 text-center space-y-4">
        <h2 className="text-h3 font-semibold text-text-primary">Đã xảy ra lỗi</h2>
        <p className="text-sm text-text-secondary">{error || 'Không tìm thấy dược phẩm này.'}</p>
        <Link to="/search">
          <Button variant="outline" size="sm">Quay lại tìm kiếm</Button>
        </Link>
      </div>
    );
  }

  const colors = CATEGORY_COLORS[drug.category] || { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-primary/20' };
  const rating = MOCK_RATINGS[drug.id] || { score: 4.7, count: 500 };
  const sold = MOCK_SOLD[drug.id] || 2500;
  const isBestSeller = sold > 10000;

  return (
    <PageTransition className="pt-14 pb-12 bg-bg min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ChevronLeft size={18} />
          Quay lại danh mục
        </button>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ─── Left Column ─── */}
          <div className="lg:col-span-5 space-y-4">

            {/* Product Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`relative bg-surface border border-border rounded-2xl p-8 w-full aspect-square flex items-center justify-center shadow-card overflow-hidden group`}
            >
              {/* Best Seller ribbon */}
              {isBestSeller && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/15 border border-amber-400/20 rounded-full text-amber-600 text-xs font-bold">
                  <TrendingUp size={12} />
                  Bán chạy
                </div>
              )}

              {/* Wishlist + Share */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => { setWishlisted(w => !w); toast(wishlisted ? 'Đã xoá khỏi yêu thích' : 'Đã thêm vào yêu thích'); }}
                  className="w-9 h-9 rounded-full bg-bg border border-border flex items-center justify-center hover:border-rose-400 transition-all"
                >
                  <Heart size={16} className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-text-secondary'} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-bg border border-border flex items-center justify-center hover:border-primary transition-all"
                >
                  <Share2 size={16} className="text-text-secondary" />
                </button>
              </div>

              {/* Drug Image or Icon Fallback */}
              {drug.image && !imgError ? (
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={drug.image}
                  alt={drug.name}
                  onError={() => setImgError(true)}
                  className="max-w-[75%] max-h-[75%] object-contain"
                />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className={`w-36 h-36 lg:w-48 lg:h-48 rounded-full ${colors.bg} ring-8 ${colors.ring} flex items-center justify-center ${colors.icon}`}
                >
                  <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                    <path d="m8.5 8.5 7 7" />
                  </svg>
                </motion.div>
              )}

              {/* In stock badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                {drug.inStock ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-success/10 border border-success/20 text-success text-xs font-semibold rounded-full">
                    <Package size={11} /> Còn hàng
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-error/10 border border-error/20 text-error text-xs font-semibold rounded-full">
                    Hết hàng
                  </span>
                )}
              </div>
            </motion.div>

            {/* ── Drug Name below image ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="px-1"
            >
              <h1 className="text-xl lg:text-2xl font-bold text-text-primary leading-snug">
                {drug.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-mono text-text-secondary">
                <span>Hoạt chất: <span className="text-text-primary font-semibold">{drug.activeIngredient}</span></span>
                <span>•</span>
                <span>Hãng: <span className="text-text-primary font-semibold">{drug.manufacturer}</span></span>
              </div>
            </motion.div>

            {/* Delivery & Authenticity badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 bg-surface border border-border rounded-xl">
                <Truck size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-text-primary">Giao hàng nhanh</p>
                  <p className="text-[11px] text-text-secondary">2-4 giờ nội thành</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-surface border border-border rounded-xl">
                <ShieldCheck size={16} className="text-success shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-text-primary">Hàng chính hãng</p>
                  <p className="text-[11px] text-text-secondary">Có tem kiểm định</p>
                </div>
              </div>
            </div>

            {/* Related Drugs */}
            {relatedDrugs.length > 0 && (
              <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                  Có thể bạn cần
                </h3>
                <div className="space-y-2">
                  {relatedDrugs.map(rd => (
                    <RelatedDrugCard key={rd.id} drug={rd} navigate={navigate} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right Column ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 space-y-6 bg-surface border border-border rounded-2xl p-6 lg:p-8 shadow-card"
            style={{ marginTop: '100px' }}
          >
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="md">{drug.category}</Badge>
              {drug.requiresPrescription ? (
                <Badge variant="warning" size="md" className="flex items-center gap-1">
                  <FileText size={12} />
                  Cần kê đơn bác sĩ
                </Badge>
              ) : (
                <Badge variant="success" size="md" className="flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Không yêu cầu kê đơn
                </Badge>
              )}
              {isBestSeller && (
                <Badge variant="warning" size="md" className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  Bán chạy
                </Badge>
              )}
            </div>

            {/* Rating Row */}
            <div className="flex items-center gap-4 py-3 border-y border-border">
              <div className="flex items-center gap-2">
                <StarRating score={rating.score} />
                <span className="text-sm font-bold text-amber-500">{rating.score}</span>
                <span className="text-xs text-text-secondary">({rating.count.toLocaleString('vi-VN')} đánh giá)</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <ShoppingCart size={12} />
                <span><span className="font-semibold text-text-primary">{sold.toLocaleString('vi-VN')}</span> đã bán</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs text-text-secondary font-medium">Giá bán niêm yết</span>
                <p className="text-3xl font-bold text-primary font-mono">
                  {formatCurrency(drug.price)}
                </p>
                <p className="text-xs text-text-secondary">/ {drug.form} ({drug.dosage})</p>
              </div>
              <div className="hidden sm:flex flex-col gap-2 items-end">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  icon={<ShoppingCart size={18} />}
                  disabled={!drug.inStock}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-text-secondary leading-relaxed border-l-2 border-primary/30 pl-3">
              {drug.description}
            </p>

            {/* Tabs */}
            <div className="pt-2">
              <DrugTabs drug={drug} />
            </div>

          </motion.div>
        </div>
      </div>

      {/* Mobile Sticky Add-to-cart Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border p-4 shadow-modal flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-secondary uppercase font-bold">Tổng thanh toán</span>
          <span className="text-lg font-bold text-primary font-mono">
            {formatCurrency(drug.price)}
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleAddToCart}
          icon={<ShoppingCart size={16} />}
          disabled={!drug.inStock}
        >
          Thêm giỏ hàng
        </Button>
      </div>
    </PageTransition>
  );
}
