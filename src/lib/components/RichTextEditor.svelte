<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';

  export let value: any = null;
  export let onChange: (json: any) => void = () => {};

  let editor: Editor | null = null;
  let editorElement: HTMLElement;

  // Helper function to get valid Tiptap content
  function getValidContent(content: any) {
    if (content && typeof content === 'object' && content.type === 'doc' && Array.isArray(content.content)) {
      return content;
    }
    if (typeof content === 'string' && content.trim().length > 0) {
      return content;
    }
    return {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }]
    };
  }

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { target: '_blank' }
        })
      ],
      content: getValidContent(value),
      onUpdate: ({ editor }) => {
        const json = editor.getJSON();
        onChange(json);
      },
      editorProps: {
        attributes: {
          class: 'focus:outline-none min-h-[200px] p-4 tiptap-editor'
        }
      }
    });
  });

  // Update editor content when value prop changes
  $: if (editor && value !== undefined) {
    const validContent = getValidContent(value);
    const currentContent = editor.getJSON();

    let shouldUpdate = false;
    if (typeof validContent === 'string') {
      const currentHTML = editor.getHTML();
      shouldUpdate = currentHTML !== validContent;
    } else {
      shouldUpdate = JSON.stringify(currentContent) !== JSON.stringify(validContent);
    }

    if (shouldUpdate) {
      editor.commands.setContent(validContent);
    }
  }

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  function undo() { editor?.chain().focus().undo().run(); }
  function redo() { editor?.chain().focus().redo().run(); }
  function toggleBold() { editor?.chain().focus().toggleBold().run(); }
  function toggleItalic() { editor?.chain().focus().toggleItalic().run(); }
  function toggleStrike() { editor?.chain().focus().toggleStrike().run(); }
  function toggleBulletList() { editor?.chain().focus().toggleBulletList().run(); }
  function toggleOrderedList() { editor?.chain().focus().toggleOrderedList().run(); }
  function toggleBlockquote() { editor?.chain().focus().toggleBlockquote().run(); }
  function toggleCodeBlock() { editor?.chain().focus().toggleCodeBlock().run(); }
  function setHorizontalRule() { editor?.chain().focus().setHorizontalRule().run(); }
  function setHeading(level: 1 | 2 | 3) { editor?.chain().focus().toggleHeading({ level }).run(); }
  function setParagraph() { editor?.chain().focus().setParagraph().run(); }

  function toggleLink() {
    if (!editor) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = window.prompt('Enter URL:');
    if (href) {
      editor.chain().focus().setLink({ href }).run();
    }
  }

  // Active state helper
  $: activeBtn = (name: string, attrs?: any) => editor?.isActive(name, attrs) ? 'toolbar-btn-active' : 'toolbar-btn';
</script>

