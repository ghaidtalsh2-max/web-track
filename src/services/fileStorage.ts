/**
 * نظام تخزين وإدارة الملفات الإثرائية المعتمدة
 * يدعم التخزين المحلي الدائم (IndexedDB + Base64) والروابط السحابية المباشرة (Google Drive / GitHub)
 * يضمن بقاء الملفات بعد التحديث أو إعادة فتح المتصفح، مع فتحها وتحميلها بنقرة واحدة
 */

const DB_NAME = 'gdg_webtrack_files_v1';
const STORE_NAME = 'uploaded_files';

function openFilesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB غير مدعوم في هذا المتصفح'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * حفظ ملف محلي في قاعدة بيانات المتصفح الدائمة (IndexedDB)
 */
export async function persistLocalFile(id: string, file: File): Promise<{
  dataUrl: string;
  fileName: string;
  fileSize: string;
  fileFormat: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const fileSize = `${sizeMb.replace('.', '٫')} MB`;

      try {
        const db = await openFilesDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({
          id,
          dataUrl,
          fileName: file.name,
          fileSize,
          fileFormat: ext,
          mimeType: file.type || 'application/octet-stream',
          updatedAt: Date.now(),
        });
        tx.oncomplete = () => {
          resolve({
            dataUrl,
            fileName: file.name,
            fileSize,
            fileFormat: ext,
          });
        };
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        // Fallback: إرجاع الـ Data URL مباشرة
        resolve({
          dataUrl,
          fileName: file.name,
          fileSize,
          fileFormat: ext,
        });
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * جلب محتوى الملف المخزن بواسطة المعرف
 */
export async function getPersistedLocalFile(id: string): Promise<string | null> {
  try {
    const db = await openFilesDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        resolve(req.result?.dataUrl || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * حذف ملف مخزن من IndexedDB
 */
export async function deletePersistedLocalFile(id: string): Promise<void> {
  try {
    const db = await openFilesDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
  } catch {}
}

/**
 * تحويل Data URL إلى Blob صالح للاستخدام
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const byteString = atob(parts[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}

/**
 * استخراج رابط التحميل المباشر لملفات Google Drive
 */
export function sanitizeDownloadUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  url = url.replace(/^https?:\/\/blob:/i, 'blob:');

  // روابط الـ blob والـ data تبقى كما هي
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // تحويل روابط Google Drive المشتركة لروابط تحميل فوري
  const gdriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${gdriveMatch[1]}`;
  }

  return url;
}

/**
 * استخراج رابط المعاينة والعرض النظيف
 */
export function sanitizeViewUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  url = url.replace(/^https?:\/\/blob:/i, 'blob:');

  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * فتح الملف بنقرة واحدة (في نافذة جديدة أو معاينة)
 */
export async function openTrackFile(resource: {
  id: string;
  title: string;
  fileUrl: string;
  fileData?: string;
}): Promise<void> {
  let content = resource.fileData;

  // فحص IndexedDB إذا لم تكن البيانات في الذاكرة
  if (!content || !content.startsWith('data:')) {
    const persisted = await getPersistedLocalFile(resource.id);
    if (persisted && persisted.startsWith('data:')) {
      content = persisted;
    }
  }

  if (content && content.startsWith('data:')) {
    try {
      const blob = dataUrlToBlob(content);
      const freshUrl = URL.createObjectURL(blob);
      const newWin = window.open(freshUrl, '_blank');
      if (!newWin) {
        window.location.href = freshUrl;
      }
      return;
    } catch (e) {
      console.warn('Error opening blob from dataUrl:', e);
    }
  }

  // تنظيف أي بادئة خاطئة
  const rawUrl = (resource.fileUrl || '').replace(/^https?:\/\/blob:/i, 'blob:');

  // إذا كان الرابط مؤقتاً blob ولا توجد بيانات مخزنة له (ملف قديم قبل تفعيل التخزين الدائم)
  if (rawUrl.startsWith('blob:')) {
    alert(
      `عذراً، الملف «${resource.title}» فاقد للبيانات المؤقتة من الجلسة السابقة. يرجى حذفه وإعادة اختياره لمرة واحدة ليبقى محفوظاً بشكل دائم ويفتح دائماً.`
    );
    return;
  }

  const cleanUrl = sanitizeViewUrl(rawUrl);
  window.open(cleanUrl, '_blank', 'noopener,noreferrer');
}

/**
 * تحميل الملف بنقرة واحدة إلى جهاز المستخدم مباشرة
 */
export async function downloadTrackFile(resource: {
  id: string;
  title: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileData?: string;
}): Promise<void> {
  let content = resource.fileData;

  if (!content || !content.startsWith('data:')) {
    const persisted = await getPersistedLocalFile(resource.id);
    if (persisted && persisted.startsWith('data:')) {
      content = persisted;
    }
  }

  const ext = resource.fileName?.split('.').pop() || resource.fileType || 'pdf';
  const finalFileName = resource.fileName || `${resource.title || 'ملف-إثرائي'}.${ext}`;

  if (content && content.startsWith('data:')) {
    try {
      const blob = dataUrlToBlob(content);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      return;
    } catch (e) {
      console.warn('Error downloading blob:', e);
    }
  }

  const rawUrl = (resource.fileUrl || '').replace(/^https?:\/\/blob:/i, 'blob:');

  if (rawUrl.startsWith('blob:')) {
    alert(
      `عذراً، الملف «${resource.title}» فاقد للبيانات المؤقتة من الجلسة السابقة. يرجى إعادة اختياره لمرة واحدة ليتم حفظه دائماً.`
    );
    return;
  }

  const directUrl = sanitizeDownloadUrl(rawUrl);

  // إنشاء رابط تحميل مباشر
  const link = document.createElement('a');
  link.href = directUrl;
  link.download = finalFileName;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
