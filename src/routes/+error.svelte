<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="max-w-lg mx-auto py-12 sm:py-20">
  <div class="text-center space-y-6">
    <a href="/" class="inline-block">
      <img
        src="/ovm/ovm-logo-black.png"
        alt="Online Vending Machine"
        class="h-10 sm:h-12 w-auto mx-auto"
      />
    </a>

    <div class="space-y-2">
      <h1 class="text-6xl sm:text-7xl font-bold" style="color: var(--golden);">
        {$page.status}
      </h1>
      <p class="text-xl sm:text-2xl font-semibold" style="color: var(--text-primary);">
        {#if $page.status === 404}
          Page not found
        {:else if $page.status === 403}
          Access denied
        {:else}
          Something went wrong
        {/if}
      </p>
      <p class="text-sm sm:text-base" style="color: var(--text-secondary);">
        {#if $page.error?.message}
          {$page.error.message}
        {:else if $page.status === 404}
          The page you're looking for doesn't exist or has been moved.
        {:else}
          An unexpected error occurred. Please try again later.
        {/if}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
      <a
        href="/"
        class="btn-primary px-6 py-3 rounded-xl font-medium text-sm shadow-sm transition-all"
      >
        Go to Homepage
      </a>
      <button
        on:click={() => history.back()}
        class="btn-ghost px-6 py-3 rounded-xl font-medium text-sm transition-all"
      >
        Go Back
      </button>
    </div>
  </div>
</div>
