import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { getAllDrugsAdmin, createDrug, updateDrug, deleteDrug } from '../../services/adminApi';
import { formatCurrency } from '../../utils/helpers';

const EMPTY_DRUG = {
  name: '',
  activeIngredient: '',
  dosage: '',
  form: '',
  category: '',
  price: '',
  manufacturer: '',
  description: '',
  usageInstruction: '',
  ingredients: '',
  warnings: '',
  requiresPrescription: false,
  inStock: true,
  image: '',
};

const FORM_FIELDS = [
  { key: 'name', label: 'Tên thuốc *', required: true, span: 2 },
  { key: 'activeIngredient', label: 'Hoạt chất', span: 2 },
  { key: 'dosage', label: 'Hàm lượng' },
  { key: 'form', label: 'Dạng bào chế' },
  { key: 'category', label: 'Danh mục' },
  { key: 'price', label: 'Giá (VNĐ)', type: 'number' },
  { key: 'manufacturer', label: 'Nhà sản xuất', span: 2 },
  { key: 'description', label: 'Mô tả', textarea: true, span: 2 },
  { key: 'usageInstruction', label: 'Hướng dẫn sử dụng', textarea: true, span: 2 },
  { key: 'warnings', label: 'Cảnh báo', textarea: true, span: 2 },
];

const PAGE_SIZE = 10;

export default function ManageDrugs() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_DRUG);
  const [saving, setSaving] = useState(false);

  const fetchDrugs = async () => {
    try {
      const res = await getAllDrugsAdmin();
      setDrugs(res.data || []);
    } catch {
      toast.error('Không thể tải danh sách thuốc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrugs(); }, []);

  const filtered = drugs.filter((d) =>
    !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.category?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => { setForm(EMPTY_DRUG); setModal('add'); };
  const openEdit = (drug) => { setSelected(drug); setForm({ ...drug, price: drug.price?.toString() || '' }); setModal('edit'); };
  const openDelete = (drug) => { setSelected(drug); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.name?.trim()) { toast.error('Vui lòng nhập tên thuốc'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) || 0 };
      if (modal === 'add') {
        await createDrug(payload);
        toast.success('Thêm thuốc mới thành công!');
      } else {
        await updateDrug(selected.id, payload);
        toast.success('Cập nhật thông tin thuốc thành công!');
      }
      closeModal();
      fetchDrugs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteDrug(selected.id);
      toast.success('Đã xoá thuốc thành công');
      closeModal();
      fetchDrugs();
    } catch {
      toast.error('Không thể xoá thuốc này');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary font-display tracking-tight">Quản lý thuốc</h1>
          <p className="text-text-secondary text-sm mt-1.5">{drugs.length} sản phẩm trong hệ thống</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 gradient-primary text-white text-base font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={18} />
          Thêm thuốc mới
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Tìm kiếm theo tên, danh mục..."
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/60 transition-colors shadow-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              {['Tên thuốc', 'Danh mục', 'Dạng', 'Giá', 'Kê đơn', 'Còn hàng', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-text-muted text-sm">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            ) : (
              paged.map((drug, i) => (
                <motion.tr
                  key={drug.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-text-primary font-semibold text-sm">{drug.name}</p>
                      <p className="text-text-muted text-xs font-mono mt-0.5">{drug.activeIngredient}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-text-secondary font-medium">{drug.category}</td>
                  <td className="px-4 py-4 text-text-secondary">{drug.form}</td>
                  <td className="px-4 py-4 text-primary font-mono font-bold text-sm">
                    {formatCurrency(drug.price)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${drug.requiresPrescription ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                      {drug.requiresPrescription ? 'Kê đơn' : 'Không'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${drug.inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                      {drug.inStock ? 'Còn' : 'Hết'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => openEdit(drug)}
                        className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-light transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => openDelete(drug)}
                        className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50/30">
            <p className="text-text-secondary text-xs">
              Trang {page} / {totalPages} · {filtered.length} kết quả
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary disabled:opacity-30 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary disabled:opacity-30 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(modal === 'add' || modal === 'edit') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface z-10">
                <h2 className="text-text-primary font-bold text-lg font-display">
                  {modal === 'add' ? 'Thêm thuốc mới' : 'Chỉnh sửa thông tin thuốc'}
                </h2>
                <button onClick={closeModal} className="text-text-secondary hover:text-text-primary transition-colors p-1.5 hover:bg-bg rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4">
                {FORM_FIELDS.map(({ key, label, type, textarea, span, required }) => (
                  <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                    <label className="block text-xs text-text-primary font-bold mb-1.5">{label}</label>
                    {textarea ? (
                      <textarea
                        rows={3}
                        value={form[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm outline-none focus:border-primary/60 transition-colors resize-none placeholder:text-text-muted/60"
                        placeholder={label}
                      />
                    ) : (
                      <input
                        type={type || 'text'}
                        value={form[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        required={required}
                        className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-text-muted/60"
                        placeholder={label}
                      />
                    )}
                  </div>
                ))}

                {/* Checkboxes */}
                <div className="col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!form.requiresPrescription}
                      onChange={(e) => handleChange('requiresPrescription', e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span className="text-sm text-text-secondary font-medium">Cần kê đơn bác sĩ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!form.inStock}
                      onChange={(e) => handleChange('inStock', e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span className="text-sm text-text-secondary font-medium">Còn hàng</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
                >
                  Huỷ bỏ
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold gradient-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  {modal === 'add' ? 'Thêm thuốc' : 'Lưu thay đổi'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirm Modal */}
        {modal === 'delete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-surface border border-red-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h2 className="text-text-primary font-bold text-center text-lg mb-2">Xác nhận xoá thuốc</h2>
              <p className="text-text-secondary text-sm text-center mb-6">
                Bạn có chắc muốn xoá <span className="text-text-primary font-bold">{selected?.name}</span>?<br />
                Thao tác này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-bg border border-border transition-colors"
                >
                  Huỷ bỏ
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  Xoá thuốc
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
