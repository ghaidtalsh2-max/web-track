import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, TrackResource } from '../../types';
import { store } from '../../services/store';
import {
  Plus,
  Trash2,
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Eye,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  openTrackFile,
  downloadTrackFile,
  persistLocalFile,
  getPersistedLocalFile,
  sanitizeViewUrl,
  sanitizeDownloadUrl,
} from '../../services/fileStorage';

interface ResourcesViewProps {
  currentUser: UserProfile;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ currentUser }) => {
  const [resources, setResources] = useState<TrackResource[]>(() => store.getResources());
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // اشتراك فوري في تحديثات المتجر لضمان ظهور الملفات المضافة مباشرة
  useEffect(() => {
    setResources(store.getResources());
    const unsubscribe = store.subscribe(() => {
      setResources(store.getResources());
    });
    return () => unsubscribe();
  }, []);

  const isLeader =
    currentUser.role === 'track_leader' ||
    currentUser.role === 'supervisor' ||
    currentUser.role === 'admin';

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [title, setTitle] = useState('');
  const [workshopName, setWorkshopName] = useState('Web Fundamentals');
  const [customWorkshop, setCustomWorkshop] = useState('');
  const [category, setCategory] = useState<'slides' | 'cheatsheet' | 'guide'>('slides');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [fileSize, setFileSize] = useState('١٫٥ MB');
  const [color, setColor] = useState('#4285F4');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Preview Modal State
  const [previewResource, setPreviewResource] = useState<TrackResource | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Handle local file selection with DataURL reading
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFileFormat(ext);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const arSize = `${sizeMb.replace('.', '٫')} MB`;
      setFileSize(arSize);

      // قراءة الملف كـ DataURL دائم حتى لا يضيع الرابط بعد إعادة التحميل
      const reader = new FileReader();
      reader.onload = () => {
        const dUrl = reader.result as string;
        setFileData(dUrl);
        setFileUrl(dUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (uploadMode === 'upload' && !fileData && !selectedFile) return;
    if (uploadMode === 'url' && !fileUrl.trim()) return;

    setIsSubmitting(true);
    const finalWorkshop = workshopName === 'custom' ? customWorkshop.trim() || 'عام' : workshopName;

    // Pick appropriate color if default
    let itemColor = color;
    if (finalWorkshop.includes('Web Fundamentals')) itemColor = '#4285F4';
    else if (finalWorkshop.includes('Git & GitHub')) itemColor = '#EA4335';
    else if (finalWorkshop.includes('عام')) itemColor = '#34A853';

    const resId = `res-${Date.now()}`;
    let finalUrl = fileUrl.trim();
    let savedFileData = fileData;

    // حفظ الملف محلياً بصورة دائمة في IndexedDB
    if (uploadMode === 'upload' && selectedFile) {
      try {
        const persisted = await persistLocalFile(resId, selectedFile);
        savedFileData = persisted.dataUrl;
        finalUrl = persisted.dataUrl;
      } catch (err) {
        console.warn('Could not persist to indexedDB, fallback to in-memory dataUrl:', err);
      }
    } else if (uploadMode === 'url') {
      finalUrl = sanitizeViewUrl(fileUrl);
    }

    const newRes = store.addResource({
      id: resId,
      title: title.trim(),
      description: `ملف إثرائي معتمد لمسار الويب · ${finalWorkshop}`,
      category,
      fileUrl: finalUrl,
      fileName: fileName.trim() || `${title.trim()}.${fileFormat.toLowerCase()}`,
      fileData: savedFileData,
      fileType: (fileFormat.toLowerCase() === 'pdf' ? 'pdf' : fileFormat.toLowerCase() === 'link' ? 'link' : 'code') as any,
      fileSize: fileSize.trim() || '١٫٠ MB',
      workshopName: finalWorkshop,
      color: itemColor,
      uploadedBy: currentUser.fullName,
    });

    setResources(store.getResources());

    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    setSuccessMsg('تمت إضافة الملف بنجاح وإتاحته للأعضاء للفتح والتحميل! ✨');
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setSuccessMsg('');
      setTitle('');
      setFileUrl('');
      setFileName('');
      setFileData('');
      setSelectedFile(null);
    }, 1100);
  };

  const handleDelete = (id: string, fileTitle: string) => {
    if (confirm(`هل أنت متأكد من حذف الملف «${fileTitle}»؟`)) {
      store.deleteResource(id);
      setResources(store.getResources());
    }
  };

  // فتح الملف ومعاينته فوراً
  const handleOpenFile = async (res: TrackResource) => {
    let content = res.fileData || res.fileUrl;
    if (!content || !content.startsWith('data:')) {
      setIsPreviewLoading(true);
      const persisted = await getPersistedLocalFile(res.id);
      if (persisted) {
        content = persisted;
      }
      setIsPreviewLoading(false);
    }
    setPreviewResource(res);
    setPreviewDataUrl(content || null);
  };

  // تحميل الملف المباشر على جهاز المستخدم
  const handleDownloadFile = async (res: TrackResource) => {
    await downloadTrackFile(res);
  };

  // Filter Logic
  const filteredResources = resources.filter((r) => {
    // Category filter
    let matchesCategory = true;
    if (selectedFilter === 'slides') matchesCategory = r.category === 'slides';
    else if (selectedFilter === 'guides') matchesCategory = r.category === 'guide';
    else if (selectedFilter === 'cheatsheet') matchesCategory = r.category === 'cheatsheet';

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.workshopName && r.workshopName.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Calculate counts for tabs
  const totalCount = resources.length;
  const slidesCount = resources.filter((r) => r.category === 'slides').length;
  const guidesCount = resources.filter((r) => r.category === 'guide').length;
  const cheatsheetCount = resources.filter((r) => r.category === 'cheatsheet').length;

  // Group filtered resources by workshop
  const groupedResources = filteredResources.reduce((acc, res) => {
    const ws = res.workshopName || 'عام';
    if (!acc[ws]) {
      acc[ws] = [];
    }
    acc[ws].push(res);
    return acc;
  }, {} as Record<string, TrackResource[]>);

  // Helper for workshop color badge
  const getWorkshopMeta = (ws: string) => {
    if (ws.includes('Web Fundamentals')) {
      return { color: '#4285F4', suffix: '· الورشة ١' };
    }
    if (ws.includes('Git & GitHub')) {
      return { color: '#EA4335', suffix: '· الورشة ٢' };
    }
    if (ws.includes('JavaScript')) {
      return { color: '#F9AB00', suffix: '· الورشة ٣' };
    }
    return { color: '#34A853', suffix: '' };
  };

  // Helper for Category label
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'slides':
        return 'سلايدات';
      case 'cheatsheet':
        return 'مرجع أكواد';
      case 'guide':
        return 'دليل تعلم';
      default:
        return 'ملف إثرائي';
    }
  };

  return (
    <div
      className="pg"
      style={{
        boxSizing: 'border-box',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '28px 48px 56px',
        fontFamily: "'IBM Plex Sans Arabic', Arimo, sans-serif",
        color: '#0F172A',
        background: '#fff',
        position: 'relative',
        direction: 'rtl',
      }}
    >
      {/* Header Row */}
      <div
        className="u"
        style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '46px', fontWeight: 800, lineHeight: 1.1, color: '#0F172A', margin: 0 }}>
            الملفات الإثرائية
          </h1>
          <p style={{ fontSize: '18px', marginTop: '6px', color: '#5f6673', margin: 0 }}>
            سلايدات الورش وأدلة التعلم ومراجع الأكواد في مكان واحد.
          </p>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="b y cursor-pointer hover:opacity-95 transition-transform active:scale-95"
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              backgroundColor: '#F9AB00',
              border: '2px solid #0F172A',
              borderRadius: '99px',
              padding: '12px 28px',
              fontWeight: 700,
              fontSize: '17px',
              minHeight: '48px',
              color: '#0F172A',
              boxShadow: '0 4px 0 0 #0F172A',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            <span>إضافة ملف</span>
          </button>
        )}
      </div>

      {/* Search and Tabs Row */}
      <div
        className="u"
        style={{
          marginTop: '24px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <input
          aria-label="بحث"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحثي عن ملف أو مرجع…"
          style={{
            flex: 1,
            minWidth: '260px',
            border: '2px solid #9AA0A6',
            borderRadius: '99px',
            padding: '12px 22px',
            fontSize: '17px',
            fontFamily: 'inherit',
            minHeight: '48px',
            outline: 'none',
            color: '#0F172A',
          }}
        />

        <div
          className="tabs"
          style={{
            display: 'inline-flex',
            gap: '4px',
            background: '#F1F3F4',
            borderRadius: '99px',
            padding: '5px',
          }}
        >
          <a
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '16px',
              color: selectedFilter === 'all' ? '#fff' : '#3C4043',
              background: selectedFilter === 'all' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedFilter === 'all' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            الكل {totalCount}
          </a>

          <a
            onClick={() => setSelectedFilter('slides')}
            className={selectedFilter === 'slides' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '16px',
              color: selectedFilter === 'slides' ? '#fff' : '#3C4043',
              background: selectedFilter === 'slides' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedFilter === 'slides' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            سلايدات الورش {slidesCount}
          </a>

          <a
            onClick={() => setSelectedFilter('guides')}
            className={selectedFilter === 'guides' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '16px',
              color: selectedFilter === 'guides' ? '#fff' : '#3C4043',
              background: selectedFilter === 'guides' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedFilter === 'guides' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            أدلة التعلم {guidesCount}
          </a>

          <a
            onClick={() => setSelectedFilter('cheatsheet')}
            className={selectedFilter === 'cheatsheet' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '16px',
              color: selectedFilter === 'cheatsheet' ? '#fff' : '#3C4043',
              background: selectedFilter === 'cheatsheet' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedFilter === 'cheatsheet' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            مراجع الأكواد {cheatsheetCount}
          </a>
        </div>
      </div>

      {/* Main Container Card (.k) */}
      <div
        className="k u"
        style={{
          marginTop: '22px',
          padding: '10px 28px',
          border: '2px solid #0F172A',
          borderRadius: '28px',
          background: '#fff',
        }}
      >
        {Object.keys(groupedResources).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px', color: '#5f6673' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📁</div>
            <b style={{ fontSize: '20px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
              {resources.length === 0
                ? 'بانتظار إضافة الملفات الإثرائية من قادة المسار'
                : 'لا توجد ملفات متطابقة مع البحث أو الفلتر المختار'}
            </b>
            <p style={{ margin: 0, fontSize: '15px', color: '#5f6673' }}>
              {resources.length === 0
                ? 'ستظهر هنا سلايدات الورش ومراجع الأكواد وأدلة التعلم فور رفعها من القادة.'
                : 'جرّبي تغيير كلمات البحث أو اختيار فلتر مختلف.'}
            </p>
          </div>
        ) : (
          Object.entries(groupedResources).map(([wsName, items], groupIdx) => {
            const meta = getWorkshopMeta(wsName);
            return (
              <div key={wsName}>
                {/* Workshop Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    paddingTop: groupIdx === 0 ? '16px' : '28px',
                    paddingBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '28px',
                      borderRadius: '5px',
                      background: meta.color,
                    }}
                  />
                  <b style={{ fontSize: '22px', color: '#0F172A' }}>{wsName}</b>
                  {meta.suffix && <span style={{ color: '#5f6673', fontSize: '17px' }}>{meta.suffix}</span>}
                </div>

                {/* File Rows */}
                {items.map((res) => {
                  const itemColor = res.color || meta.color;
                  const isLink = res.fileType === 'link' || res.fileUrl.startsWith('http');
                  const isPdf = res.fileType === 'pdf' || res.fileSize?.includes('PDF');
                  const isCode = res.category === 'cheatsheet' || res.fileType === 'code';

                  return (
                    <div
                      key={res.id}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderTop: '1px solid #E8EAED',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Icon Box */}
                      <div
                        style={{
                          flex: 'none',
                          width: '52px',
                          height: '52px',
                          borderRadius: '16px',
                          background: itemColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0F172A',
                        }}
                      >
                        {res.category === 'slides' ? (
                          // Screen / Slides icon
                          <svg
                            viewBox="0 0 24 24"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect x="3" y="4" width="18" height="12" rx="2"></rect>
                            <path d="M8 20h8M12 16v4"></path>
                          </svg>
                        ) : res.fileType === 'link' ? (
                          // Link icon
                          <svg
                            viewBox="0 0 24 24"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"></path>
                          </svg>
                        ) : (
                          // Code / Document icon
                          <svg
                            viewBox="0 0 24 24"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5"></path>
                          </svg>
                        )}
                      </div>

                      {/* Title & Chips */}
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <b style={{ fontSize: '19px', color: '#0F172A', display: 'block' }}>{res.title}</b>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span
                            className="t"
                            style={{
                              display: 'inline-block',
                              borderRadius: '99px',
                              padding: '4px 14px',
                              fontSize: '14px',
                              fontWeight: 600,
                              background: '#E8F0FE',
                              color: '#0F172A',
                            }}
                          >
                            {getCategoryLabel(res.category)}
                          </span>

                          <span
                            className="t"
                            style={{
                              display: 'inline-block',
                              borderRadius: '99px',
                              padding: '4px 14px',
                              fontSize: '14px',
                              fontWeight: 600,
                              background: '#F1F3F4',
                              color: '#0F172A',
                            }}
                          >
                            {res.fileType === 'link' ? 'رابط' : 'PDF'}
                          </span>

                          <span
                            className="t"
                            style={{
                              display: 'inline-block',
                              borderRadius: '99px',
                              padding: '4px 14px',
                              fontSize: '14px',
                              fontWeight: 600,
                              background: '#fff',
                              border: '1px solid #E8EAED',
                              color: '#0F172A',
                            }}
                          >
                            {res.fileSize || '١٫٠ MB'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenFile(res)}
                          className="b cursor-pointer hover:bg-[#E8EAED] transition-colors"
                          style={{
                            background: '#F1F3F4',
                            border: '0',
                            borderRadius: '99px',
                            padding: '8px 20px',
                            minHeight: '42px',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#0F172A',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <Eye size={17} />
                          <span>فتح</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadFile(res)}
                          className="b cursor-pointer hover:opacity-95 transition-transform active:scale-95"
                          style={{
                            background: itemColor,
                            border: '0',
                            borderRadius: '99px',
                            padding: '8px 20px',
                            minHeight: '42px',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#0F172A',
                            display: 'inline-flex',
                            gap: '6px',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Download size={17} />
                          <span>تحميل</span>
                        </button>

                        {isLeader && (
                          <button
                            type="button"
                            onClick={() => handleDelete(res.id, res.title)}
                            title="حذف الملف"
                            style={{
                              background: '#FEE2E2',
                              border: '0',
                              borderRadius: '99px',
                              width: '42px',
                              height: '42px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#DC2626',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Note under card */}
      <p style={{ marginTop: '14px', fontSize: '15px', color: '#5f6673' }}>
        جميع الملفات الإثرائية المعتمدة لمسار الويب محفوظة ومتاحة للأعضاء للفتح المباشر والتحميل الفوري.
      </p>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: '28px',
                padding: '32px',
                maxWidth: '560px',
                width: '100%',
                border: '2px solid #0F172A',
                boxShadow: '0 12px 0 0 #0F172A',
                textAlign: 'right',
                direction: 'rtl',
                position: 'relative',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #E8EAED',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    إضافة ملف إثرائي
                  </h3>
                  <p style={{ fontSize: '14px', color: '#5f6673', margin: '4px 0 0' }}>
                    رفع ملف أو إضافة رابط مباشر مع تحديد الورشة والتصنيف.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid #0F172A',
                    backgroundColor: '#F1F3F4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#0F172A',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {successMsg ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#E6F4EA',
                    borderRadius: '20px',
                    border: '2px solid #34A853',
                    color: '#137333',
                    fontWeight: 700,
                    fontSize: '16px',
                  }}
                >
                  <CheckCircle2 size={36} style={{ margin: '0 auto 10px', color: '#34A853' }} />
                  {successMsg}
                </div>
              ) : (
                <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Mode Selector Tabs */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      background: '#F1F3F4',
                      borderRadius: '99px',
                      padding: '4px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '99px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: 700,
                        backgroundColor: uploadMode === 'url' ? '#0F172A' : 'transparent',
                        color: uploadMode === 'url' ? '#fff' : '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <LinkIcon size={16} />
                      <span>رابط خارجي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUploadMode('upload')}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '99px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: 700,
                        backgroundColor: uploadMode === 'upload' ? '#0F172A' : 'transparent',
                        color: uploadMode === 'upload' ? '#fff' : '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Upload size={16} />
                      <span>رفع ملف (حتى 10MB)</span>
                    </button>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                      عنوان الملف <span style={{ color: '#EA4335' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: سلايدات أساسيات الويب أو مرجع CSS"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 18px',
                        fontSize: '15px',
                        borderRadius: '16px',
                        border: '2px solid #0F172A',
                        backgroundColor: '#fff',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Workshop & Category Selectors */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                        الورشة
                      </label>
                      <select
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '12px 14px',
                          fontSize: '15px',
                          borderRadius: '16px',
                          border: '2px solid #0F172A',
                          backgroundColor: '#fff',
                          outline: 'none',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Web Fundamentals">Web Fundamentals · الورشة ١</option>
                        <option value="Git & GitHub">Git & GitHub · الورشة ٢</option>
                        <option value="عام">عام</option>
                        <option value="custom">+ ورشة أخرى...</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                        النوع
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '12px 14px',
                          fontSize: '15px',
                          borderRadius: '16px',
                          border: '2px solid #0F172A',
                          backgroundColor: '#fff',
                          outline: 'none',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="slides">سلايدات</option>
                        <option value="cheatsheet">مرجع أكواد</option>
                        <option value="guide">دليل تعلم</option>
                      </select>
                    </div>
                  </div>

                  {workshopName === 'custom' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                        اسم الورشة المخصصة
                      </label>
                      <input
                        type="text"
                        value={customWorkshop}
                        onChange={(e) => setCustomWorkshop(e.target.value)}
                        placeholder="مثال: React & State Management"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '12px 18px',
                          fontSize: '15px',
                          borderRadius: '16px',
                          border: '2px solid #0F172A',
                          backgroundColor: '#fff',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  )}

                  {/* File Upload / URL field */}
                  {uploadMode === 'upload' ? (
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                        رفع الملف (PDF, PNG, JPG, ZIP)
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '20px',
                          border: '2px dashed #0F172A',
                          borderRadius: '18px',
                          backgroundColor: '#F8FAFC',
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={28} style={{ color: '#4285F4', marginBottom: '8px' }} />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                          {fileName ? `تم اختيار: ${fileName}` : 'اضغط لاختيار ملف من جهازك'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          الحد الأقصى: 10 ميجابايت
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.zip"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                        رابط الملف أو المستند <span style={{ color: '#EA4335' }}>*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        placeholder="https://drive.google.com/... أو https://github.com/..."
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '12px 18px',
                          fontSize: '15px',
                          borderRadius: '16px',
                          border: '2px solid #0F172A',
                          backgroundColor: '#fff',
                          outline: 'none',
                          direction: 'ltr',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  )}

                  {/* Format & Size Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                        الصيغة
                      </label>
                      <input
                        type="text"
                        value={fileFormat}
                        onChange={(e) => setFileFormat(e.target.value)}
                        placeholder="PDF أو رابط"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          fontSize: '14px',
                          borderRadius: '14px',
                          border: '2px solid #0F172A',
                          backgroundColor: '#fff',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                        الحجم / المصدر
                      </label>
                      <input
                        type="text"
                        value={fileSize}
                        onChange={(e) => setFileSize(e.target.value)}
                        placeholder="مثال: ٢٫١ MB أو GitHub"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          fontSize: '14px',
                          borderRadius: '14px',
                          border: '2px solid #0F172A',
                          backgroundColor: '#fff',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      justifyContent: 'flex-end',
                      paddingTop: '12px',
                      borderTop: '1px solid #E8EAED',
                      marginTop: '6px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      style={{
                        padding: '10px 24px',
                        borderRadius: '99px',
                        border: 'none',
                        backgroundColor: '#F1F3F4',
                        color: '#0F172A',
                        fontWeight: 700,
                        fontSize: '15px',
                        cursor: 'pointer',
                      }}
                    >
                      إلغاء
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || (uploadMode === 'upload' ? (!fileData && !selectedFile) : !fileUrl.trim())}
                      style={{
                        padding: '10px 30px',
                        borderRadius: '99px',
                        border: '2px solid #0F172A',
                        backgroundColor: '#F9AB00',
                        color: '#0F172A',
                        fontWeight: 800,
                        fontSize: '15px',
                        cursor: isSubmitting || !title.trim() || (uploadMode === 'upload' ? (!fileData && !selectedFile) : !fileUrl.trim()) ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting || !title.trim() || (uploadMode === 'upload' ? (!fileData && !selectedFile) : !fileUrl.trim()) ? 0.6 : 1,
                        boxShadow: '0 4px 0 0 #0F172A',
                      }}
                    >
                      {isSubmitting ? 'جاري حفظ ونشر الملف...' : 'نشر الملف للأعضاء ✨'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* File Preview Modal (معاينة وفتح وتحميل فوري دائم) */}
      <AnimatePresence>
        {previewResource && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => setPreviewResource(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: '24px',
                padding: '24px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '2px solid #0F172A',
                direction: 'rtl',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {previewResource.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                    {previewResource.workshopName || 'مسار الويب'} · {previewResource.fileSize || 'ملف إثرائي'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  style={{
                    border: 'none',
                    background: '#F1F5F9',
                    borderRadius: '99px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Viewer Content */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px 0',
                  minHeight: '380px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isPreviewLoading ? (
                  <div style={{ textAlign: 'center' }}>
                    <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-2" />
                    <p style={{ fontSize: '14px', color: '#64748B' }}>جاري تحميل الملف...</p>
                  </div>
                ) : (previewDataUrl && previewDataUrl.startsWith('data:image/')) || previewResource.fileName?.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                  <img
                    src={previewDataUrl || previewResource.fileUrl}
                    alt={previewResource.title}
                    style={{
                      maxHeight: '60vh',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '12px',
                    }}
                  />
                ) : (previewDataUrl && previewDataUrl.startsWith('data:application/pdf')) || previewResource.fileUrl.endsWith('.pdf') ? (
                  <iframe
                    src={previewDataUrl || previewResource.fileUrl}
                    title={previewResource.title}
                    style={{
                      width: '100%',
                      height: '60vh',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      background: '#F8FAFC',
                      borderRadius: '16px',
                      width: '100%',
                      border: '2px dashed #CBD5E1',
                    }}
                  >
                    <FileText size={48} className="text-blue-500 mx-auto mb-3" />
                    <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                      {previewResource.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '420px', margin: '0 auto 20px' }}>
                      الملف معتمد وجاهز للفتح في علامة تبويب جديدة أو التحميل المباشر إلى جهازك.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openTrackFile(previewResource)}
                        style={{
                          backgroundColor: '#4285F4',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '99px',
                          padding: '10px 24px',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <ExternalLink size={16} />
                        <span>فتح في نافذة جديدة</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(previewResource)}
                        style={{
                          backgroundColor: '#0F172A',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '99px',
                          padding: '10px 24px',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Download size={16} />
                        <span>تحميل إلى جهازي</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '99px',
                    border: 'none',
                    backgroundColor: '#F1F5F9',
                    color: '#0F172A',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  إغلاق
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => openTrackFile(previewResource)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '99px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#fff',
                      color: '#0F172A',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>نافذة جديدة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(previewResource)}
                    style={{
                      padding: '8px 24px',
                      borderRadius: '99px',
                      border: 'none',
                      backgroundColor: '#F9AB00',
                      color: '#0F172A',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 0 0 #0F172A',
                    }}
                  >
                    <Download size={15} />
                    <span>تحميل الملف</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
