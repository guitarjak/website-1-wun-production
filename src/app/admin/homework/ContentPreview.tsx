'use client';

import { useState } from 'react';

interface ContentPreviewProps {
  content: string;
  maxPreviewLength?: number;
}

export default function ContentPreview({
  content,
  maxPreviewLength = 300,
}: ContentPreviewProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  const isLong = content.length > maxPreviewLength;
  const displayContent = showFullContent ? content : content.substring(0, maxPreviewLength);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
        {displayContent}
        {isLong && !showFullContent && '...'}
      </p>
      {isLong && (
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          {showFullContent ? 'ซ่อนเนื้อหา' : 'ดูเนื้อหาทั้งหมด'}
        </button>
      )}
    </div>
  );
}
