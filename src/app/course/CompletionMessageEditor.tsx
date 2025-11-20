'use client';

import { useState } from 'react';

interface CompletionMessageEditorProps {
  courseId: string;
  initialTitle: string;
  initialMessage: string;
  isAdmin?: boolean;
}

export default function CompletionMessageEditor({
  courseId,
  initialTitle,
  initialMessage,
  isAdmin,
}: CompletionMessageEditorProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [message, setMessage] = useState(initialMessage);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/completion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completionTitle: title,
          completionMessage: message,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      setSuccess(true);

      setTimeout(() => {
        setIsEditMode(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setMessage(initialMessage);
    setError(null);
    setSuccess(false);
    setIsEditMode(false);
  };

  if (!isAdmin) {
    return (
      <div className="mt-8 bg-white/70 backdrop-blur border border-slate-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
        <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🎉</div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-slate-600 text-base sm:text-lg mb-6 px-4">
          {message}
        </p>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          ✏️ แก้ไขข้อความเมื่อจบคอร์ส
        </h3>

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
              ชื่อเรื่อง
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              placeholder="เช่น ยินดีด้วย!"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ข้อความ
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={isLoading}
              rows={4}
              placeholder="เช่น คุณเสร็จสิ้นการเรียนคอร์ส {course_title} แล้ว 🌟"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-slate-900 bg-white"
            />
            <p className="text-xs text-slate-500 mt-1">
              💡 ใช้ {"{course_title}"} เพื่อแทนชื่อคอร์ส
            </p>
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

  return (
    <div className="mt-8 bg-white/70 backdrop-blur border border-slate-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg relative group">
      <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🎉</div>
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 text-base sm:text-lg mb-6 px-4">
        {message}
      </p>

      <button
        onClick={() => setIsEditMode(true)}
        className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded hover:bg-blue-200 transition-colors text-sm opacity-0 group-hover:opacity-100"
      >
        ✏️ แก้ไข
      </button>
    </div>
  );
}
