import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

function isTipTapDoc(value: unknown): value is { type: string } {
  return typeof value === 'object' && value !== null && 'type' in value && (value as { type: string }).type === 'doc';
}

export function lessonContentToHtml(content: unknown): string {
  if (!content) return '';

  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (isTipTapDoc(parsed)) {
        return generateHTML(parsed as any, [StarterKit, Link]);
      }
    } catch {
      return content;
    }

    return content;
  }

  if (isTipTapDoc(content)) {
    try {
      return generateHTML(content as any, [StarterKit, Link]);
    } catch {
      return '';
    }
  }

  return '';
}
