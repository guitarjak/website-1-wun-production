'use client';

import { useState } from 'react';

interface AddModuleButtonProps {
  courseId: string;
  onSuccess?: () => void;
}

export default function AddModuleButton({
  courseId,
  onSuccess,
}: AddModuleButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
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
        setIsAdding(false);
        setTitle('');
        setDescription('');
        window.location.reload();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setError(null);
    setSuccess(false);
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        ➕ เพิ่มโมดูล
      </button>
    );
  }

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 my-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">เพิ่มโมดูลใหม่</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
            สร้างสำเร็จ!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ชื่อโมดูล
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="เช่น บทนำเกี่ยวกับเรื่องนี้"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            รายละเอียด (ไม่จำเป็น)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="บรรยายเกี่ยวกับโมดูลนี้..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 bg-white"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-green-200">
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
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'กำลังสร้าง...' : 'สร้างโมดูล'}
          </button>
        </div>
      </form>
    </div>
  );
}
