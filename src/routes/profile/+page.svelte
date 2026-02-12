<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: profile = data.profile;
  $: stats = data.stats;

  function formatDate(dateString: string | null) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getProgressColor(percentage: number) {
    if (percentage >= 75) return 'var(--success)';
    if (percentage >= 50) return 'var(--blue)';
    if (percentage >= 25) return 'var(--golden)';
    return 'var(--text-tertiary)';
  }

  function getProgressBarColor(percentage: number) {
    if (percentage >= 75) return 'var(--success)';
    if (percentage >= 50) return 'var(--blue)';
    if (percentage >= 25) return 'var(--golden)';
    return 'var(--text-tertiary)';
  }
</script>

<div class="max-w-2xl mx-auto">
  <div class="space-y-6 sm:space-y-8">
    <div>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight" style="color: var(--text-primary);">
        Your Profile
      </h1>
      <p class="mt-2 text-sm sm:text-base" style="color: var(--text-secondary);">
        View your account details and learning progress
      </p>
    </div>

    {#if profile}
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden" style="border: 1px solid var(--border-light);">
        <div class="p-6 sm:p-8 space-y-6">
          <div class="space-y-4">
            <div class="pb-4" style="border-bottom: 1px solid var(--border-light);">
              <h2 class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: var(--text-tertiary);">
                Full Name
              </h2>
              <p class="text-base sm:text-lg" style="color: var(--text-primary);">
                {profile.full_name || 'Not set'}
              </p>
            </div>

            <div class="pb-4" style="border-bottom: 1px solid var(--border-light);">
              <h2 class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: var(--text-tertiary);">
                Email Address
              </h2>
              <p class="text-base sm:text-lg break-all" style="color: var(--text-primary);">
                {profile.email}
              </p>
            </div>

            <div>
              <h2 class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: var(--text-tertiary);">
                Role
              </h2>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize" style="background-color: var(--bg-secondary); color: var(--text-primary);">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Statistics -->
      {#if stats}
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden" style="border: 1px solid var(--border-light);">
          <div class="px-6 py-4" style="border-bottom: 1px solid var(--border-light);">
            <h2 class="text-lg font-semibold" style="color: var(--text-primary);">Learning Statistics</h2>
          </div>

          <div class="p-6 space-y-6">
            <!-- Progress Overview -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium" style="color: var(--text-secondary);">Course Progress</span>
                <span class="text-2xl font-bold" style="color: {getProgressColor(stats.progressPercentage)};">
                  {stats.progressPercentage}%
                </span>
              </div>
              <div class="h-3 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);">
                <div
                  class="h-full transition-all duration-500 rounded-full"
                  style="width: {stats.progressPercentage}%; background-color: {getProgressBarColor(stats.progressPercentage)};"
                ></div>
              </div>
              <p class="text-sm mt-2" style="color: var(--text-secondary);">
                {stats.completedLessons} of {stats.totalLessons} lessons completed
              </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl p-4" style="background-color: var(--bg-secondary);">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs font-medium uppercase" style="color: var(--text-tertiary);">Completed</span>
                </div>
                <p class="text-2xl font-bold" style="color: var(--text-primary);">{stats.completedLessons}</p>
                <p class="text-xs mt-0.5" style="color: var(--text-secondary);">Lessons</p>
              </div>

              <div class="rounded-xl p-4" style="background-color: var(--bg-secondary);">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span class="text-xs font-medium uppercase" style="color: var(--text-tertiary);">Remaining</span>
                </div>
                <p class="text-2xl font-bold" style="color: var(--text-primary);">{stats.totalLessons - stats.completedLessons}</p>
                <p class="text-xs mt-0.5" style="color: var(--text-secondary);">Lessons</p>
              </div>
            </div>

            <!-- Activity Info -->
            <div class="space-y-3 pt-4" style="border-top: 1px solid var(--border-light);">
              <div class="flex items-center justify-between">
                <span class="text-sm" style="color: var(--text-secondary);">Enrolled</span>
                <span class="text-sm font-medium" style="color: var(--text-primary);">{formatDate(stats.enrolledAt)}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm" style="color: var(--text-secondary);">Last Activity</span>
                <span class="text-sm font-medium" style="color: var(--text-primary);">{formatDate(stats.lastActivity)}</span>
              </div>
            </div>

            <!-- Continue Learning Button -->
            <a
              href="/course"
              data-sveltekit-preload-data="hover"
              class="block w-full text-center px-4 py-3 text-sm font-medium btn-primary rounded-xl transition-all shadow-sm"
            >
              Continue Learning
            </a>
          </div>
        </div>
      {:else}
        <div class="rounded-2xl p-6 sm:p-8" style="background-color: var(--bg-secondary); border: 1px solid var(--border-light);">
          <div class="text-center space-y-2">
            <svg class="mx-auto h-10 w-10" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 class="text-base sm:text-lg font-semibold" style="color: var(--text-primary);">No Course Enrolled</h3>
            <p class="text-sm max-w-sm mx-auto" style="color: var(--text-secondary);">
              You haven't enrolled in any courses yet.
            </p>
          </div>
        </div>
      {/if}
    {:else}
      <div class="bg-white rounded-2xl shadow-sm p-8" style="border: 1px solid var(--border-light);">
        <div class="text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto" style="border-color: var(--golden);"></div>
          <p class="mt-4" style="color: var(--text-secondary);">Loading profile...</p>
        </div>
      </div>
    {/if}
  </div>
</div>
