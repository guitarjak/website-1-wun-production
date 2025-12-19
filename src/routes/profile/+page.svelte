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
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-blue-600';
    if (percentage >= 25) return 'text-yellow-600';
    return 'text-gray-600';
  }

  function getProgressBarColor(percentage: number) {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  }
</script>

<div class="max-w-2xl mx-auto">
  <div class="space-y-6 sm:space-y-8">
    <div>
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
        Your Profile
      </h1>
      <p class="mt-2 text-sm sm:text-base text-gray-600">
        View your account details and learning progress
      </p>
    </div>

    {#if profile}
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 sm:p-8 space-y-6">
          <div class="space-y-4">
            <div class="pb-4 border-b border-gray-100">
              <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Full Name
              </h2>
              <p class="text-base sm:text-lg text-gray-900">
                {profile.full_name || 'Not set'}
              </p>
            </div>

            <div class="pb-4 border-b border-gray-100">
              <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Email Address
              </h2>
              <p class="text-base sm:text-lg text-gray-900 break-all">
                {profile.email}
              </p>
            </div>

            <div>
              <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Role
              </h2>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-900 capitalize">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Statistics -->
      {#if stats}
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">Learning Statistics</h2>
          </div>

          <div class="p-6 space-y-6">
            <!-- Progress Overview -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Course Progress</span>
                <span class="text-2xl font-bold {getProgressColor(stats.progressPercentage)}">
                  {stats.progressPercentage}%
                </span>
              </div>
              <div class="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="h-full {getProgressBarColor(stats.progressPercentage)} transition-all duration-500"
                  style="width: {stats.progressPercentage}%"
                ></div>
              </div>
              <p class="text-sm text-gray-600 mt-2">
                {stats.completedLessons} of {stats.totalLessons} lessons completed
              </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs font-medium text-gray-500 uppercase">Completed</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
                <p class="text-xs text-gray-600 mt-0.5">Lessons</p>
              </div>

              <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span class="text-xs font-medium text-gray-500 uppercase">Remaining</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">{stats.totalLessons - stats.completedLessons}</p>
                <p class="text-xs text-gray-600 mt-0.5">Lessons</p>
              </div>
            </div>

            <!-- Activity Info -->
            <div class="space-y-3 pt-4 border-t border-gray-100">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Enrolled</span>
                <span class="text-sm font-medium text-gray-900">{formatDate(stats.enrolledAt)}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Last Activity</span>
                <span class="text-sm font-medium text-gray-900">{formatDate(stats.lastActivity)}</span>
              </div>
            </div>

            <!-- Continue Learning Button -->
            <a
              href="/course"
              data-sveltekit-preload-data="hover"
              class="block w-full text-center px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-black transition-all shadow-sm"
            >
              Continue Learning
            </a>
          </div>
        </div>
      {:else}
        <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
          <div class="text-center space-y-2">
            <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">No Course Enrolled</h3>
            <p class="text-sm text-gray-600 max-w-sm mx-auto">
              You haven't enrolled in any courses yet.
            </p>
          </div>
        </div>
      {/if}
    {:else}
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div class="text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    {/if}
  </div>
</div>
