'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

interface UserMenuProps {
  displayName: string;
  isAdmin: boolean;
  email?: string;
}

export default function UserMenu({ displayName, isAdmin, email }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Info Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex flex-col items-end cursor-pointer hover:opacity-75 transition-opacity"
      >
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{displayName}</span>
        {isAdmin && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded badge-gold">
            ADMIN
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border" style={{ borderColor: 'var(--border-light)' }}>
          {/* Account Header */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
            <div className="text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>ACCOUNT</div>
            <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{displayName}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{email}</div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/course"
              className="block px-4 py-2 text-sm transition-colors"
              style={{ color: 'var(--text-secondary)', borderBottom: '1px solid transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => setIsOpen(false)}
            >
              📚 Course
            </Link>

            <Link
              href="/profile"
              className="block px-4 py-2 text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Settings
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setIsOpen(false)}
              >
                👨‍💼 Admin Dashboard
              </Link>
            )}

            <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
              <div className="px-4 py-2">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
