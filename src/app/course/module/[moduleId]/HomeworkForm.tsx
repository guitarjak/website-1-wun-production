'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HomeworkFormProps {
  moduleId: string;
  existingSubmission?: {
    submission_text: string;
  } | null;
}

export function HomeworkForm({ moduleId, existingSubmission }: HomeworkFormProps) {
  const router = useRouter();
  const isEditing = !!existingSubmission;
  const [content, setContent] = useState(existingSubmission?.submission_text || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!content.trim()) {
        throw new Error('กรุณากรอกเนื้อหาการบ้าน');
      }

      const response = await fetch('/api/homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleId, content: content.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'ไม่สามารถส่งการบ้านได้'
        );
      }

      setSuccess(true);
      setContent('');
      setIsLoading(false);

      // Refresh the page after 2 seconds to show updated submission
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่รู้จัก'
      );
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg flex items-center gap-2">
        <span className="text-xl">✓</span>
        <span className="font-semibold">ส่งการบ้านสำเร็จ!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Textarea */}
      <div>
        <label
          htmlFor="homework-content"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          คำตอบการบ้านหรือลิงก์งานของคุณ
        </label>
        <textarea
          id="homework-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          placeholder="ตัวอย่าง: https://docs.google.com/document/d/... หรือคำตอบของคุณในรูปแบบข้อความ"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          rows={6}
        />
      </div>

      {/* Character count */}
      <p className="text-xs text-gray-500">
        {content.length} ตัวอักษร
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !content.trim()}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
          isLoading || !content.trim()
            ? 'bg-purple-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isLoading ? '⏳ กำลังบันทึก...' : isEditing ? '✏️ แก้ไขการบ้าน' : '✓ ส่งการบ้าน'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            <span className="font-semibold">❌ เกิดข้อผิดพลาด:</span> {error}
          </p>
        </div>
      )}
    </form>
  );
}
