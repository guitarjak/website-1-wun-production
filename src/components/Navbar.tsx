import Link from "next/link";
import Image from "next/image";
import { getCurrentUserWithProfile } from "@/lib/auth";
import UserMenu from "./UserMenu";

/**
 * Global navbar component shown on all pages.
 * Server component that fetches the current user and displays different nav items based on role.
 * This component does not cache so it always shows the latest user state.
 */
export const dynamic = 'force-dynamic';

export default async function Navbar() {
  const currentUser = await getCurrentUserWithProfile();

  if (!currentUser) {
    // Not logged in
    return (
      <nav className="w-full" style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/w1w-logo.png"
              alt="Website 1 Wun"
              width={140}
              height={70}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
          <div className="flex gap-3 items-center">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/auth/register"
              className="btn-primary text-sm"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const { profile, user } = currentUser;
  const displayName = profile.full_name || user.email || "User";
  const isAdmin = profile.role === "ADMIN";

  return (
    <nav className="w-full" style={{
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/course" className="flex items-center">
          <Image
            src="/w1w-logo.png"
            alt="Website 1 Wun"
            width={140}
            height={70}
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>

        {/* User Menu */}
        <UserMenu displayName={displayName} isAdmin={isAdmin} email={user.email || undefined} />
      </div>
    </nav>
  );
}
