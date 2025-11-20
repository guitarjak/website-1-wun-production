'use client';

import { useState } from 'react';
import { Submission } from './page';
import { updateHomeworkStatus, updateHomeworkFeedback } from './actions';
import ContentPreview from './ContentPreview';

interface HomeworkCardProps {
  submission: Submission;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function HomeworkCard({
  submission,
  isExpanded,
  onToggleExpand,
}: HomeworkCardProps) {
  const [status, setStatus] = useState(submission.status);
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'SUBMITTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'SUBMITTED':
        return 'รอตรวจ';
      case 'REVIEWED':
        return 'ตรวจแล้ว';
      case 'APPROVED':
        return 'ผ่านแล้ว';
      default:
        return s;
    }
  };

  const handleStatusChange = async (newStatus: 'SUBMITTED' | 'REVIEWED' | 'APPROVED') => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateHomeworkStatus(submission.id, newStatus);
      setStatus(newStatus);
      setSuccessMessage('บันทึกสถานะเรียบร้อย');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeedback = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateHomeworkFeedback(submission.id, feedback);
      setSuccessMessage('บันทึกความเห็นเรียบร้อย');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Header / Summary */}
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition"
        onClick={onToggleExpand}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          {/* Date */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
              วันที่ส่ง
            </p>
            <p className="text-sm text-gray-800">
              {formatDate(submission.submitted_at)}
            </p>
          </div>

          {/* Student Info */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
              นักเรียน
            </p>
            <p className="text-sm font-medium text-gray-800">
              {submission.full_name || 'ไม่ระบุชื่อ'}
            </p>
            <p className="text-xs text-gray-600">
              {submission.email}
            </p>
          </div>

          {/* Lesson */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
              โมดูล
            </p>
            <p className="text-sm text-gray-800">
              {submission.lesson_title}
            </p>
          </div>

          {/* Status Badge */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
              สถานะ
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                status
              )}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>

          {/* Expand Button */}
          <div className="flex justify-end">
            <button
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {isExpanded ? 'ซ่อน' : 'ดูเพิ่มเติม'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Content Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              เนื้อหาการบ้าน
            </h4>
            <ContentPreview content={submission.submission_text || ''} />
          </div>

          {/* Status Control */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              อัปเดตสถานะ
            </label>
            <div className="flex gap-2">
              {(['SUBMITTED', 'REVIEWED', 'APPROVED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    status === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {getStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ความเห็น / ข้อเสนอแนะ
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 resize-none"
              placeholder="กรอกความเห็นของคุณที่นี่..."
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onToggleExpand}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSaveFeedback}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
