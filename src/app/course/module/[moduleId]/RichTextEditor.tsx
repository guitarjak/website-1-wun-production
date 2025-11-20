'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

// StarterKit already includes: Document, Paragraph, Text, Bold, Code, Italic, Strike, Heading, HardBreak, HorizontalRule, BulletList, CodeBlock, ListItem, OrderedList

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  // Update editor content when value prop changes (but not on initial render)
  useEffect(() => {
    if (editor && value) {
      const currentContent = editor.getHTML();
      // Only update if content has actually changed and we're not in the middle of typing
      if (currentContent !== value && editor.isEditable) {
        editor.commands.setContent(value, false);
      }
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm font-semibold ${
            editor.isActive('bold')
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm font-semibold italic ${
            editor.isActive('italic')
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm font-semibold line-through ${
            editor.isActive('strike')
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          S
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm font-bold ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm font-bold ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          H2
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive('bulletList')
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive('orderedList')
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          1. List
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          onClick={() =>
            editor.chain().focus().setTextAlign('left').run()
          }
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive({ textAlign: 'left' })
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          ◀
        </button>

        <button
          onClick={() =>
            editor.chain().focus().setTextAlign('center').run()
          }
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive({ textAlign: 'center' })
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          ▮
        </button>

        <button
          onClick={() =>
            editor.chain().focus().setTextAlign('right').run()
          }
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive({ textAlign: 'right' })
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50`}
        >
          ▶
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled}
          className="px-3 py-1 rounded text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          ↶ Undo
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled}
          className="px-3 py-1 rounded text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          ↷ Redo
        </button>
      </div>

      {/* Editor Content */}
      <div className="p-4 min-h-64 focus:outline-none bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none [&>div]:focus:outline-none text-gray-900
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:my-2
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:my-2
            [&_p]:text-gray-900 [&_p]:my-1
            [&_ul]:text-gray-900 [&_ul]:list-disc [&_ul]:ml-6
            [&_ol]:text-gray-900 [&_ol]:list-decimal [&_ol]:ml-6
            [&_li]:text-gray-900 [&_li]:my-1
            [&_strong]:font-bold
            [&_em]:italic
            [&_s]:line-through"
        />
      </div>
    </div>
  );
}
