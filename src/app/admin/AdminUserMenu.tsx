'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminUserMenu({ userName }: { userName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity"
      >
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
          <span className="text-pink-600 font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-pink-600 transition-colors">
            {userName}
          </p>
          <p className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
            Administrator
          </p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Profile Section */}
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Admin Account
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-1 truncate">
              {userName}
            </p>
            <p className="text-xs text-pink-600 font-medium mt-1">
              Administrator Access
            </p>
          </div>

          {/* Menu Items */}
          <Link
            href="/course"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-pink-600 transition-colors"
          >
            <span className="text-base">👨‍🎓</span>
            <span>Student View</span>
          </Link>

          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-pink-600 transition-colors"
          >
            <span className="text-base">📊</span>
            <span>Admin Dashboard</span>
          </Link>

          <Link
            href="/admin/users"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-pink-600 transition-colors"
          >
            <span className="text-base">👥</span>
            <span>Manage Users</span>
          </Link>

          <Link
            href="/admin/homework"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-pink-600 transition-colors"
          >
            <span className="text-base">📝</span>
            <span>Review Homework</span>
          </Link>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-pink-600 transition-colors"
          >
            <span className="text-base">⚙️</span>
            <span>Profile Settings</span>
          </Link>

          {/* Divider */}
          <div className="border-t border-slate-200 my-1" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
