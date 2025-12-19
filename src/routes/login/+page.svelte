<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let loading = false;
</script>

<div class="max-w-md mx-auto">
  <div class="space-y-6 sm:space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
        Welcome back
      </h1>
      <p class="text-sm sm:text-base text-gray-600">
        Sign in to continue your learning journey
      </p>
    </div>

    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
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
        {#if form?.error}
          <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
            {form.error}
          </div>
        {/if}

        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-sm sm:text-base"
            placeholder="you@example.com"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-sm sm:text-base"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm sm:text-base min-h-[48px]"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>

    <p class="text-center text-sm text-gray-600">
      Need access? Contact your administrator for an account.
    </p>
  </div>
</div>
