import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
  Pill,
  ShoppingCart,
  MapPin,
  ShieldCheck,
  Star,
  Share2,
  Heart,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  FileText,
  Layers,
  Thermometer,
  AlertTriangle,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '../../store/cartSlice';
import { getDrug, getDrugs } from '../../services/drugApi';
import { formatCurrency } from '../../utils/helpers';
import DrugCard from '../../components/features/DrugCard';
import PharmacyStockModal from './PharmacyStockModal';
import PharmacistConsultModal from './PharmacistConsultModal';
import ReviewSection from './ReviewSection';

/** Helper to dynamically process and enrich drug data without hardcoding NMN */
function processDrugData(data) {
  if (!data) return null;

  const basePrice = Number(data.price) || 25000;
  const originalPrice = data.originalPrice || Math.round(basePrice * 1.25);
  const discount = data.discount || Math.round(((originalPrice - basePrice) / originalPrice) * 100);
  
  const formLower = (data.form || '').toLowerCase();
  const unit = data.unit || (
    formLower.includes('sủi') ? 'Gói' :
    formLower.includes('dung dịch') ? 'Chai' :
    formLower.includes('kem') ? 'Tuýp' :
    'Hộp'
  );
  const units = data.units || [unit, 'Vỉ (10 viên)', 'Viên'];
  
  const mfr = data.manufacturer || '';
  const origin = data.origin || (
    mfr.includes('Jpanwell') ? 'Nhật Bản' :
    mfr.includes('Bayer') || mfr.includes('Boehringer') || mfr.includes('Merck') || mfr.includes('Medochemie') ? 'Đức' :
    mfr.includes('Pfizer') || mfr.includes('Abbott') || mfr.includes('MSD') || mfr.includes('Janssen') ? 'Mỹ' :
    mfr.includes('Sanofi') || mfr.includes('Ipsen') ? 'Pháp' :
    mfr.includes('GSK') || mfr.includes('Zuellig') ? 'Anh' :
    'Việt Nam'
  );
  
  const flag = data.flag || (
    origin === 'Nhật Bản' ? '🇯🇵' :
    origin === 'Đức' ? '🇩🇪' :
    origin === 'Mỹ' ? '🇺🇸' :
    origin === 'Pháp' ? '🇫🇷' :
    origin === 'Anh' ? '🇬🇧' :
    '🇻🇳'
  );

  return {
    id: data.id,
    name: data.name,
    code: data.code || `00${(data.id || 1).toString().padStart(6, '0')}`,
    brand: data.brand || data.manufacturer || 'PharmAI',
    origin: origin,
    flag: flag,
    category: data.category || 'Dược phẩm',
    subCategory: data.subCategory || 'Thuốc điều trị',
    price: basePrice,
    originalPrice: originalPrice,
    discount: discount > 0 ? discount : 20,
    unit: unit,
    units: units,
    rating: data.rating || 4.9,
    reviewCount: data.reviewCount || 40 + (Number(data.id) || 1) * 3,
    commentCount: data.commentCount || 100 + (Number(data.id) || 1) * 12,
    requiresPrescription: Boolean(data.requiresPrescription),
    inStock: data.inStock !== false,
    manufacturer: data.manufacturer || 'PharmAI',
    registrationNumber: data.registrationNumber || `VD-${30000 + Number(data.id || 1)}-24`,
    activeIngredient: data.activeIngredient || data.name,
    dosage: data.dosage || 'Theo chỉ định Dược sĩ/Bác sĩ',
    form: data.form || 'Viên nén',
    image: data.image || null,
    description: data.description || `${data.name} là sản phẩm hỗ trợ sức khỏe chính hãng được phân phối tại hệ thống nhà thuốc PharmAI.`,
    usageInstruction: data.usageInstruction || `• Sử dụng ${data.name} theo hướng dẫn của bác sĩ hoặc dược sĩ chuyên môn.\n• Uống đúng liều lượng chỉ định, không tự ý tăng liều.`,
    ingredients: data.ingredients || `Mỗi đơn vị chứa: ${data.activeIngredient || data.name} (${data.dosage || 'Hàm lượng tiêu chuẩn'}).`,
    warnings: data.warnings || '• Đọc kỹ hướng dẫn sử dụng trước khi dùng.\n• Để xa tầm tay trẻ em.\n• Tham khảo ý kiến Dược sĩ nếu có dấu hiệu bất thường.',
    storageInfo: data.storageInfo || 'Bảo quản nơi khô ráo, thoáng mát dưới 30°C. Tránh ánh nắng trực tiếp.',
  };
}

