<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: users = data.users || [];
  $: totalLessons = data.totalLessons || 0;

  function formatDate(dateString: string | null) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getProgressColor(percentage: number) {
    if (percentage >= 75) return 'text-green-600 bg-green-50';
    if (percentage >= 50) return 'text-blue-600 bg-blue-50';
    if (percentage >= 25) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  }

  function getProgressBarColor(percentage: number) {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  }
</script>

<div class="max-w-7xl mx-auto">
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Manage Users
        </h1>
        <p class="mt-2 text-sm sm:text-base text-gray-600">
          View all users and their course progress
        </p>
      </div>
      <a
        href="/admin-dashboard"
        data-sveltekit-preload-data="hover"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </a>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{users.length}</p>
            <p class="text-xs text-gray-600">Total Users</p>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">
              {users.filter(u => u.enrolledAt).length}
            </p>
            <p class="text-xs text-gray-600">Enrolled Users</p>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{totalLessons}</p>
            <p class="text-xs text-gray-600">Total Lessons</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <!-- Mobile Cards View -->
      <div class="lg:hidden divide-y divide-gray-100">
        {#if users.length === 0}
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p class="mt-4 text-sm text-gray-600">No users found</p>
          </div>
        {:else}
          {#each users as user}
            <div class="p-4 space-y-3">
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">
                    {user.fullName || 'No name'}
                  </p>
                  <p class="text-xs text-gray-600 truncate">{user.email}</p>
                  <span class="inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs font-medium {user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                    {user.role}
                  </span>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-600">Progress</span>
                  <span class="font-medium {getProgressColor(user.progressPercentage)} px-2 py-0.5 rounded">
                    {user.progressPercentage}%
                  </span>
                </div>
                <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    class="h-full {getProgressBarColor(user.progressPercentage)} transition-all duration-500"
                    style="width: {user.progressPercentage}%"
                  ></div>
                </div>
                <p class="text-xs text-gray-600">
                  {user.completedLessons} / {user.totalLessons} lessons completed
                </p>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <div>
                  <p class="text-xs text-gray-500">Enrolled</p>
                  <p class="text-xs font-medium text-gray-900">{formatDate(user.enrolledAt)}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Last Activity</p>
                  <p class="text-xs font-medium text-gray-900">{formatDate(user.lastActivity)}</p>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrolled
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#if users.length === 0}
              <tr>
                <td colspan="5" class="px-6 py-12 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p class="mt-4 text-sm text-gray-600">No users found</p>
                </td>
              </tr>
            {:else}
              {#each users as user}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {user.fullName || 'No name'}
                        </div>
                        <div class="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                      {user.role}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium {getProgressColor(user.progressPercentage)} px-2 py-0.5 rounded">
                          {user.progressPercentage}%
                        </span>
                      </div>
                      <div class="w-32 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          class="h-full {getProgressBarColor(user.progressPercentage)} transition-all duration-500"
                          style="width: {user.progressPercentage}%"
                        ></div>
                      </div>
                      <p class="text-xs text-gray-500">
                        {user.completedLessons} / {user.totalLessons} lessons
                      </p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(user.enrolledAt)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(user.lastActivity)}
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
