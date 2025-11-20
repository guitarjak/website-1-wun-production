'use client';

import { useState } from 'react';

interface CourseEditButtonProps {
  courseId: string;
  initialTitle: string;
  initialDescription: string | null;
  onSuccess?: () => void;
}

export default function CourseEditButton({
  courseId,
  initialTitle,
  initialDescription,
  onSuccess,
}: CourseEditButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
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
        setIsEditing(false);
        setSuccess(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setDescription(initialDescription || '');
    setError(null);
    setSuccess(false);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">✏️ แก้ไขชื่อคอร์สและรายละเอียด</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
            บันทึกสำเร็จ! กำลังรีเฟรชหน้า...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ชื่อคอร์ส
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              placeholder="เช่น TypeScript สำหรับผู้เริ่มต้น"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-slate-900 bg-white"
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
              rows={4}
              placeholder="บรรยายเกี่ยวกับคอร์สนี้..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-slate-900 bg-white"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-indigo-200">
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
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 break-words">
          {title}
        </h1>
        {description && (
          <p className="text-slate-600 text-base sm:text-lg line-clamp-3">{description}</p>
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap"
      >
        ✏️ แก้ไข
      </button>
    </div>
  );
}
