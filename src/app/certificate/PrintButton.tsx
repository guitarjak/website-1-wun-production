'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90"
      style={{ background: 'var(--golden)' }}
    >
      🖨️ พิมพ์ใบประกาศนียบัตร
    </button>
  );
}
