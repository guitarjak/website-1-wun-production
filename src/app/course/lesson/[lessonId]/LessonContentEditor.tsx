'use client';

import { useState } from 'react';
import RichTextEditor from '../../module/[moduleId]/RichTextEditor';

interface LessonContentEditorProps {
  lessonId: string;
  initialContent: string | null;
}

export default function LessonContentEditor({
  lessonId,
  initialContent,
}: LessonContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState(initialContent || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      setSuccess(true);
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
    setContent(initialContent || '');
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ แก้ไขเนื้อหาบทเรียน</h3>

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
          <RichTextEditor
            value={content}
            onChange={setContent}
            disabled={isLoading}
          />

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
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
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">เนื้อหาบทเรียน</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap"
        >
          ✏️ แก้ไข
        </button>
      </div>
      {content ? (
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:my-2
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:my-2
            [&_p]:text-gray-900 [&_p]:my-1
            [&_ul]:text-gray-900 [&_ul]:list-disc [&_ul]:ml-6
            [&_ol]:text-gray-900 [&_ol]:list-decimal [&_ol]:ml-6
            [&_li]:text-gray-900 [&_li]:my-1
            [&_strong]:font-bold
            [&_em]:italic
            [&_s]:line-through"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-gray-600 italic">ไม่มีเนื้อหาเพิ่มเติม</p>
      )}
    </div>
  );
}
