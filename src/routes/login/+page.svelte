<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let loading = false;
  let showForgotPassword = false;
  let forgotPasswordEmail = '';

  $: showResetSuccess = $page.url.searchParams.get('reset') === 'success';
</script>

<div class="max-w-md mx-auto">
  <div class="space-y-6 sm:space-y-8">
    <div class="text-center space-y-4">
      <a href="/" class="inline-block">
        <img
          src="/ovm/ovm-logo-black.png"
          alt="Online Vending Machine"
          class="h-10 sm:h-12 w-auto mx-auto"
        />
      </a>
      <div class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight" style="color: var(--text-primary);">
          Welcome back
        </h1>
        <p class="text-sm sm:text-base" style="color: var(--text-secondary);">
          Sign in to continue your learning journey
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8" style="border: 1px solid var(--border-light);">
      <form
        method="POST"
        action="?/login"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
        class="space-y-5"
      >
        {#if showResetSuccess}
          <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
            Password successfully reset! Please sign in with your new password.
          </div>
        {/if}

        {#if form?.error}
          <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
            {form.error}
          </div>
        {/if}

        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium" style="color: var(--text-secondary);">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 rounded-xl text-sm sm:text-base input-themed"
            placeholder="you@example.com"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium" style="color: var(--text-secondary);">
              Password
            </label>
            <button
              type="button"
              on:click={() => showForgotPassword = true}
              class="text-sm transition-colors"
              style="color: var(--text-secondary);"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-3 rounded-xl text-sm sm:text-base input-themed"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full btn-primary py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm sm:text-base min-h-[48px]"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>

    <p class="text-center text-sm" style="color: var(--text-secondary);">
      Need access? Contact your administrator for an account.
    </p>
  </div>
</div>

<!-- Forgot Password Modal -->
{#if showForgotPassword}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    on:click={() => showForgotPassword = false}
    on:keydown={(e) => e.key === 'Escape' && (showForgotPassword = false)}
    role="button"
    tabindex="0"
  >
    <div
      class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      tabindex="-1"
    >
      <div class="space-y-4">
        <div>
          <h2 class="text-2xl font-bold" style="color: var(--text-primary);">Reset password</h2>
          <p class="text-sm mt-2" style="color: var(--text-secondary);">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {#if form?.type === 'forgotPassword' && form?.success}
          <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
            {form.message}
          </div>
        {:else if form?.type === 'forgotPassword' && form?.error}
          <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
            {form.error}
          </div>
        {/if}

        <form
          method="POST"
          action="?/forgotPassword"
          use:enhance={() => {
            loading = true;
            return async ({ update }) => {
              await update();
              loading = false;
            };
          }}
          class="space-y-4"
        >
          <div class="space-y-2">
            <label for="forgot-email" class="block text-sm font-medium" style="color: var(--text-secondary);">
              Email address
            </label>
            <input
              type="email"
              id="forgot-email"
              name="email"
              bind:value={forgotPasswordEmail}
              required
              autocomplete="email"
              class="w-full px-4 py-3 rounded-xl text-sm input-themed"
              placeholder="you@example.com"
            />
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              on:click={() => showForgotPassword = false}
              class="flex-1 btn-ghost py-3 px-4 rounded-xl font-medium transition-all duration-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              class="flex-1 btn-primary py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
