import Link from "next/link";
import Image from "next/image";
import { getCurrentUserWithProfile } from "@/lib/auth";
import UserMenu from "./UserMenu";

/**
 * Global navbar component shown on all pages.
 * Server component that fetches the current user.
 * Removed 'force-dynamic' to allow caching with revalidation.
 * The page that uses this component may have its own revalidation strategy.
 */
export default async function Navbar() {
  const currentUser = await getCurrentUserWithProfile();

  if (!currentUser) {
    // Not logged in
    return (
      <nav className="relative z-40 w-full" style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/w1w-logo.png"
              alt="Website 1 Wun"
              width={98}
              height={49}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
          <div className="flex gap-3 items-center">
            <Link
              href="/auth/login"
              className="btn-primary text-sm font-semibold text-black"
              style={{ backgroundColor: 'var(--golden)', color: '#1f2937' }}
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Logged in
  const { profile, user } = currentUser;
  const displayName = profile.full_name || user.email || "User";
  const isAdmin = profile.role === "ADMIN";

  return (
    <nav className="relative z-40 w-full" style={{
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
            width={98}
            height={49}
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
