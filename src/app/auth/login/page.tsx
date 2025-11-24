'use client';

import { useState } from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAction(email, password);

      // If login failed, show error and don't redirect
      if (!result.success) {
        setError(result.error || 'เกิดข้อผิดพลาด');
        setLoading(false);
        return;
      }

      // If successful, loginAction will redirect automatically
    } catch (err: unknown) {
      // Check if this is a redirect error (which means success)
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        return;
      }
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}
    >
      <div className="max-w-md mx-auto">
        <div
          className="rounded-2xl shadow-lg p-8"
          style={{ borderColor: 'var(--border-light)', background: 'var(--bg-primary)' }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              เข้าสู่ระบบ
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              กรุณาใส่ข้อมูลเข้าสู่ระบบของคุณ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--golden)] disabled:opacity-60"
                style={{
                  borderColor: 'var(--border-light)',
                  backgroundColor: '#f9fafb',
                  color: 'var(--text-primary)',
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
                className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--golden)] disabled:opacity-60"
                style={{
                  borderColor: 'var(--border-light)',
                  backgroundColor: '#f9fafb',
                  color: 'var(--text-primary)',
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
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border-light)' }}>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              ยังไม่มีบัญชี?{' '}
              <a href="/" className="font-semibold hover:underline" style={{ color: 'var(--golden)' }}>
                สมัครเข้าร่วม Challenge
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
