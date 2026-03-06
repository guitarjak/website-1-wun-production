<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let loading = false;
  let password = '';
  let confirmPassword = '';
  let showPassword = false;
  let showConfirmPassword = false;
  let checkingAuth = true;
  let authError = '';
  let hasValidSession = false;

  onMount(async () => {
    // Check for error in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');

    if (error) {
      authError = errorDescription || 'Invalid or expired reset link';
      checkingAuth = false;
      // Redirect to login after showing error
      setTimeout(() => {
        goto('/login');
      }, 3000);
      return;
    }

    // Check if hash has auth tokens (access_token or type=recovery)
    const hasAuthHash = hashParams.has('access_token') || hashParams.get('type') === 'recovery';

    if (hasAuthHash) {
      // Process recovery hash on this page only (avoid loading Supabase client globally).
      const { createBrowserClient } = await import('@supabase/ssr');
      const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session) {
        hasValidSession = true;
        checkingAuth = false;
        void invalidateAll();
        return;
      }

      // Refresh server data so cookies/session from hash exchange are reflected in page data.
      await invalidateAll();

      // Check if session was established
      if (data.session) {
        hasValidSession = true;
        checkingAuth = false;
      } else {
        // If still no session after processing, there might be an issue
        authError = 'Failed to establish session. Please try requesting a new reset link.';
        checkingAuth = false;
        setTimeout(() => {
          goto('/login');
        }, 3000);
      }
    } else if (data.session) {
      // Already have a session (maybe from cookies)
      hasValidSession = true;
      checkingAuth = false;
    } else {
      // No auth hash and no session - invalid access
      authError = 'Invalid reset link. Please request a new password reset.';
      checkingAuth = false;
      setTimeout(() => {
        goto('/login');
      }, 3000);
    }
  });
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
          Reset your password
        </h1>
        <p class="text-sm sm:text-base" style="color: var(--text-secondary);">
          Enter your new password below
        </p>
      </div>
    </div>

    {#if checkingAuth}
      <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8" style="border: 1px solid var(--border-light);">
        <div class="text-center space-y-3">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--golden);"></div>
          <p class="text-sm" style="color: var(--text-secondary);">Verifying your reset link...</p>
        </div>
      </div>
    {:else if authError}
      <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8" style="border: 1px solid var(--border-light);">
        <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
          {authError}
        </div>
        <p class="text-sm mt-4 text-center" style="color: var(--text-secondary);">Redirecting to login...</p>
      </div>
    {:else if hasValidSession}
    <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8" style="border: 1px solid var(--border-light);">
      <form
        method="POST"
        action="?/resetPassword"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
        class="space-y-5"
      >
        {#if form?.error}
          <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
            {form.error}
          </div>
        {/if}

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium" style="color: var(--text-secondary);">
            New password
          </label>
          <div class="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              bind:value={password}
              required
              minlength="6"
              autocomplete="new-password"
              class="w-full px-4 py-3 pr-12 rounded-xl text-sm sm:text-base input-themed"
              placeholder="••••••••"
            />
            <button
              type="button"
              on:click={() => showPassword = !showPassword}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style="color: var(--text-tertiary);"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <p class="text-xs" style="color: var(--text-tertiary);">Must be at least 6 characters</p>
        </div>

        <div class="space-y-2">
          <label for="confirmPassword" class="block text-sm font-medium" style="color: var(--text-secondary);">
            Confirm new password
          </label>
          <div class="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              bind:value={confirmPassword}
              required
              minlength="6"
              autocomplete="new-password"
              class="w-full px-4 py-3 pr-12 rounded-xl text-sm sm:text-base input-themed"
              placeholder="••••••••"
            />
            <button
              type="button"
              on:click={() => showConfirmPassword = !showConfirmPassword}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style="color: var(--text-tertiary);"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || password !== confirmPassword || password.length < 6}
          class="w-full btn-primary py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm sm:text-base min-h-[48px]"
        >
          {loading ? 'Resetting password...' : 'Reset password'}
        </button>
      </form>
    </div>

    <div class="text-center">
      <a
        href="/login"
        class="text-sm transition-colors"
        style="color: var(--text-secondary);"
      >
        Back to login
      </a>
    </div>
    {/if}
  </div>
</div>