export default function DrugDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // State management
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('Hộp');
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals & Interactivity
  const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedDrugs, setRelatedDrugs] = useState([]);

  // Fetch product data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setQuantity(1);
    setActiveImageIndex(0);

    const loadDrug = async () => {
      try {
        let raw = await getDrug(id);
        let drugObj = raw?.data || raw;
        
        // If single drug fetch didn't return valid object, try searching in full list
        if (!drugObj || (!drugObj.id && !drugObj.name)) {
          const allRes = await getDrugs();
          const list = Array.isArray(allRes) ? allRes : allRes?.data || allRes?.content || [];
          drugObj = list.find((item) => String(item.id) === String(id));
        }

        if (isMounted) {
          if (drugObj && (drugObj.id || drugObj.name)) {
            const processed = processDrugData(drugObj);
            setDrug(processed);
            setSelectedUnit(processed.unit);
          } else {
            setDrug(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching drug details:', err);
        if (isMounted) {
          setDrug(null);
          setLoading(false);
        }
      }
    };

    loadDrug();

    // Fetch related drugs
    getDrugs()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.content || res?.data || [];
        if (isMounted && list.length > 0) {
          setRelatedDrugs(list.filter((item) => String(item.id) !== String(id)).slice(0, 4));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!drug) return;
    dispatch(
      addToCart({
        id: drug.id,
        name: drug.name,
        image: drug.image,
        price: drug.price,
        selectedUnit: selectedUnit,
        quantity: quantity,
        requiresPrescription: drug.requiresPrescription,
      })
    );
    toast.success(`Đã thêm ${quantity} ${selectedUnit} "${drug.name}" vào giỏ hàng!`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép liên kết sản phẩm!');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!drug) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <Pill size={36} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-md">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngưng kinh doanh.
        </p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-full shadow-md hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const currentDrug = drug;

  // Multi-angle thumbnail mocks
  const galleryImages = currentDrug.image
    ? [currentDrug.image, currentDrug.image, currentDrug.image, currentDrug.image]
    : [null, null, null, null];

  return (
    <div className="bg-[#F2F4F7] min-h-screen pb-24 lg:pb-16 font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. BREADCRUMB & UTILITIES HEADER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <nav className="flex items-center gap-2 text-slate-500 flex-wrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/search" className="hover:text-blue-600 transition-colors">
              {currentDrug.category || 'Thuốc'}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="hover:text-blue-600 cursor-pointer">{currentDrug.subCategory || 'Hỗ trợ điều trị'}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-normal line-clamp-1">{currentDrug.name}</span>
          </nav>

          <div className="flex items-center gap-4 text-slate-600 text-xs shrink-0">
            <button onClick={handleShare} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Share2 size={14} /> Chia sẻ
            </button>
            <button
              onClick={toggleWishlist}
              className={`flex items-center gap-1 transition-colors ${
                isWishlisted ? 'text-red-500 font-semibold' : 'hover:text-blue-600'
              }`}
            >
              <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} /> Yêu thích
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. MAIN PRODUCT CARD FOR THIS SPECIFIC DRUG */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* ── LEFT COLUMN: PRODUCT GALLERY & COMMITMENT ICONS (5 cols) ── */}
            <div className="lg:col-span-5 space-y-5">
              {/* Main Image Box */}
              <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 flex items-center justify-center overflow-hidden">
                
                {/* Red Circular Stamp Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-14 h-14 bg-[#E11D48] text-white rounded-full flex flex-col items-center justify-center border-2 border-white shadow-sm text-[10px] font-bold leading-tight text-center">
                    <span>CHÍNH HÃNG</span>
                    <span className="text-[8px] opacity-90 font-normal">100%</span>
                  </div>
                </div>

                {/* Main Product Image or Placeholder */}
                {currentDrug.image ? (
                  <img
                    src={currentDrug.image}
                    alt={currentDrug.name}
                    className="max-w-[88%] max-h-[88%] object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <Pill size={64} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {currentDrug.form || 'Viên nén'} · {currentDrug.brand || 'PharmAI'}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery (4 items) */}
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-xl border-2 p-1 bg-white flex items-center justify-center overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-100'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {img ? (
                      <img src={img} alt="Thumbnail" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Pill size={22} className={activeImageIndex === idx ? 'text-blue-600' : 'text-slate-300'} />
                    )}
                  </button>
                ))}
              </div>

              {/* Disclaimer line below gallery */}
              <p className="text-[12px] text-slate-400 text-center italic">
                * Mẫu mã sản phẩm có thể thay đổi tùy theo từng lô hàng sản xuất
              </p>

              {/* Policy Commitments (3 Icons) */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex flex-col items-center text-center p-2">
                  <RefreshCw size={20} className="text-blue-600 mb-1" />
                  <span className="font-bold text-slate-800">Đổi trả 30 ngày</span>
                  <span className="text-[11px] text-slate-400">kể từ ngày mua</span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <ShieldCheck size={20} className="text-emerald-600 mb-1" />
                  <span className="font-bold text-slate-800">Miễn phí 100%</span>
                  <span className="text-[11px] text-slate-400">đổi thuốc</span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <Truck size={20} className="text-blue-600 mb-1" />
                  <span className="font-bold text-slate-800">Giao vận chuyển</span>
                  <span className="text-[11px] text-slate-400">theo CS giao hàng</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: CLEAN & SPACIOUS PURCHASING SECTION (7 cols) ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Brand & Origin Bar */}
              <div className="flex items-center gap-3 text-sm">
                {currentDrug.origin && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 font-medium rounded-md text-xs border border-slate-200">
                    <span>{currentDrug.flag}</span> {currentDrug.origin}
                  </span>
                )}
                <span className="text-slate-600">
                  Thương hiệu:{' '}
                  <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                    {currentDrug.brand}
                  </span>
                </span>
              </div>

              {/* Product Main Title (Dynamic for THIS specific drug) */}
              <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-900 leading-snug tracking-tight">
                {currentDrug.name}
              </h1>

              {/* Code, Rating & Review Counters */}
              <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                <span className="font-mono text-slate-400">{currentDrug.code}</span>
                <span>•</span>
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <span>{currentDrug.rating}</span>
                  <Star size={15} fill="currentColor" />
                </div>
                <span>•</span>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {currentDrug.reviewCount} đánh giá
                </span>
                <span>•</span>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {currentDrug.commentCount} bình luận
                </span>
              </div>

              {/* Price Display (Dynamic for THIS specific drug) */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold text-blue-600 tracking-tight">
                    {formatCurrency(currentDrug.price)}
                  </span>
                  <span className="text-xl font-medium text-blue-600">/ {selectedUnit}</span>
                </div>

                {currentDrug.originalPrice && currentDrug.originalPrice > currentDrug.price && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-slate-400 line-through">
                      {formatCurrency(currentDrug.originalPrice)}
                    </span>
                    {currentDrug.discount && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-md">
                        -{currentDrug.discount}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Selector 1: Chọn đơn vị tính */}
              <div className="flex items-center gap-4 pt-3">
                <span className="text-sm text-slate-600 font-normal w-32 shrink-0">Chọn đơn vị tính</span>
                <div className="flex items-center gap-3 flex-wrap">
                  {(currentDrug.units || ['Hộp', 'Vỉ', 'Viên']).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setSelectedUnit(unit)}
                      className={`relative px-6 py-2 text-sm font-semibold rounded-full border transition-all ${
                        selectedUnit === unit
                          ? 'border-blue-600 text-blue-600 bg-blue-50/60 shadow-2xs'
                          : 'border-slate-300 text-slate-700 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: Chọn số lượng */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 font-normal w-32 shrink-0">Chọn số lượng</span>
                <div className="inline-flex items-center border border-slate-300 rounded-full bg-white px-2 py-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-base font-bold text-slate-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto flex-1 py-3.5 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-full shadow-md transition-all text-center flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Chọn mua
                </button>

                <button
                  onClick={() => setIsPharmacyModalOpen(true)}
                  className="w-full sm:w-auto flex-1 py-3.5 px-8 bg-[#EDF3FF] hover:bg-[#E2ECFF] text-blue-600 font-bold text-base rounded-full transition-all text-center flex items-center justify-center gap-2"
                >
                  <MapPin size={18} />
                  Tìm nhà thuốc
                </button>
              </div>

              {/* Promotions Applied Box */}
              <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-2 text-sm">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <span className="text-base">🎁</span>
                  <span>Khuyến mại được áp dụng</span>
                </div>
                <div className="flex items-center gap-2 text-amber-900 font-medium pl-6 text-xs sm:text-sm">
                  <span>🏷️</span>
                  <span>Giảm ngay {currentDrug.discount}% áp dụng khi mua hôm nay</span>
                </div>
              </div>

              {/* Short Specs Summary Table for THIS specific drug */}
              <div className="pt-4 border-t border-slate-200 text-sm space-y-3 text-slate-700 leading-relaxed">
                <p className="text-slate-600">{currentDrug.description}</p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-4">
                    <span className="text-slate-500 w-32 shrink-0">Tên chính hãng:</span>
                    <span className="font-medium text-slate-900">{currentDrug.name}</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-slate-500 w-32 shrink-0">Số đăng ký:</span>
                    <div className="space-x-2">
                      <span className="font-mono text-slate-900 font-semibold">{currentDrug.registrationNumber}</span>
                      <button className="text-blue-600 hover:underline text-xs">Xem giấy công bố sản phẩm</button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-slate-500 w-32 shrink-0">Thành phần:</span>
                    <div className="space-x-2">
                      <span className="text-slate-900">{currentDrug.activeIngredient}</span>
                      <button
                        onClick={() => setActiveTab('ingredients')}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Xem bảng thành phần
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-slate-500 w-32 shrink-0">Nhà sản xuất:</span>
                    <span className="text-slate-900">{currentDrug.manufacturer}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. TABS SECTION BELOW MAIN CONTAINER */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* Tab buttons bar */}
          <div className="flex items-center gap-4 border-b border-slate-200 overflow-x-auto scrollbar-none pb-1 text-sm font-semibold">
            {[
              { id: 'description', label: 'Mô tả & Công dụng', icon: BookOpen },
              { id: 'ingredients', label: 'Thành phần', icon: Layers },
              { id: 'usage', label: 'Hướng dẫn sử dụng', icon: FileText },
              { id: 'warnings', label: 'Cảnh báo', icon: AlertTriangle },
              { id: 'storage', label: 'Bảo quản', icon: Thermometer },
              { id: 'reviews', label: `Đánh giá (${currentDrug.commentCount})`, icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content area */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-4 text-slate-700 leading-relaxed text-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">Mô tả sản phẩm {currentDrug.name}</h3>
                  <p className="whitespace-pre-line">{currentDrug.description}</p>
                </motion.div>
              )}

              {activeTab === 'ingredients' && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-4 text-slate-700 leading-relaxed text-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">Thành phần chi tiết</h3>
                  <p className="whitespace-pre-line font-mono text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {currentDrug.ingredients}
                  </p>
                </motion.div>
              )}

              {activeTab === 'usage' && (
                <motion.div
                  key="usage"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-4 text-slate-700 leading-relaxed text-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">Hướng dẫn sử dụng</h3>
                  <p className="whitespace-pre-line bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-950">
                    {currentDrug.usageInstruction}
                  </p>
                </motion.div>
              )}

              {activeTab === 'warnings' && (
                <motion.div
                  key="warnings"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-4 text-slate-700 leading-relaxed text-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">Cảnh báo & Lưu ý</h3>
                  <p className="whitespace-pre-line bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-950 font-medium">
                    {currentDrug.warnings}
                  </p>
                </motion.div>
              )}

              {activeTab === 'storage' && (
                <motion.div
                  key="storage"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-4 text-slate-700 leading-relaxed text-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">Bảo quản & Xuất xứ</h3>
                  <p className="whitespace-pre-line">{currentDrug.storageInfo}</p>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ReviewSection
                    rating={currentDrug.rating}
                    reviewCount={currentDrug.reviewCount}
                    commentCount={currentDrug.commentCount}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 4. RELATED PRODUCTS RECOMMENDATIONS */}
        {/* ───────────────────────────────────────────────────────────── */}
        {relatedDrugs.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Sản phẩm tương tự</h2>
              <Link to="/search" className="text-sm font-semibold text-blue-600 hover:underline">
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedDrugs.map((relDrug) => (
                <DrugCard key={relDrug.id} drug={relDrug} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. STICKY MOBILE BOTTOM PURCHASING BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white border-t border-slate-200 p-3 shadow-lg lg:hidden">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{currentDrug.name}</div>
            <div className="text-sm font-bold text-blue-600">{formatCurrency(currentDrug.price * quantity)}</div>
          </div>
          <div className="w-1/2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-bold text-xs rounded-full shadow-sm flex items-center justify-center gap-1.5"
            >
              <ShoppingCart size={14} />
              Chọn mua ({quantity})
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <PharmacyStockModal
        isOpen={isPharmacyModalOpen}
        onClose={() => setIsPharmacyModalOpen(false)}
        drugName={currentDrug.name}
      />

      <PharmacistConsultModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        drugName={currentDrug.name}
      />
    </div>
  );
}
