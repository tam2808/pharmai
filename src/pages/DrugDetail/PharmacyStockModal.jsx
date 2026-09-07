import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Search, X, CheckCircle2, Clock, Navigation } from 'lucide-react';
import Button from '../../components/ui/Button';

const MOCK_PHARMACIES = [
  {
    id: 1,
    name: 'PharmAI - 128 Nguyễn Trãi, Q.5, TP.HCM',
    distance: '0.8 km',
    address: '128 Nguyễn Trãi, Phường 3, Quận 5, TP. Hồ Chí Minh',
    phone: '028 3838 9999',
    status: 'Còn hàng',
    stockCount: 15,
    hours: '06:00 - 22:30',
  },
  {
    id: 2,
    name: 'PharmAI - 450 Hai Bà Trưng, Q.1, TP.HCM',
    distance: '2.3 km',
    address: '450 Hai Bà Trưng, Phường Tân Định, Quận 1, TP. Hồ Chí Minh',
    phone: '028 3822 5555',
    status: 'Còn hàng',
    stockCount: 8,
    hours: '24/7 (Mở cả đêm)',
  },
  {
    id: 3,
    name: 'PharmAI - 89 Lý Thường Kiệt, Q.10, TP.HCM',
    distance: '3.5 km',
    address: '89 Lý Thường Kiệt, Phường 7, Quận 10, TP. Hồ Chí Minh',
    phone: '028 3866 1234',
    status: 'Còn hàng',
    stockCount: 22,
    hours: '06:00 - 22:00',
  },
  {
    id: 4,
    name: 'PharmAI - 15 Cầu Giấy, HĐ, Hà Nội',
    distance: '1,200 km',
    address: '15 Đường Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội',
    phone: '024 3766 8888',
    status: 'Còn hàng',
    stockCount: 12,
    hours: '06:30 - 22:00',
  },
];

export default function PharmacyStockModal({ isOpen, onClose, drugName }) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  if (!isOpen) return null;

  const filteredPharmacies = MOCK_PHARMACIES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    if (selectedCity === 'hcm') return matchesSearch && p.address.includes('TP. Hồ Chí Minh');
    if (selectedCity === 'hn') return matchesSearch && p.address.includes('Hà Nội');
    return matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-border bg-gradient-to-r from-sky-50 to-emerald-50 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <MapPin size={15} />
                Hệ thống nhà thuốc PharmAI
              </div>
              <h3 className="text-lg font-extrabold text-text-primary mt-1">
                Nhà thuốc còn hàng sản phẩm
              </h3>
              <p className="text-xs text-text-secondary line-clamp-1 font-medium mt-0.5">
                {drugName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search & Filter bar */}
          <div className="p-4 border-b border-border/70 bg-surface-muted flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Tìm theo quận, tên đường..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCity('all')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  selectedCity === 'all'
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-white text-text-secondary border-border hover:bg-slate-50'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedCity('hcm')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  selectedCity === 'hcm'
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-white text-text-secondary border-border hover:bg-slate-50'
                }`}
              >
                TP.HCM
              </button>
              <button
                onClick={() => setSelectedCity('hn')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  selectedCity === 'hn'
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-white text-text-secondary border-border hover:bg-slate-50'
                }`}
              >
                Hà Nội
              </button>
            </div>
          </div>

          {/* List of pharmacies */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredPharmacies.length > 0 ? (
              filteredPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="p-4 rounded-xl border border-border/80 hover:border-primary/40 bg-white hover:bg-sky-50/30 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                        {pharmacy.name}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          {pharmacy.status} ({pharmacy.stockCount})
                        </span>
                      </h4>
                      <p className="text-xs text-text-secondary mt-1 flex items-center gap-1.5">
                        <MapPin size={13} className="shrink-0 text-text-muted" />
                        {pharmacy.address}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary bg-sky-50 px-2.5 py-1 rounded-lg shrink-0">
                      {pharmacy.distance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {pharmacy.hours}
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${pharmacy.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        <Phone size={12} />
                        {pharmacy.phone}
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(pharmacy.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
                      >
                        <Navigation size={12} />
                        Chỉ đường
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-text-muted text-xs">
                Không tìm thấy nhà thuốc phù hợp với tìm kiếm của bạn.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-surface-muted flex items-center justify-between text-xs text-text-secondary">
            <span>Tổng đài miễn phí: <strong className="text-primary font-bold">1800 6928</strong></span>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
