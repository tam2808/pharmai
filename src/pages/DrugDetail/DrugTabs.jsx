import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, BookOpen, Layers, Thermometer, Info } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * DrugTabs — Tabs thông tin chi tiết thuốc
 * 4 tab: Hướng dẫn sử dụng | Thành phần | Cảnh báo | Bảo quản & Hạn dùng
 */
export default function DrugTabs({ drug }) {
  const [activeTab, setActiveTab] = useState('usage');

  const tabs = [
    { id: 'usage',       label: 'Hướng dẫn',   icon: BookOpen },
    { id: 'ingredients', label: 'Thành phần',   icon: Layers },
    { id: 'warnings',    label: 'Cảnh báo',     icon: AlertTriangle },
    { id: 'storage',     label: 'Bảo quản',     icon: Thermometer },
  ];

  /** Thông tin bảo quản chuẩn theo dạng bào chế */
  const getStorageInfo = (drug) => {
    const form = (drug.form || '').toLowerCase();
    if (form.includes('nhỏ mắt') || form.includes('dung dịch'))
      return { temp: 'Nhiệt độ phòng (dưới 25°C)', light: 'Tránh ánh sáng trực tiếp', humidity: 'Nơi khô thoáng', special: 'Sau khi mở: dùng trong vòng 28 ngày. Không để vào tủ lạnh.' };
    if (form.includes('kem') || form.includes('gel'))
      return { temp: 'Nhiệt độ phòng (dưới 30°C)', light: 'Tránh ánh sáng', humidity: 'Nơi khô, không ẩm', special: 'Đậy kín sau khi dùng. Không để gần nguồn nhiệt.' };
    if (form.includes('sủi') || form.includes('gói bột'))
      return { temp: 'Dưới 25°C', light: 'Tránh ánh sáng', humidity: 'Nơi khô ráo, thoáng mát', special: 'Pha ngay trước khi uống. Không dùng dung dịch đã pha quá 30 phút.' };
    if (form.includes('nang mềm'))
      return { temp: 'Dưới 25°C, tránh tủ lạnh', light: 'Tránh ánh sáng mặt trời', humidity: 'Nơi khô ráo', special: 'Tránh nhiệt độ cao làm chảy vỏ nang. Không đặt trong xe hơi dưới nắng.' };
    return { temp: 'Nhiệt độ phòng (15–30°C)', light: 'Tránh ánh sáng trực tiếp', humidity: 'Nơi khô ráo, thoáng mát', special: 'Hạn dùng: Xem trên hộp/vỉ thuốc. Bảo quản tránh xa tầm tay trẻ em.' };
  };

  const storage = getStorageInfo(drug);

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex border-b border-border gap-0.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-all duration-200 border-b-2 whitespace-nowrap',
                isActive
                  ? 'text-primary border-primary'
                  : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-bg'
              )}
            >
              <tab.icon size={14} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[160px]">
        <AnimatePresence mode="wait">

          {/* ── Hướng dẫn sử dụng ── */}
          {activeTab === 'usage' && (
            <motion.div
              key="usage"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="p-4 bg-bg border border-border rounded-xl">
                <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen size={13} className="text-primary" />
                  Chỉ định & Cách dùng
                </h5>
                <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                  {drug.usageInstruction || drug.usage}
                </p>
              </div>
              <div className="p-4 bg-bg border border-border rounded-xl">
                <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Dạng bào chế</h5>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/8 border border-primary/15 text-primary text-xs font-semibold rounded-lg font-mono">
                  {drug.form} · {drug.dosage}
                </span>
              </div>
            </motion.div>
          )}

          {/* ── Thành phần ── */}
          {activeTab === 'ingredients' && (
            <motion.div
              key="ingredients"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="p-4 bg-bg border border-border rounded-xl">
                <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Hoạt chất chính</h5>
                <span className="inline-flex items-center px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-sm font-bold rounded-lg font-mono">
                  {drug.activeIngredient}
                </span>
              </div>
              <div className="p-4 bg-bg border border-border rounded-xl">
                <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Chi tiết thành phần & Tá dược</h5>
                <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                  {drug.ingredients}
                </p>
              </div>
              <div className="flex items-start gap-2 p-3 bg-bg border border-border rounded-xl text-xs text-text-secondary">
                <Info size={13} className="shrink-0 mt-0.5 text-primary" />
                <span>Nhà sản xuất: <span className="font-semibold text-text-primary">{drug.manufacturer}</span> · Số đăng ký: xem trên bao bì sản phẩm.</span>
              </div>
            </motion.div>
          )}

          {/* ── Cảnh báo ── */}
          {activeTab === 'warnings' && (
            <motion.div
              key="warnings"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="p-5 bg-warning/8 border border-warning/15 rounded-xl space-y-3 border-l-4 border-l-warning">
                <div className="flex items-center gap-2 text-warning font-semibold">
                  <AlertTriangle size={17} className="shrink-0" />
                  <h5 className="text-xs uppercase tracking-wider font-bold">Thông tin an toàn quan trọng</h5>
                </div>
                <p className="text-sm text-warning/90 leading-relaxed font-medium whitespace-pre-line">
                  {drug.warnings}
                </p>
              </div>
              {drug.requiresPrescription && (
                <div className="flex items-start gap-2 p-3 bg-error/8 border border-error/15 rounded-xl">
                  <AlertTriangle size={14} className="text-error shrink-0 mt-0.5" />
                  <p className="text-xs text-error font-medium">
                    Thuốc này bắt buộc phải có đơn bác sĩ. Không tự ý mua và sử dụng khi chưa được thăm khám.
                  </p>
                </div>
              )}
              <p className="text-[11px] text-text-secondary/70 italic px-1">
                * Đọc kỹ hướng dẫn sử dụng trước khi dùng. Nếu gặp bất kỳ tác dụng phụ nào, hãy ngừng thuốc và liên hệ nhân viên y tế ngay.
              </p>
            </motion.div>
          )}

          {/* ── Bảo quản & Hạn dùng ── */}
          {activeTab === 'storage' && (
            <motion.div
              key="storage"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: '🌡️ Nhiệt độ', value: storage.temp },
                  { label: '💡 Ánh sáng',  value: storage.light },
                  { label: '💧 Độ ẩm',     value: storage.humidity },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-bg border border-border rounded-xl text-center">
                    <p className="text-xs text-text-secondary mb-1">{item.label}</p>
                    <p className="text-xs font-semibold text-text-primary">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-bg border border-border rounded-xl">
                <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Thermometer size={13} className="text-primary" />
                  Lưu ý bảo quản đặc biệt
                </h5>
                <p className="text-sm text-text-secondary leading-relaxed">{storage.special}</p>
              </div>
              <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                <Info size={13} className="shrink-0 mt-0.5 text-primary" />
                <p className="text-xs text-text-secondary">
                  Không sử dụng thuốc khi đã quá hạn dùng in trên bao bì. Bảo quản tránh xa tầm tay trẻ em.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
