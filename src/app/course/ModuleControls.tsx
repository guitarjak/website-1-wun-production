'use client';

import { useState } from 'react';

interface ModuleControlsProps {
  moduleId: string;
  courseId: string;
  initialTitle: string;
  initialDescription: string | null;
  onSuccess?: () => void;
}

export default function ModuleControls({
  moduleId,
  courseId,
  initialTitle,
  initialDescription,
  onSuccess,
}: ModuleControlsProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || '');

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      setSuccess(true);
      onSuccess?.();

      setTimeout(() => {
        setIsEditMode(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      onSuccess?.();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setDescription(initialDescription || '');
    setError(null);
    setSuccess(false);
    setIsEditMode(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setError(null);
  };

  // Edit mode
  if (isEditMode) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 my-4">
        <h3 className="text-lg font-bold text-slate-900 mb-4">✏️ แก้ไขชื่อโมดูลและรายละเอียด</h3>

        <form onSubmit={handleEdit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              บันทึกสำเร็จ! กำลังรีเฟรชหน้า...
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ชื่อโมดูล
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              placeholder="เช่น บทนำ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              รายละเอียด (ไม่จำเป็น)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              placeholder="บรรยายเกี่ยวกับโมดูลนี้..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-slate-900 bg-white"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-blue-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Delete confirmation mode
  if (isDeleteMode) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 my-4">
        <h3 className="text-lg font-bold text-red-900 mb-4">ยืนยันการลบ</h3>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm mb-4">
            {error}
          </div>
        )}

        <p className="text-slate-700 mb-2">
          คุณแน่ใจหรือว่าต้องการลบโมดูล <strong>{initialTitle}</strong> และบทเรียนทั้งหมดในนี้?
        </p>
        <p className="text-slate-600 text-sm mb-6">
          ⚠️ การกระทำนี้ไม่สามารถยกเลิกได้
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancelDelete}
            disabled={isLoading}
            className="px-4 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'กำลังลบ...' : 'ลบโมดูล'}
          </button>
        </div>
      </div>
    );
  }

  // Normal state - show title and description with edit button
  return (
    <div className="flex items-start justify-between gap-4 w-full">
      <div className="flex-1 min-w-0">
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 break-words">
          {title}
        </h2>
        {description && (
          <p className="text-slate-600 text-xs sm:text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
        <button
          onClick={() => setIsEditMode(true)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded hover:bg-blue-200 transition-colors text-sm whitespace-nowrap"
        >
          ✏️ แก้ไข
        </button>
        <button
          onClick={() => setIsDeleteMode(true)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 font-semibold rounded hover:bg-red-200 transition-colors text-sm whitespace-nowrap"
        >
          🗑️ ลบ
        </button>
      </div>
    </div>
  );
}
