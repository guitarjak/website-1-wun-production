'use client';

import { useState } from 'react';
import { Submission } from './page';
import HomeworkCard from './HomeworkCard';

interface HomeworkListProps {
  submissions: Submission[];
}

export default function HomeworkList({ submissions }: HomeworkListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <HomeworkCard
          key={submission.id}
          submission={submission}
          isExpanded={expandedId === submission.id}
          onToggleExpand={() => toggleExpand(submission.id)}
        />
      ))}
    </div>
  );
}
