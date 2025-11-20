'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
        return;
      }

      // Redirect to course page on success
      router.push('/course');
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#efe3d4' }}>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8" style={{ borderColor: 'var(--border-light)' }}>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              สมัครสมาชิก
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              สร้างบัญชีใหม่เพื่อเริ่มเรียน
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                placeholder="ใส่ชื่อ-นามสกุลของคุณ"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:opacity-60"
                style={{
                  borderColor: 'var(--border-light)',
                  backgroundColor: '#f9fafb',
                  color: 'var(--text-primary)',
                  focusRingColor: 'var(--golden)',
                }}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                อีเมล
              </label>
              <input
                type="email"
                placeholder="ใส่อีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:opacity-60"
                style={{
                  borderColor: 'var(--border-light)',
                  backgroundColor: '#f9fafb',
                  color: 'var(--text-primary)',
                  focusRingColor: 'var(--golden)',
                }}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                รหัสผ่าน
              </label>
              <input
                type="password"
                placeholder="ใส่รหัสผ่านของคุณ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:opacity-60"
                style={{
                  borderColor: 'var(--border-light)',
                  backgroundColor: '#f9fafb',
                  color: 'var(--text-primary)',
                  focusRingColor: 'var(--golden)',
                }}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-4 rounded-lg"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderLeft: '4px solid var(--error)',
                }}
              >
                <p style={{ color: 'var(--error)' }} className="text-sm">
                  <span className="font-semibold">❌ เกิดข้อผิดพลาด:</span> {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 mt-6"
              style={{
                background: loading ? 'var(--text-tertiary)' : 'var(--golden)',
                color: 'white',
              }}
            >
              {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border-light)' }}>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              มีบัญชีอยู่แล้ว?{' '}
              <a href="/auth/login" className="font-semibold hover:underline" style={{ color: 'var(--golden)' }}>
                เข้าสู่ระบบ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