<div class="border border-gray-300 rounded-lg overflow-hidden">
  <!-- Toolbar -->
  <div class="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
    <!-- Undo / Redo -->
    <button type="button" on:mousedown|preventDefault={undo} class="toolbar-btn" title="Undo (Ctrl+Z)">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" /></svg>
    </button>
    <button type="button" on:mousedown|preventDefault={redo} class="toolbar-btn" title="Redo (Ctrl+Y)">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" /></svg>
    </button>

    <div class="w-px bg-gray-300 mx-1"></div>

    <!-- Bold / Italic / Strikethrough -->
    <button type="button" on:mousedown|preventDefault={toggleBold} class={activeBtn('bold')} title="Bold">
      <strong>B</strong>
    </button>
    <button type="button" on:mousedown|preventDefault={toggleItalic} class={activeBtn('italic')} title="Italic">
      <em>I</em>
    </button>
    <button type="button" on:mousedown|preventDefault={toggleStrike} class={activeBtn('strike')} title="Strikethrough">
      <s>S</s>
    </button>

    <div class="w-px bg-gray-300 mx-1"></div>

    <!-- Headings / Paragraph -->
    <button type="button" on:mousedown|preventDefault={() => setHeading(1)} class={activeBtn('heading', { level: 1 })} title="Heading 1">H1</button>
    <button type="button" on:mousedown|preventDefault={() => setHeading(2)} class={activeBtn('heading', { level: 2 })} title="Heading 2">H2</button>
    <button type="button" on:mousedown|preventDefault={() => setHeading(3)} class={activeBtn('heading', { level: 3 })} title="Heading 3">H3</button>
    <button type="button" on:mousedown|preventDefault={setParagraph} class={activeBtn('paragraph')} title="Paragraph">P</button>

    <div class="w-px bg-gray-300 mx-1"></div>

    <!-- Lists -->
    <button type="button" on:mousedown|preventDefault={toggleBulletList} class={activeBtn('bulletList')} title="Bullet List">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h.01M8 6h12M4 12h.01M8 12h12M4 18h.01M8 18h12" /></svg>
    </button>
    <button type="button" on:mousedown|preventDefault={toggleOrderedList} class={activeBtn('orderedList')} title="Ordered List">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h.01M8 6h12M4 12h.01M8 12h12M4 18h.01M8 18h12" /><text x="2" y="8" font-size="6" fill="currentColor">1</text></svg>
    </button>
    <button type="button" on:mousedown|preventDefault={toggleBlockquote} class={activeBtn('blockquote')} title="Blockquote">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M6 4h12a2 2 0 012 2v12l-4-4H6a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
    </button>

    <div class="w-px bg-gray-300 mx-1"></div>

    <!-- Code Block / HR / Link -->
    <button type="button" on:mousedown|preventDefault={toggleCodeBlock} class={activeBtn('codeBlock')} title="Code Block">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    </button>
    <button type="button" on:mousedown|preventDefault={setHorizontalRule} class="toolbar-btn" title="Horizontal Rule">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" /></svg>
    </button>
    <button type="button" on:mousedown|preventDefault={toggleLink} class={activeBtn('link')} title="Link">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
    </button>
  </div>

  <!-- Editor -->
  <div
    bind:this={editorElement}
    class="bg-white max-h-96 overflow-y-auto"
  ></div>
</div>

<style>
  :global(.toolbar-btn) {
    padding: 0.375rem 0.625rem;
    font-size: 0.875rem;
    border-radius: 0.25rem;
    background: white;
    transition: background-color 0.15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  :global(.toolbar-btn:hover) {
    background-color: #e5e7eb;
  }
  :global(.toolbar-btn-active) {
    padding: 0.375rem 0.625rem;
    font-size: 0.875rem;
    border-radius: 0.25rem;
    background: var(--golden-lighter, #fef3c7);
    transition: background-color 0.15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  :global(.toolbar-btn-active:hover) {
    background-color: var(--golden-lighter, #fef3c7);
  }

  :global(.tiptap-editor h1) { font-size: 2em; font-weight: bold; margin-top: 0.67em; margin-bottom: 0.67em; }
  :global(.tiptap-editor h2) { font-size: 1.5em; font-weight: bold; margin-top: 0.83em; margin-bottom: 0.83em; }
  :global(.tiptap-editor h3) { font-size: 1.17em; font-weight: bold; margin-top: 1em; margin-bottom: 1em; }
  :global(.tiptap-editor p) { margin-top: 1em; margin-bottom: 1em; }
  :global(.tiptap-editor ul) { list-style-type: disc; padding-left: 2em; margin-top: 1em; margin-bottom: 1em; }
  :global(.tiptap-editor ol) { list-style-type: decimal; padding-left: 2em; margin-top: 1em; margin-bottom: 1em; }
  :global(.tiptap-editor strong) { font-weight: bold; }
  :global(.tiptap-editor em) { font-style: italic; }
  :global(.tiptap-editor s) { text-decoration: line-through; }
  :global(.tiptap-editor code) { background-color: #f3f4f6; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; }
  :global(.tiptap-editor pre) { background-color: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1em 0; }
  :global(.tiptap-editor pre code) { background: transparent; color: inherit; padding: 0; }
  :global(.tiptap-editor blockquote) { border-left: 4px solid var(--golden, #d4a843); padding-left: 1rem; font-style: italic; color: #6b7280; margin: 1em 0; }
  :global(.tiptap-editor hr) { border: none; border-top: 2px solid #e5e7eb; margin: 1.5em 0; }
  :global(.tiptap-editor a) { color: #2563eb; text-decoration: underline; cursor: pointer; }
</style>
