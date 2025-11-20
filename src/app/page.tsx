import Image from 'next/image';

export default function Home() {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#efe3d4' }}
    >

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">

        {/* Main Content */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-8 duration-1000">
            <Image
              src="/w1w-logo.png"
              alt="Website 1 Wun Logo"
              width={120}
              height={120}
              className="w-24 h-auto mx-auto mb-4"
            />
          </div>

          {/* Main Heading */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-8 duration-1000" style={{ animationDelay: '0.2s' }}>
            <h1
              className="text-5xl sm:text-7xl font-bold mb-4 leading-tight tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Learning Platform
              <br />
              <span style={{ color: 'var(--golden)' }}>Coming Soon</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-12 animate-in fade-in slide-in-from-top-8 duration-1000" style={{ animationDelay: '0.4s' }}>
            <p
              className="text-lg sm:text-2xl mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Transform your learning journey with our revolutionary course platform
            </p>
            <p
              className="text-sm sm:text-base"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Interactive lessons • Real-time feedback • Structured learning paths
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: '0.6s' }}>
            {[
              {
                icon: '📚',
                title: 'Comprehensive Courses',
                desc: 'Expert-designed learning paths',
              },
              {
                icon: '✨',
                title: 'Interactive Content',
                desc: 'Engage with dynamic lessons',
              },
              {
                icon: '🎯',
                title: 'Track Progress',
                desc: 'Monitor your growth in real-time',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border backdrop-blur-md transition-all hover:shadow-lg hover:scale-105 duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderColor: 'var(--border-light)',
                }}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-tertiary)' }} className="text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: '0.8s' }}>
            <button
              className="px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-xl hover:scale-105 duration-300 text-white"
              style={{ background: 'var(--golden)' }}
            >
              Get Early Access
            </button>
          </div>

          {/* Countdown/Newsletter */}
          <div
            className="p-8 rounded-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-1000"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderColor: 'var(--border-light)',
              animationDelay: '1s',
            }}
          >
            <p
              className="text-sm font-semibold mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              📧 Be the first to know when we launch
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-none outline-none"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 whitespace-nowrap"
                style={{ background: 'var(--blue)' }}
              >
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-6 text-center text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <p>© 2025 Website 1 Wun Learning Platform. All rights reserved.</p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-in {
          animation: slideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
