'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: '📊 Dashboard',
      href: '/admin',
      icon: '📊',
    },
    {
      label: '👥 จัดการผู้ใช้',
      href: '/admin/users',
      icon: '👥',
    },
    {
      label: '📝 ตรวจการบ้าน',
      href: '/admin/homework',
      icon: '📝',
    },
    {
      label: '📚 จัดการคอร์ส',
      href: '/course',
      icon: '📚',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav style={{ backgroundColor: 'rgba(250, 248, 245, 0.95)', borderColor: 'var(--border-light)' }} className="border-b backdrop-blur">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl">🎓</div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Admin Panel
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>ระบบจัดการ</p>
              </div>
            </div>

            {/* Dashboard summary moved up */}
            <div className="text-left md:text-right">
              <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold mb-2" style={{ background: 'var(--golden-lighter)', color: '#8b6600' }}>
                🚀 Dashboard Statistics
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ควบคุมระบบ
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                ยินดีต้อนรับสู่แผงควบคุมการจัดการ
              </p>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-slate-100 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    isActive(item.href)
                      ? 'bg-slate-200 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
