<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';

  export let value: any = null;
  export let onChange: (json: any) => void = () => {};

  let editor: Editor | null = null;
  let editorElement: HTMLElement;

  // Helper function to get valid Tiptap content
  function getValidContent(content: any) {
    // Check if content is a valid Tiptap document (JSON format)
    if (content && typeof content === 'object' && content.type === 'doc' && Array.isArray(content.content)) {
      return content;
    }
    // If content is an HTML string, return it directly (TipTap will parse it)
    if (typeof content === 'string' && content.trim().length > 0) {
      return content;
    }
    // Return default empty document
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    };
  }

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [StarterKit],
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

    // Compare content intelligently based on type
    let shouldUpdate = false;
    if (typeof validContent === 'string') {
      // If validContent is HTML string, compare HTML output
      const currentHTML = editor.getHTML();
      shouldUpdate = currentHTML !== validContent;
    } else {
      // If validContent is JSON object, compare JSON
      shouldUpdate = JSON.stringify(currentContent) !== JSON.stringify(validContent);
    }

    // Only update if content is different to avoid infinite loops
    if (shouldUpdate) {
      editor.commands.setContent(validContent);
    }
  }

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  function toggleBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function toggleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function setHeading(level: 1 | 2 | 3) {
    editor?.chain().focus().toggleHeading({ level }).run();
  }

  function setParagraph() {
    editor?.chain().focus().setParagraph().run();
  }
</script>

<div class="border border-gray-300 rounded-lg overflow-hidden">
  <!-- Toolbar -->
  <div class="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
    <button
      type="button"
      on:mousedown|preventDefault={toggleBold}
      class="px-3 py-1.5 text-sm font-semibold rounded hover:bg-gray-200 transition-colors {editor?.isActive('bold') ? 'bg-gray-300' : 'bg-white'}"
      title="Bold"
    >
      <strong>B</strong>
    </button>

    <button
      type="button"
      on:mousedown|preventDefault={toggleItalic}
      class="px-3 py-1.5 text-sm italic rounded hover:bg-gray-200 transition-colors {editor?.isActive('italic') ? 'bg-gray-300' : 'bg-white'}"
      title="Italic"
    >
      I
    </button>

    <div class="w-px bg-gray-300 mx-1"></div>

    <button
      type="button"
      on:mousedown|preventDefault={() => setHeading(1)}
      class="px-3 py-1.5 text-sm font-bold rounded hover:bg-gray-200 transition-colors {editor?.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'bg-white'}"
      title="Heading 1"
    >
      H1
    </button>

    <button
      type="button"
      on:mousedown|preventDefault={() => setHeading(2)}
      class="px-3 py-1.5 text-sm font-bold rounded hover:bg-gray-200 transition-colors {editor?.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'bg-white'}"
      title="Heading 2"
    >
      H2
    </button>

    <button
      type="button"
      on:mousedown|preventDefault={() => setHeading(3)}
      class="px-3 py-1.5 text-sm font-bold rounded hover:bg-gray-200 transition-colors {editor?.isActive('heading', { level: 3 }) ? 'bg-gray-300' : 'bg-white'}"
      title="Heading 3"
    >
      H3
    </button>

    <button
      type="button"
      on:mousedown|preventDefault={setParagraph}
      class="px-3 py-1.5 text-sm rounded hover:bg-gray-200 transition-colors {editor?.isActive('paragraph') ? 'bg-gray-300' : 'bg-white'}"
      title="Paragraph"
    >
      P
    </button>

    <div class="w-px bg-gray-300 mx-1"></div>

    <button
      type="button"
      on:mousedown|preventDefault={toggleBulletList}
      class="px-3 py-1.5 text-sm rounded hover:bg-gray-200 transition-colors {editor?.isActive('bulletList') ? 'bg-gray-300' : 'bg-white'}"
      title="Bullet List"
    >
      • List
    </button>

    <button
      type="button"
      on:mousedown|preventDefault={toggleOrderedList}
      class="px-3 py-1.5 text-sm rounded hover:bg-gray-200 transition-colors {editor?.isActive('orderedList') ? 'bg-gray-300' : 'bg-white'}"
      title="Ordered List"
    >
      1. List
    </button>
  </div>

  <!-- Editor -->
  <div
    bind:this={editorElement}
    class="bg-white max-h-96 overflow-y-auto"
  ></div>
</div>

<style>
  :global(.tiptap-editor h1) {
    font-size: 2em;
    font-weight: bold;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
  }

  :global(.tiptap-editor h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 0.83em;
    margin-bottom: 0.83em;
  }

  :global(.tiptap-editor h3) {
    font-size: 1.17em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  :global(.tiptap-editor p) {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  :global(.tiptap-editor ul) {
    list-style-type: disc;
    padding-left: 2em;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  :global(.tiptap-editor ol) {
    list-style-type: decimal;
    padding-left: 2em;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  :global(.tiptap-editor strong) {
    font-weight: bold;
  }

  :global(.tiptap-editor em) {
    font-style: italic;
  }

  :global(.tiptap-editor code) {
    background-color: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }
</style>
