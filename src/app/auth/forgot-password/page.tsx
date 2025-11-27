'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด');
        setLoading(false);
        return;
      }

      setMessage(data.message || 'ส่งลิงค์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
      setEmail('');
      setLoading(false);
    } catch (err) {
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
              ลืมรหัสผ่าน?
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              ใส่อีเมลของคุณและเราจะส่งลิงค์รีเซ็ตรหัสผ่านให้คุณ
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

            {/* Success Message */}
            {message && (
              <div
                className="p-4 rounded-lg"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderLeft: '4px solid #22c55e',
                }}
              >
                <p style={{ color: '#22c55e' }} className="text-sm">
                  <span className="font-semibold">✓ สำเร็จ:</span> {message}
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
              {loading ? 'กำลังส่ง...' : 'ส่งลิงค์รีเซ็ต'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border-light)' }}>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              จำรหัสผ่านได้แล้ว?{' '}
              <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: 'var(--golden)' }}>
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
