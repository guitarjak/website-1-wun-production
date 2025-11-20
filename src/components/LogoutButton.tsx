'use client';

import { logoutAction } from '@/app/auth/logout/actions';

/**
 * Logout button component - calls a server action to logout
 * This properly handles page revalidation and navbar updates.
 */
export default function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left transition-colors text-sm py-2 px-0"
      style={{
        color: 'var(--error)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      🚪 Logout
    </button>
  );
}
