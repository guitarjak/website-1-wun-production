<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: users = data.users || [];
  $: totalLessons = data.totalLessons || 0;

  // Search filter
  let searchQuery = '';
  $: filteredUsers = searchQuery.trim()
    ? users.filter(u => {
        const q = searchQuery.toLowerCase();
        return (u.fullName?.toLowerCase().includes(q)) || u.email.toLowerCase().includes(q);
      })
    : users;

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

<div class="max-w-7xl mx-auto">
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight" style="color: var(--text-primary);">
          Manage Users
        </h1>
        <p class="mt-2 text-sm sm:text-base" style="color: var(--text-secondary);">
          View all users and their course progress
        </p>
      </div>
      <a
        href="/admin-dashboard"
        data-sveltekit-preload-data="hover"
        class="inline-flex items-center px-4 py-2 text-sm font-medium btn-ghost rounded-xl transition-all shadow-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </a>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl shadow-sm p-4" style="border: 1px solid var(--border-light);">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: var(--bg-secondary);">
            <svg class="w-5 h-5" style="color: var(--text-secondary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold" style="color: var(--text-primary);">{users.length}</p>
            <p class="text-xs" style="color: var(--text-secondary);">Total Users</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-4" style="border: 1px solid var(--border-light);">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: rgba(16, 185, 129, 0.1);">
            <svg class="w-5 h-5" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold" style="color: var(--text-primary);">
              {users.filter(u => u.enrolledAt).length}
            </p>
            <p class="text-xs" style="color: var(--text-secondary);">Enrolled Users</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-4" style="border: 1px solid var(--border-light);">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: rgba(74, 113, 246, 0.1);">
            <svg class="w-5 h-5" style="color: var(--blue);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold" style="color: var(--text-primary);">{totalLessons}</p>
            <p class="text-xs" style="color: var(--text-secondary);">Total Lessons</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search by name or email..."
        class="w-full pl-12 pr-4 py-3 rounded-xl text-sm input-themed"
      />
      {#if searchQuery}
        <button
          on:click={() => searchQuery = ''}
          class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
          style="color: var(--text-tertiary);"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}
    </div>

    {#if searchQuery && filteredUsers.length === 0}
      <div class="bg-white rounded-2xl shadow-sm p-8 text-center" style="border: 1px solid var(--border-light);">
        <svg class="mx-auto h-12 w-12 mb-3" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-sm" style="color: var(--text-secondary);">No users matching "{searchQuery}"</p>
      </div>
    {:else}
      <!-- Users Table -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden" style="border: 1px solid var(--border-light);">
        <!-- Mobile Cards View -->
        <div class="lg:hidden divide-y" style="border-color: var(--border-light);">
          {#if filteredUsers.length === 0}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p class="mt-4 text-sm" style="color: var(--text-secondary);">No users found</p>
            </div>
          {:else}
            {#each filteredUsers as user}
              <div class="p-4 space-y-3">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold truncate" style="color: var(--text-primary);">
                      {user.fullName || 'No name'}
                    </p>
                    <p class="text-xs truncate" style="color: var(--text-secondary);">{user.email}</p>
                    <span class="inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs font-medium"
                      style="background-color: {user.role === 'admin' ? 'rgba(74, 113, 246, 0.1)' : 'var(--bg-secondary)'}; color: {user.role === 'admin' ? 'var(--blue)' : 'var(--text-secondary)'};">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span style="color: var(--text-secondary);">Progress</span>
                    <span class="font-medium px-2 py-0.5 rounded" style="color: {getProgressColor(user.progressPercentage)};">
                      {user.progressPercentage}%
                    </span>
                  </div>
                  <div class="h-2 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);">
                    <div
                      class="h-full transition-all duration-500 rounded-full"
                      style="width: {user.progressPercentage}%; background-color: {getProgressBarColor(user.progressPercentage)};"
                    ></div>
                  </div>
                  <p class="text-xs" style="color: var(--text-secondary);">
                    {user.completedLessons} / {user.totalLessons} lessons completed
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-2" style="border-top: 1px solid var(--border-light);">
                  <div>
                    <p class="text-xs" style="color: var(--text-tertiary);">Enrolled</p>
                    <p class="text-xs font-medium" style="color: var(--text-primary);">{formatDate(user.enrolledAt)}</p>
                  </div>
                  <div>
                    <p class="text-xs" style="color: var(--text-tertiary);">Last Activity</p>
                    <p class="text-xs font-medium" style="color: var(--text-primary);">{formatDate(user.lastActivity)}</p>
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </div>

        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="min-w-full">
            <thead style="background-color: var(--bg-secondary);">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">
                  User
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">
                  Role
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">
                  Progress
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">
                  Enrolled
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              {#if filteredUsers.length === 0}
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center">
                    <svg class="mx-auto h-12 w-12" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p class="mt-4 text-sm" style="color: var(--text-secondary);">No users found</p>
                  </td>
                </tr>
              {:else}
                {#each filteredUsers as user}
                  <tr class="transition-colors" style="border-bottom: 1px solid var(--border-light);"
                    on:mouseenter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    on:mouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" style="background-color: var(--bg-tertiary);">
                          <span class="text-sm font-medium" style="color: var(--text-secondary);">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium" style="color: var(--text-primary);">
                            {user.fullName || 'No name'}
                          </div>
                          <div class="text-sm" style="color: var(--text-tertiary);">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style="background-color: {user.role === 'admin' ? 'rgba(74, 113, 246, 0.1)' : 'var(--bg-secondary)'}; color: {user.role === 'admin' ? 'var(--blue)' : 'var(--text-secondary)'};">
                        {user.role}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="space-y-1">
                        <div class="flex items-center justify-between">
                          <span class="text-sm font-medium" style="color: {getProgressColor(user.progressPercentage)};">
                            {user.progressPercentage}%
                          </span>
                        </div>
                        <div class="w-32 h-2 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);">
                          <div
                            class="h-full transition-all duration-500 rounded-full"
                            style="width: {user.progressPercentage}%; background-color: {getProgressBarColor(user.progressPercentage)};"
                          ></div>
                        </div>
                        <p class="text-xs" style="color: var(--text-tertiary);">
                          {user.completedLessons} / {user.totalLessons} lessons
                        </p>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-secondary);">
                      {formatDate(user.enrolledAt)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-secondary);">
                      {formatDate(user.lastActivity)}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>
</div>
