<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: userCount = data.userCount || 0;
</script>

<div class="max-w-4xl mx-auto">
  <div class="space-y-6 sm:space-y-8">
    <div>
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
        Admin Dashboard
      </h1>
      <p class="mt-2 text-sm sm:text-base text-gray-600">
        Monitor platform activity, manage content, and view analytics
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="/admin/course-editor"
          class="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
        >
          <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900">Edit Course Content</div>
            <div class="text-xs text-gray-600">Manage lessons and modules</div>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/course"
          class="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
        >
          <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900">Preview Course</div>
            <div class="text-xs text-gray-600">View as student</div>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <a
        href="/manage-users"
        data-sveltekit-preload-data="hover"
        class="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 hover:border-gray-300 hover:shadow-md transition-all group cursor-pointer"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-gray-700 transition-colors">Total Users</h2>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p class="text-3xl sm:text-4xl font-bold text-gray-900">{userCount}</p>
      </a>

      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Courses</h2>
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="text-3xl sm:text-4xl font-bold text-gray-900">0</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lessons</h2>
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-3xl sm:text-4xl font-bold text-gray-900">0</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completion</h2>
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p class="text-3xl sm:text-4xl font-serif text-gray-900">0%</p>
      </div>
    </div>
  </div>
</div>
