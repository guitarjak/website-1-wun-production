'use client';

import { useState } from 'react';

interface EditNameButtonProps {
  initialName: string | null;
  onSuccess?: (newName: string) => void;
}

export default function EditNameButton({
  initialName,
  onSuccess,
}: EditNameButtonProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState(initialName || '');

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      setSuccess(true);
      onSuccess?.(name);

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
    setName(initialName || '');
    setError(null);
    setSuccess(false);
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">✏️ แก้ไขชื่อเต็ม</h3>

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
              ชื่อเต็ม
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="เช่น สมชาย สมหญิง"
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

  return (
    <div className="flex items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          ชื่อเต็ม
        </label>
        <p className="text-lg text-gray-900">
          {name || 'ไม่ได้ระบุ'}
        </p>
      </div>
      <button
        onClick={() => setIsEditMode(true)}
        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded hover:bg-blue-200 transition-colors text-sm whitespace-nowrap flex-shrink-0"
      >
        ✏️ แก้ไข
      </button>
    </div>
  );
}
