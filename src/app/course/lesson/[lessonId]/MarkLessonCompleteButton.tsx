'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MarkLessonCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
  nextLessonId?: string;
}

export function MarkLessonCompleteButton({
  lessonId,
  isCompleted: initialCompleted,
  nextLessonId,
}: MarkLessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [error, setError] = useState<string | null>(null);

  const handleToggleCompletion = async () => {
    // Update state immediately (optimistic update)
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    setError(null);

    try {
      const response = await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          completed: newCompletedState,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'ไม่สามารถบันทึกความก้าวหน้าได้'
        );
      }

      // Success - no automatic redirect, let user click next lesson button if they want
      return;
    } catch (err) {
      // Revert state on error
      setIsCompleted(!newCompletedState);
      setError(
        err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่รู้จัก'
      );
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleToggleCompletion}
        className="w-full px-8 py-3 rounded-lg font-semibold text-white text-base transition-all hover:opacity-90"
        style={{
          background: isCompleted ? '#10b981' : 'var(--golden)',
          color: 'white',
        }}
      >
        {isCompleted ? 'ขอกลับไปทวนใหม่' : '✓ ทำบทเรียนนี้เสร็จแล้ว'}
      </button>

      {isCompleted && (
        <>
          {nextLessonId ? (
            <Link
              href={`/course/lesson/${nextLessonId}`}
              className="block px-6 py-3 font-semibold rounded-lg transition-all hover:opacity-90 text-center text-white"
              style={{
                background: '#10b981',
                color: 'white',
              }}
            >
              → ไปยังบทเรียนถัดไป
            </Link>
          ) : (
            <Link
              href="/course"
              className="block px-6 py-3 font-semibold rounded-lg transition-all hover:opacity-90 text-center text-white"
              style={{
                background: '#10b981',
                color: 'white',
              }}
            >
              ✓ เสร็จสิ้นแล้ว! กลับไปหน้าคอร์ส
            </Link>
          )}
        </>
      )}

      {error && (
        <div className="rounded-lg p-4" style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error)' }}>
          <p style={{ color: 'var(--error)' }}>
            <span className="font-semibold">❌ เกิดข้อผิดพลาด:</span> {error}
          </p>
          <button
            onClick={handleToggleCompletion}
            className="mt-3 text-sm font-semibold underline"
            style={{ color: 'var(--error)' }}
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}
    </div>
  );
}
