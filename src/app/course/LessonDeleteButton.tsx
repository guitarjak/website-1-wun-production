'use client';

interface LessonDeleteButtonProps {
  lessonId: string;
  lessonTitle: string;
}

export default function LessonDeleteButton({
  lessonId,
  lessonTitle,
}: LessonDeleteButtonProps) {
  const handleDelete = () => {
    if (confirm(`ลบบทเรียน "${lessonTitle}" หรือไม่?`)) {
      fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE',
      }).then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          alert('เกิดข้อผิดพลาดในการลบบทเรียน');
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-2 rounded-lg bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition-colors text-sm whitespace-nowrap"
    >
      🗑️
    </button>
  );
}
