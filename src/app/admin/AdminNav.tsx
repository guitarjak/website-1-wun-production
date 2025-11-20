'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AdminUserMenu from './AdminUserMenu';

export default function AdminNav({ userName }: { userName?: string }) {
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
      <nav style={{ backgroundColor: '#efe3d4', borderColor: 'var(--border-light)' }} className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div>
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
