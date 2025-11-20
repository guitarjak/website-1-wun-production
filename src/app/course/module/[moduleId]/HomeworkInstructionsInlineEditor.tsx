'use client';

import { useState } from 'react';
import { updateHomeworkInstructions } from './actions';
import RichTextEditor from './RichTextEditor';

interface HomeworkInstructionsInlineEditorProps {
  moduleId: string;
  currentInstructions: string;
}

export default function HomeworkInstructionsInlineEditor({
  moduleId,
  currentInstructions,
}: HomeworkInstructionsInlineEditorProps) {
  const [instructions, setInstructions] = useState(currentInstructions);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateHomeworkInstructions(moduleId, instructions);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => {
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
    setInstructions(currentInstructions);
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            ✏️ แก้ไขคำแนะนำการบ้าน
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            บันทึกสำเร็จ! กำลังรีเฟรชหน้า...
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            เนื้อหาคำแนะนำ
          </label>
          <RichTextEditor
            value={instructions}
            onChange={setInstructions}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-blue-600 font-semibold">📋 คำแนะนำการบ้าน:</p>
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
        >
          แก้ไข
        </button>
      </div>
      <div
        className="text-sm text-blue-900
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-blue-900 [&_h1]:my-2
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-blue-900 [&_h2]:my-2
          [&_p]:text-blue-900 [&_p]:my-1
          [&_ul]:text-blue-900 [&_ul]:list-disc [&_ul]:ml-6
          [&_ol]:text-blue-900 [&_ol]:list-decimal [&_ol]:ml-6
          [&_li]:text-blue-900 [&_li]:my-1
          [&_strong]:font-bold
          [&_em]:italic
          [&_s]:line-through"
        dangerouslySetInnerHTML={{
          __html: currentInstructions,
        }}
      />
    </div>
  );
}
