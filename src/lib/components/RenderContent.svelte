<script lang="ts">
  import { generateHTML } from '@tiptap/html';
  import StarterKit from '@tiptap/starter-kit';

  export let content: any = null;

  let htmlContent = '';

  $: {
    if (!content) {
      htmlContent = '';
    } else if (typeof content === 'string') {
      // Content is a string - could be JSON string or HTML string
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(content);
        // If it's a valid TipTap document, convert to HTML
        if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
          htmlContent = generateHTML(parsed, [StarterKit]);
        } else {
          // Not a TipTap document, treat as HTML
          htmlContent = content;
        }
      } catch (e) {
        // Not valid JSON, treat as HTML string
        htmlContent = content;
      }
    } else if (typeof content === 'object') {
      // Content is TipTap JSON object, convert to HTML
      try {
        htmlContent = generateHTML(content, [StarterKit]);
      } catch (error) {
        console.error('Failed to generate HTML from Tiptap content:', error);
        htmlContent = '';
      }
    } else {
      htmlContent = '';
    }
  }
</script>

{#if !htmlContent}
  <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
    <svg
      class="mx-auto h-12 w-12 text-gray-400 mb-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <p class="text-gray-600 text-sm">No written content for this lesson yet.</p>
  </div>
{:else}
  <div class="lesson-content">
    {@html htmlContent}
  </div>
{/if}

<style>
  .lesson-content {
    max-width: none;
    color: var(--text-primary);
    line-height: 1.75;
  }

  .lesson-content :global(h1) {
    font-size: 2.25em;
    font-weight: 800;
    color: var(--text-primary);
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .lesson-content :global(h2) {
    font-size: 1.875em;
    font-weight: 700;
    color: var(--text-primary);
    margin-top: 1.75rem;
    margin-bottom: 0.875rem;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .lesson-content :global(h3) {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--text-primary);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .lesson-content :global(p) {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    line-height: 1.75;
    color: var(--text-primary);
  }

  .lesson-content :global(ul) {
    list-style-type: disc;
    padding-left: 1.625rem;
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .lesson-content :global(ol) {
    list-style-type: decimal;
    padding-left: 1.625rem;
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .lesson-content :global(li) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    line-height: 1.75;
  }

  .lesson-content :global(strong) {
    font-weight: 600;
    color: var(--text-primary);
  }

  .lesson-content :global(em) {
    font-style: italic;
  }

  .lesson-content :global(code) {
    background-color: var(--golden-lighter);
    color: #8b6600;
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
  }

  .lesson-content :global(pre) {
    background-color: var(--dark-80);
    color: #e0e0e0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .lesson-content :global(pre code) {
    background-color: transparent;
    color: inherit;
    padding: 0;
    font-weight: 400;
  }

  .lesson-content :global(blockquote) {
    border-left: 4px solid var(--golden);
    padding-left: 1rem;
    font-style: italic;
    color: var(--text-secondary);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .lesson-content :global(a) {
    color: var(--blue);
    text-decoration: none;
    font-weight: 500;
  }

  .lesson-content :global(a:hover) {
    color: var(--blue-dark);
    text-decoration: underline;
  }
</style>
