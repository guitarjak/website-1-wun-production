import { requireAdmin } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Link from 'next/link';

async function fetchStats() {
  const supabase = await createSupabaseServerClient();

  // Fetch user count
  const { count: userCount } = await supabase
    .from('users_profile')
    .select('id', { count: 'exact' });

  // Fetch course count
  const { count: courseCount } = await supabase
    .from('courses')
    .select('id', { count: 'exact' });

  // Fetch submission count
  const { count: submissionCount } = await supabase
    .from('homework_submissions')
    .select('id', { count: 'exact' });

  // Fetch pending homework count
  const { count: pendingCount } = await supabase
    .from('homework_submissions')
    .select('id', { count: 'exact' })
    .eq('status', 'SUBMITTED');

  return {
    userCount: userCount || 0,
    courseCount: courseCount || 0,
    submissionCount: submissionCount || 0,
    pendingCount: pendingCount || 0,
  };
}

export default async function AdminDashboard() {
  // Ensure user is admin
  await requireAdmin();

  const stats = await fetchStats();

  const cards = [
    {
      title: '👥 ผู้ใช้',
      value: stats.userCount.toString(),
      description: 'จำนวนผู้ใช้ทั้งหมด',
      href: '/admin/users',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '📚 คอร์ส',
      value: stats.courseCount.toString(),
      description: 'จำนวนคอร์สที่มี',
      href: '/course',
      color: 'from-green-500 to-green-600',
    },
    {
      title: '📝 การบ้าน',
      value: stats.submissionCount.toString(),
      description: 'การบ้านที่ส่งมาทั้งหมด',
      href: '/admin/homework',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '⏳ รอตรวจ',
      value: stats.pendingCount.toString(),
      description: 'การบ้านที่รอการตรวจ',
      href: '/admin/homework?status=SUBMITTED',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#efe3d4' }}>
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {cards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="group"
            >
              <div
                className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer border"
                style={{ animationDelay: `${index * 100}ms`, borderColor: 'var(--border-light)' }}
              >
                <div className="relative z-10">
                  <h2 className="text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    {card.title}
                  </h2>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
                    {card.value}
                  </p>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--text-tertiary)' }}>{card.description}</p>
                </div>

                {/* Subtle bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" style={{ backgroundColor: 'var(--golden)' }} />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-12 border" style={{ borderColor: 'var(--border-light)' }}>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 break-words" style={{ color: 'var(--text-primary)' }}>
              ⚡ การกระทำด่วน
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>เข้าถึงการจัดการที่สำคัญได้อย่างรวดเร็ว</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/admin/users"
              className="group relative overflow-hidden p-6 rounded-xl hover:shadow-md transition-all duration-300 border"
              style={{ background: '#f9fafb', borderColor: 'var(--border-light)' }}
            >
              <div className="relative z-10">
                <span className="text-3xl block mb-3">👥</span>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>จัดการผู้ใช้</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>ดูและจัดการผู้ใช้ทั้งหมด</p>
              </div>
            </Link>

            <Link
              href="/admin/homework"
              className="group relative overflow-hidden p-6 rounded-xl hover:shadow-md transition-all duration-300 border"
              style={{ background: '#f9fafb', borderColor: 'var(--border-light)' }}
            >
              <div className="relative z-10">
                <span className="text-3xl block mb-3">📝</span>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>ตรวจการบ้าน</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>ตรวจและให้ข้อเสนอแนะ</p>
              </div>
            </Link>

            <Link
              href="/course"
              className="group relative overflow-hidden p-6 rounded-xl hover:shadow-md transition-all duration-300 border"
              style={{ background: '#f9fafb', borderColor: 'var(--border-light)' }}
            >
              <div className="relative z-10">
                <span className="text-3xl block mb-3">📚</span>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>จัดการคอร์ส</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>สร้างและแก้ไขคอร์ส</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="group relative overflow-hidden p-6 rounded-xl hover:shadow-md transition-all duration-300 border"
              style={{ background: '#f9fafb', borderColor: 'var(--border-light)' }}
            >
              <div className="relative z-10">
                <span className="text-3xl block mb-3">⚙️</span>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>ตั้งค่า</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>จัดการโปรไฟล์และการตั้งค่า</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border" style={{ borderColor: 'var(--border-light)' }}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 break-words" style={{ color: 'var(--text-primary)' }}>
            📈 สรุปอย่างรวดเร็ว
          </h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border" style={{ background: '#f9fafb', borderColor: 'var(--border-light)' }}>
              <div className="flex-1">
                <span className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                  👥 มีผู้ใช้ทั้งหมด <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{stats.userCount}</span> คน
                </span>
              </div>
              <div className="w-full sm:w-48 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ backgroundColor: 'var(--golden)', width: `${Math.min(stats.userCount * 10, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border" style={{ background: '#f9fafb', borderColor: 'var(--border-light)' }}>
              <div className="flex-1">
                <span className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                  📚 มีคอร์สทั้งหมด <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{stats.courseCount}</span> คอร์ส
                </span>
              </div>
              <div className="w-full sm:w-48 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ backgroundColor: 'var(--golden)', width: `${Math.min(stats.courseCount * 10, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border" style={{ background: '#f9fafb', borderColor: 'var(--border-light)' }}>
              <div className="flex-1">
                <span className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                  📝 การบ้านรอตรวจ <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{stats.pendingCount}</span> งาน
                </span>
              </div>
              <div className="w-full sm:w-48 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: 'var(--golden)',
                    width: `${
                      stats.submissionCount > 0
                        ? (stats.pendingCount / stats.submissionCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
