'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface FilterSectionProps {
  lessons: Array<{ id: string; title: string }>;
}

export default function FilterSection({ lessons }: FilterSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLesson = searchParams.get('lesson') || 'all';
  const currentStatus = searchParams.get('status') || 'all';

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLesson = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (newLesson === 'all') {
      params.delete('lesson');
    } else {
      params.set('lesson', newLesson);
    }

    router.push(`/admin/homework?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (newStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }

    router.push(`/admin/homework?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lesson Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            เลือกบทเรียน
          </label>
          <select
            value={currentLesson}
            onChange={handleLessonChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">ทั้งหมด</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            สถานะ
          </label>
          <select
            value={currentStatus}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">ทั้งหมด</option>
            <option value="SUBMITTED">รอตรวจ</option>
            <option value="REVIEWED">ตรวจแล้ว</option>
            <option value="APPROVED">ผ่านแล้ว</option>
          </select>
        </div>
      </div>
    </div>
  );
}
