import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, TrackResource } from '../../types';
import { store } from '../../services/store';
import {
  FileText,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  FolderOpen,
  Sparkles,
  Search,
  X,
  FileCode,
  BookOpen,
  Presentation,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResourcesViewProps {
  currentUser: UserProfile;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ currentUser }) => {
  const [resources, setResources] = useState<TrackResource[]>(() => store.getResources());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isLeader = currentUser.role === 'track_leader' || currentUser.role === 'supervisor';

  // نافذة إضافة ملف للقادة
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'guide' | 'cheatsheet' | 'slides' | 'book' | 'code'>('guide');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'zip' | 'code' | 'doc' | 'link'>('pdf');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) return;

    setIsSubmitting(true);
    store.addResource({
      title: title.trim(),
      description: description.trim() || 'ملف إثرائي معتمد لمسار الويب',
      category,
      fileUrl: fileUrl.trim(),
      fileType,
      fileSize: fileSize.trim() || '1.0 MB',
      uploadedBy: currentUser.fullName,
    });

    setResources(store.getResources());

    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    setSuccessMsg('تمت إضافة الملف بنجاح وإتاحته لجميع الأعضاء! ✨');
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setSuccessMsg('');
      setTitle('');
      setDescription('');
      setFileUrl('');
    }, 1200);
  };

  const handleDelete = (id: string, fileTitle: string) => {
    if (confirm(`هل أنت متأكد من حذف الملف «${fileTitle}»؟`)) {
      store.deleteResource(id);
      setResources(store.getResources());
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'guide':
        return <BookOpen size={20} className="text-blue-600" />;
      case 'cheatsheet':
        return <FileCode size={20} className="text-emerald-600" />;
      case 'slides':
        return <Presentation size={20} className="text-amber-600" />;
      default:
        return <FileText size={20} className="text-gray-600" />;
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'guide':
        return 'دليل تعلّم 📖';
      case 'cheatsheet':
        return 'مرجع أكواد 💻';
      case 'slides':
        return 'سلايدات ورشة 📽️';
      case 'book':
        return 'كتاب برمجي 📚';
      default:
        return 'ملف إثرائي 📄';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-8 sm:py-12 text-right"
      dir="rtl"
    >
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] animate-pulse" />
            <span className="text-xs font-bold text-gray-500">
              مسار تصميم وتطوير الويب · مكتبة المراجع والملفات
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            ملفات المسار والمكتبة الإثرائية 📚
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
            سلايدات الورش، أدلة التعلم، والمراجع البرمجية المعتمدة — متاحة للعرض والتحميل المباشر للأعضاء.
          </p>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-pill px-6 py-2.5 text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 transition-all cursor-pointer shadow-md inline-flex items-center gap-2 border-none"
          >
            <Plus size={16} />
            <span>+ إضافة ملف إثرائي جديد</span>
          </button>
        )}
      </div>

      {/* شريط البحث وتصفية التصنيفات */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        {/* أزرار التصنيف */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'guide', label: 'أدلة التعلم 📖' },
            { id: 'cheatsheet', label: 'مراجع الأكواد 💻' },
            { id: 'slides', label: 'سلايدات الورش 📽️' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border-2 ${
                selectedCategory === c.id
                  ? 'bg-[#0F1729] text-white border-[#0F1729] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* حقل البحث */}
        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن ملف أو مرجع..."
            className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm rounded-2xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* شبكة بطاقات الملفات الإثرائية */}
      {filteredResources.length === 0 ? (
        <div className="p-12 sm:p-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xs">
            📂
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">
            {resources.length === 0 ? 'لا توجد ملفات أو مراجع إثرائية مضافة بعد' : 'لا توجد ملفات متطابقة مع البحث'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-md mx-auto">
            {resources.length === 0
              ? 'في انتظار طرح وإضافة الملفات وسلايدات الورش والمراجع من قادة المسار ⏳'
              : 'جرّب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً'}
          </p>
          {isLeader && resources.length === 0 && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-5 btn-pill px-5 py-2.5 text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 transition-all inline-flex items-center gap-2 cursor-pointer border-none shadow-xs"
            >
              <Plus size={14} />
              <span>إضافة ملف أو مرجع إثرائي جديد</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-6 rounded-3xl bg-white border-2 border-[#0F1729] shadow-[0_4px_0_0_#0F1729] flex flex-col justify-between transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {getCategoryIcon(res.category)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="badge-pill bg-gray-100 text-gray-800 text-[10px] font-black border border-gray-200">
                      {getCategoryBadge(res.category)}
                    </span>
                    {isLeader && (
                      <button
                        type="button"
                        onClick={() => handleDelete(res.id, res.title)}
                        className="w-7 h-7 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer border-none"
                        title="حذف الملف"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-gray-950 mb-2 leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                  {res.description}
                </p>

                <div className="text-[11px] font-bold text-gray-400 flex items-center justify-between pt-2 border-t border-gray-100 mb-4">
                  <span>بواسطة: {res.uploadedBy.split('—')[0]}</span>
                  <span>{res.fileSize || 'ملف رقمي'}</span>
                </div>
              </div>

              {/* أزرار العرض والتحميل المباشرين للأعضاء */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={res.fileUrl.startsWith('http') ? res.fileUrl : `https://${res.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-pill px-4 py-2 text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 transition-all inline-flex items-center justify-center gap-1.5 no-underline shadow-xs cursor-pointer"
                >
                  <Download size={13} />
                  <span>تحميل الملف</span>
                </a>

                <a
                  href={res.fileUrl.startsWith('http') ? res.fileUrl : `https://${res.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill px-3.5 py-2 text-xs font-black text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all inline-flex items-center justify-center gap-1 no-underline cursor-pointer"
                  title="معاينة الملف في نافذة جديدة"
                >
                  <ExternalLink size={13} />
                  <span>معاينة</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة إضافة ملف إثرائي جديد للقادة */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#0F1729] shadow-2xl text-right"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl shadow-xs">
                    📁
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      إضافة ملف أو مرجع إثرائي للأعضاء
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      إتاحة الملفات والسلايدات للعرض والتحميل لجميع أعضاء المسار
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer border-none"
                >
                  <X size={18} />
                </button>
              </div>

              {successMsg ? (
                <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-bold text-sm">
                  {successMsg}
                </div>
              ) : (
                <form onSubmit={handleAddResource} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      اسم / عنوان الملف <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: سلايدات ورشة Flexbox و CSS Grid"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      وصف موجز للملف
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="وصف محتوى الملف وكيف يستفيد منه العضو..."
                      className="w-full px-4 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        تصنيف الملف
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-800"
                      >
                        <option value="guide">دليل تعلم 📖</option>
                        <option value="slides">سلايدات ورشة 📽️</option>
                        <option value="cheatsheet">مرجع أكواد 💻</option>
                        <option value="book">كتاب برمجي 📚</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        نوع الملف والحجم
                      </label>
                      <input
                        type="text"
                        value={fileSize}
                        onChange={(e) => setFileSize(e.target.value)}
                        placeholder="2.5 MB PDF"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      رابط الملف أو مستند Google Drive / GitHub <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://drive.google.com/... أو https://github.com/..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ltr text-left"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="btn-pill px-5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || !fileUrl.trim()}
                      className="btn-pill px-7 py-2 text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 disabled:opacity-50 border-none cursor-pointer shadow-md"
                    >
                      {isSubmitting ? 'جاري الإضافة...' : 'نشر الملف للأعضاء 🚀'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
