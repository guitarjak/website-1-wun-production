'use client';

import { useState, useEffect } from 'react';

export function ShareCertificateSection({
  certificateNumber,
  userName,
  courseTitle,
}: {
  certificateNumber: string;
  userName: string;
  courseTitle: string;
}) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/view-certificate/${certificateNumber}`;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load Facebook SDK
    if (typeof window !== 'undefined' && !(window as any).FB) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      document.body.appendChild(script);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleFacebookShare = () => {
    if ((window as any).FB) {
      (window as any).FB.ui(
        {
          method: 'share',
          href: shareUrl,
          hashtag: '#Website1Wun',
          quote: `${userName} completed ${courseTitle}! 🎉`,
        },
        function (response: any) {}
      );
    } else {
      // Fallback if SDK not loaded
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        'facebook-share-dialog',
        'width=800,height=600'
      );
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 text-center" style={{ borderColor: 'var(--border-light)' }}>
      <p className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        🌟 แบ่งปันความสำเร็จของคุณให้กับเพื่อนๆ
      </p>
      <p className="mb-4 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
        ใครก็ได้สามารถดูใบประกาศนียบัตรของคุณได้โดยไม่ต้องเข้าสู่ระบบ
      </p>
      <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={handleFacebookShare}
          className="px-3 sm:px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-xs sm:text-sm font-semibold"
          style={{ background: 'var(--blue)' }}
        >
          📱 Facebook
        </button>
        <button
          onClick={() => {
            const text = `${userName} completed ${courseTitle}! 🎉`;
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
              'twitter-share-dialog',
              'width=800,height=600'
            );
          }}
          className="px-3 sm:px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-xs sm:text-sm font-semibold"
          style={{ backgroundColor: '#1DA1F2' }}
        >
          𝕏 Twitter
        </button>
        <button
          onClick={handleCopy}
          className="px-3 sm:px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 text-xs sm:text-sm font-semibold"
          style={{ backgroundColor: '#1f2937' }}
        >
          🔗 คัดลอก
        </button>
      </div>
      {copied && (
        <div className="mt-3 text-xs sm:text-sm font-semibold" style={{ color: 'var(--golden)' }}>
          ลิงก์ถูกคัดลอกแล้ว
        </div>
      )}
    </div>
  );
}
