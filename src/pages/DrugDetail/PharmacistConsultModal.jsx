import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, X, User, Phone, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';

export default function PharmacistConsultModal({ isOpen, onClose, drugName }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }
    setSubmitted(true);
    toast.success('Đã gửi yêu cầu tư vấn thành công!');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-border bg-gradient-to-r from-emerald-50 to-sky-50 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck size={16} />
                Tư vấn Chuyên môn 24/7
              </div>
              <h3 className="text-lg font-extrabold text-text-primary mt-1">
                Nhận tư vấn từ Dược sĩ PharmAI
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Dược sĩ đại học sẽ gọi lại miễn phí trong 5 phút
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/5 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={36} />
              </div>
              <h4 className="font-extrabold text-lg text-text-primary">Đã gửi yêu cầu thành công!</h4>
              <p className="text-xs text-text-secondary max-w-xs mx-auto">
                Dược sĩ của PharmAI đang chuẩn bị hồ sơ sản phẩm <strong>{drugName}</strong> và sẽ liên hệ ngay cho bạn.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 font-medium">
                Sản phẩm đang quan tâm: <strong className="text-primary">{drugName}</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Số điện thoại gọi lại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Câu hỏi / Câu chuyện sức khỏe (Tùy chọn)
                </label>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-3 top-3 text-text-muted" />
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Thuốc này uống trước hay sau ăn? Tôi đang dùng thuốc huyết áp có uống được không?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                  <PhoneCall size={14} />
                  Gửi yêu cầu Dược sĩ gọi lại
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
