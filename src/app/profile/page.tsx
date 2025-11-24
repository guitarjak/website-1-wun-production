import { requireUser } from '@/lib/auth';
import EditNameButton from './EditNameButton';
import ChangePasswordButton from './ChangePasswordButton';

export default async function ProfilePage() {
  // Automatically redirects to /auth/login if not logged in
  const user = await requireUser();

  const roleDisplay = user.profile.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'นักเรียน';

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8" style={{ borderColor: 'var(--border-light)' }}>
          {/* Header */}
          <div className="pb-6 mb-8" style={{ borderBottom: '2px solid var(--border-light)' }}>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>โปรไฟล์ของฉัน</h1>
            <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>ข้อมูลบัญชีผู้ใช้งาน</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Full Name - Editable */}
            <EditNameButton initialName={user.profile.full_name} />

            {/* Change Password */}
            <ChangePasswordButton />

            {/* Email */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb', borderColor: 'var(--border-light)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                อีเมล
              </label>
              <p className="text-lg break-all" style={{ color: 'var(--text-primary)' }}>
                {user.user.email || 'ไม่ได้ระบุ'}
              </p>
            </div>

            {/* Role */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb', borderColor: 'var(--border-light)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                บทบาท
              </label>
              <div className="flex items-center gap-3">
                <span
                  className="inline-block px-4 py-2 rounded-full font-semibold text-white"
                  style={{
                    background: user.profile.role === 'ADMIN' ? 'var(--golden)' : 'var(--blue)',
                    color: 'white',
                  }}
                >
                  {roleDisplay}
                </span>
                {user.profile.role === 'ADMIN' && (
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    (คุณมีสิทธิ์ในการจัดการระบบ)
                  </span>
                )}
              </div>
            </div>

            {/* User ID */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb', borderColor: 'var(--border-light)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                ID ผู้ใช้
              </label>
              <p className="text-sm font-mono break-all" style={{ color: 'var(--text-primary)' }}>
                {user.user.id}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-light)' }}>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              ข้อมูลนี้ดึงมาจากเซิร์ฟเวอร์ที่มีการตรวจสอบสิทธิ์
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
