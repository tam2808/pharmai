import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, CheckCircle2, User, MessageSquare, Plus, ShieldCheck, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';

const MOCK_REVIEWS = [
  {
    id: 1,
    author: 'Trần Nguyễn Hoàng Anh',
    rating: 5,
    date: '14/08/2026',
    verified: true,
    content: 'Sản phẩm mua ở PharmAI rất yên tâm. Uống được 2 tuần cảm thấy da dẻ tươi tắn hơn hẳn, ngủ ngon và bớt mệt mỏi vào buổi chiều. Giao hàng siêu nhanh chỉ trong 2 tiếng.',
    likes: 12,
    pharmacistReply: 'Dược sĩ PharmAI chào anh Hoàng Anh ạ! NMN Premium giúp hỗ trợ chống lão hóa và phục hồi năng lượng tế bào rất hiệu quả. Anh duy trì uống đủ liệu trình 2-3 tháng để có kết quả tốt nhất nhé!',
  },
  {
    id: 2,
    author: 'Lê Minh Thu',
    rating: 5,
    date: '10/08/2026',
    verified: true,
    content: 'Đã check mã vạch chuẩn chính hãng Nhật Bản. Hộp đóng gói kỹ lưỡng có tem niêm phong đầy đủ. Giá tốt hơn mua xách tay lại được tích điểm đổi voucher.',
    likes: 8,
    pharmacistReply: 'Chào chị Thu! Cảm ơn chị đã luôn tin tưởng mua sắm tại PharmAI. Nếu cần hỗ trợ thêm thông tin bảo quản chị nhắn Dược sĩ ngay nhé!',
  },
  {
    id: 3,
    author: 'Phạm Vũ Bảo',
    rating: 4,
    date: '02/08/2026',
    verified: true,
    content: 'Hàng chuẩn chính hãng, date mới tinh. Dùng thấy tốt nhưng giá hơi cao chút, mong shop có thêm nhiều chương trình khuyến mãi đợt tới.',
    likes: 5,
  },
];

export default function ReviewSection({ rating = 4.9, reviewCount = 55, commentCount = 481 }) {
  const [filterRating, setFilterRating] = useState('all');
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [showFormModal, setShowFormModal] = useState(false);
  const [likedIds, setLikedIds] = useState([]);

  // Form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');

  const handleLike = (id) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter((item) => item !== id));
      setReviewsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: r.likes - 1 } : r))
      );
    } else {
      setLikedIds([...likedIds, id]);
      setReviewsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
      );
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) {
      toast.error('Vui lòng điền đầy đủ họ tên và nội dung đánh giá');
      return;
    }

    const reviewObj = {
      id: Date.now(),
      author: newAuthor,
      rating: newRating,
      date: 'Hôm nay',
      verified: true,
      content: newContent,
      likes: 0,
    };

    setReviewsList([reviewObj, ...reviewsList]);
    toast.success('Cảm ơn bạn đã gửi đánh giá! Đánh giá đã được đăng.');
    setNewAuthor('');
    setNewContent('');
    setNewRating(5);
    setShowFormModal(false);
  };

  const filteredReviews = reviewsList.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === Number(filterRating);
  });

  return (
    <div className="space-y-6">
      {/* Rating overview card */}
      <div className="p-6 bg-white border border-border/80 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left score */}
        <div className="text-center md:border-r md:border-border/60 pr-4">
          <div className="text-4xl font-extrabold text-primary tracking-tight">
            {rating} <span className="text-lg font-normal text-text-muted">/ 5</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-amber-400 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={18} fill="currentColor" />
            ))}
          </div>
          <p className="text-xs text-text-secondary font-medium">
            Dựa trên <strong>{reviewCount}</strong> đánh giá & <strong>{commentCount}</strong> bình luận
          </p>
        </div>

        {/* Middle star breakdown */}
        <div className="space-y-1.5 text-xs text-text-secondary">
          {[
            { stars: 5, pct: 90, count: 50 },
            { stars: 4, pct: 7, count: 4 },
            { stars: 3, pct: 3, count: 1 },
            { stars: 2, pct: 0, count: 0 },
            { stars: 1, pct: 0, count: 0 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-2">
              <span className="w-10 font-bold text-text-primary flex items-center gap-0.5">
                {bar.stars} <Star size={10} className="fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[11px]">{bar.count}</span>
            </div>
          ))}
        </div>

        {/* Right CTA */}
        <div className="flex flex-col items-center justify-center text-center pl-0 md:pl-4 space-y-3">
          <p className="text-xs text-text-secondary">
            Bạn đã dùng sản phẩm này? Hãy chia sẻ cảm nhận với PharmAI nhé!
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowFormModal(true)}
            className="gap-1.5 shadow-sm"
          >
            <Plus size={14} />
            Viết đánh giá sản phẩm
          </Button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Tất cả đánh giá' },
          { id: '5', label: '5 Sao (50)' },
          { id: '4', label: '4 Sao (4)' },
          { id: '3', label: '3 Sao (1)' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterRating(btn.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap ${
              filterRating === btn.id
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-white text-text-secondary border-border hover:bg-slate-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="p-5 bg-white border border-border/70 rounded-2xl shadow-xs space-y-3"
          >
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-sky-200 text-primary font-bold flex items-center justify-center text-xs shadow-xs">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-text-primary">{review.author}</h5>
                    {review.verified && (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                        <CheckCircle2 size={9} />
                        Đã mua hàng
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          className={i < review.rating ? 'text-amber-400' : 'text-slate-300'}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-text-muted">{review.date}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLike(review.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  likedIds.includes(review.id)
                    ? 'bg-sky-50 text-primary border-primary/30'
                    : 'bg-slate-50 text-text-muted border-border hover:bg-slate-100'
                }`}
              >
                <ThumbsUp size={12} />
                <span>Hữu ích ({review.likes})</span>
              </button>
            </div>

            {/* Content */}
            <p className="text-xs text-text-secondary leading-relaxed pl-12">
              {review.content}
            </p>

            {/* Pharmacist Reply */}
            {review.pharmacistReply && (
              <div className="ml-12 p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <ShieldCheck size={14} />
                  Phản hồi từ Dược sĩ PharmAI
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {review.pharmacistReply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Write review modal */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-lg overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-base text-text-primary flex items-center gap-2">
                  <Star className="text-amber-400 fill-amber-400" size={18} />
                  Viết đánh giá sản phẩm
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-text-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Đánh giá của bạn
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={24}
                          fill={star <= newRating ? 'currentColor' : 'none'}
                          className={star <= newRating ? 'text-amber-400' : 'text-slate-300'}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-text-primary ml-2">
                      {newRating} trên 5 sao
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên của bạn"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Nội dung nhận xét
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hãy chia sẻ cảm nhận của bạn về chất lượng sản phẩm, hiệu quả sử dụng, bao bì..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowFormModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Gửi đánh giá
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
