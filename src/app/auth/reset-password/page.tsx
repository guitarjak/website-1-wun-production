'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('ลิงค์รีเซ็ตไม่ถูกต้อง');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!password || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: searchParams.get('code'),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen py-12 px-4"
        style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}
      >
        <div className="max-w-md mx-auto">
          <div
            className="rounded-2xl shadow-lg p-8 text-center"
            style={{ borderColor: 'var(--border-light)', background: 'var(--bg-primary)' }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(34, 197, 94, 0.1)' }}
            >
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              เปลี่ยนรหัสผ่านสำเร็จ!
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
              กำลังเปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ...
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2 rounded-lg font-semibold text-white"
              style={{ background: 'var(--golden)' }}
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              ตั้งรหัสผ่านใหม่
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              ใส่รหัสผ่านใหม่ของคุณ
            </p>
          </div>

          {error && (
            <div
              className="p-4 rounded-lg mb-5"
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                รหัสผ่านใหม่
              </label>
              <input
                type="password"
                placeholder="ใส่รหัสผ่านใหม่"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                ยืนยันรหัสผ่าน
              </label>
              <input
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'กำลังตั้งรหัสผ่าน...' : 'ตั้งรหัสผ่านใหม่'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border-light)' }}>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-primary)' }}>
          กำลังโหลด...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
