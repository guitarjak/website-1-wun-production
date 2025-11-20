'use client';

import { useState } from 'react';

interface VideoEmbedEditorProps {
  lessonId: string;
  initialEmbed: string | null;
}

export default function VideoEmbedEditor({
  lessonId,
  initialEmbed,
}: VideoEmbedEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [embedHtml, setEmbedHtml] = useState(initialEmbed || '');

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
          video_embed: embedHtml || null,
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
    setEmbedHtml(initialEmbed || '');
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎬 แก้ไขวิดีโอ</h3>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Embed HTML (เช่น iframe จาก Bunny Stream, YouTube, เป็นต้น)
              </label>
              <textarea
                value={embedHtml}
                onChange={(e) => setEmbedHtml(e.target.value)}
                disabled={isLoading}
                rows={6}
                placeholder='<iframe src="https://..." width="100%" height="600" frameborder="0" allow="autoplay"></iframe>'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm disabled:opacity-50 text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-2">
                วางโค้ด embed HTML ของวิดีโอของคุณที่นี่ หากไม่มี วิดีโอจะไม่แสดงให้ผู้เรียนเห็น
              </p>
            </div>

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
                className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!initialEmbed) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 p-8 text-center">
        <p className="text-gray-600 mb-4">ยังไม่มีวิดีโอ</p>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          🎬 เพิ่มวิดีโอ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="aspect-video relative w-full">
        <div
          dangerouslySetInnerHTML={{ __html: initialEmbed }}
          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
        />
      </div>
      <div className="p-4 flex justify-end border-t border-gray-200">
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          🎬 แก้ไขวิดีโอ
        </button>
      </div>
    </div>
  );
}
