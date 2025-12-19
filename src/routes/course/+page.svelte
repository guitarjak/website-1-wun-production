<script lang="ts">
  import type { PageData } from './$types';
  import type { Lesson, Module } from '../../../app.d';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import RenderContent from '$lib/components/RenderContent.svelte';

  export let data: PageData;

  $: course = data.course;
  $: modules = data.modules || [];
  $: isAdmin = data.profile?.role === 'admin';
  $: totalLessons = data.totalLessons || 0;

  // Local state for completed lessons
  let localCompletedLessonIds = data.completedLessonIds || [];

  $: if (data.completedLessonIds) {
    localCompletedLessonIds = [...data.completedLessonIds];
  }

  // Calculate progress
  $: completedCount = localCompletedLessonIds.length;
  $: progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Flatten lessons and select
  $: allLessons = modules.flatMap((m) => m.lessons);
  let selectedLesson: Lesson | null = null;

  // Calculate next lesson
  $: currentLessonIndex = selectedLesson ? allLessons.findIndex(l => l.id === selectedLesson.id) : -1;
  $: nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
    ? allLessons[currentLessonIndex + 1]
    : null;

  // Determine which lessons are unlocked (sequential unlocking)
  $: unlockedLessonIds = (() => {
    const unlocked = new Set<string>();

    // Admins can access all lessons
    if (isAdmin) {
      allLessons.forEach(lesson => unlocked.add(lesson.id));
      return unlocked;
    }

    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];

      // First lesson is always unlocked
      if (i === 0) {
        unlocked.add(lesson.id);
        continue;
      }

      // Check if previous lesson is completed
      const previousLesson = allLessons[i - 1];
      if (localCompletedLessonIds.includes(previousLesson.id)) {
        unlocked.add(lesson.id);
      } else {
        // If previous lesson not completed, stop unlocking
        break;
      }
    }

    return unlocked;
  })();

  // Check if next lesson is unlocked
  $: isNextLessonUnlocked = nextLesson ? unlockedLessonIds.has(nextLesson.id) : false;

  // Mobile lesson drawer
  let showLessonDrawer = false;

  // Success notification
  let showSuccess = false;

  // Reactive lesson selection based on URL parameters
  $: {
    const lessonSlug = $page.url.searchParams.get('lesson');
    const lessonId = $page.url.searchParams.get('lessonId');

    if (allLessons.length > 0) {
      let newLesson: Lesson | null = null;

      // Try to find lesson by ID first
      if (lessonId) {
        newLesson = allLessons.find((l) => l.id === lessonId) || null;
      }

      // Try by slug
      if (!newLesson && lessonSlug) {
        newLesson = allLessons.find((l) => l.slug === lessonSlug) || null;
      }

      // Auto-select first lesson if no specific lesson requested
      if (!newLesson && !lessonId && !lessonSlug) {
        newLesson = allLessons[0];
      }

      // Check if the lesson is unlocked, if not, select the first unlocked lesson
      if (newLesson && !unlockedLessonIds.has(newLesson.id)) {
        // Find the first unlocked lesson instead
        newLesson = allLessons.find(l => unlockedLessonIds.has(l.id)) || allLessons[0];
      }

      // Only update if different to avoid unnecessary re-renders
      if (newLesson && newLesson.id !== selectedLesson?.id) {
        selectedLesson = newLesson;
      } else if (!newLesson && !lessonId && !lessonSlug && allLessons.length > 0 && !selectedLesson) {
        selectedLesson = allLessons[0];
      }
    }
  }

  onMount(() => {
    const saved = $page.url.searchParams.get('saved');

    // Show success notification
    if (saved === 'true') {
      showSuccess = true;
      const url = new URL($page.url);
      url.searchParams.delete('saved');
      goto(url.toString(), { replaceState: true, noScroll: true });

      setTimeout(() => {
        showSuccess = false;
      }, 3000);
    }
  });

  function selectLesson(lesson: Lesson) {
    // Prevent selecting locked lessons
    if (!unlockedLessonIds.has(lesson.id)) {
      return;
    }

    // Update URL to trigger reactive selection
    const url = new URL($page.url);
    url.searchParams.set('lessonId', lesson.id);
    goto(url.toString(), { noScroll: true });
    showLessonDrawer = false;
  }
</script>

{#if !course}
  <div class="max-w-3xl mx-auto py-8">
    <div class="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 class="text-lg font-bold text-red-900 mb-2">No Course Found</h2>
      <p class="text-sm sm:text-base text-red-700">
        We couldn't find the course you're looking for. Please contact support if this problem persists.
      </p>
    </div>
  </div>
{:else if allLessons.length === 0}
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
      <!-- Sidebar -->
      <aside class="hidden lg:block">
        <div class="bg-white rounded-2xl shadow-sm p-5" style="border: 1px solid var(--border-light);">
          <div class="mb-4">
            <h2 class="text-lg font-bold mb-1" style="color: var(--text-primary);">
              {course.title}
            </h2>
            {#if course.subtitle}
              <p class="text-sm" style="color: var(--text-secondary);">
                {course.subtitle}
              </p>
            {/if}
          </div>
          <p class="text-sm italic" style="color: var(--text-tertiary);">No lessons available yet.</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main>
        <div class="bg-white rounded-2xl shadow-sm p-8 sm:p-12" style="border: 1px solid var(--border-light);">
          <div class="text-center space-y-4">
            <svg
              class="mx-auto h-12 w-12"
              style="color: var(--text-tertiary);"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h2 class="text-xl font-bold" style="color: var(--text-primary);">
              No Lessons Yet
            </h2>
            <p class="text-sm sm:text-base max-w-md mx-auto" style="color: var(--text-secondary);">
              Lessons will appear here once they are created and published.
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
{:else}
  <div class="max-w-7xl mx-auto -mt-6 lg:-mt-4">
    <!-- Success Notification -->
    {#if showSuccess}
      <div class="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
        <div class="bg-green-50 border border-green-200 rounded-xl shadow-lg p-4 flex items-center gap-3">
          <svg class="w-5 h-5" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-sm font-semibold text-green-900">Progress updated!</span>
          <button
            on:click={() => showSuccess = false}
            class="ml-2 hover:opacity-75 transition-opacity"
            style="color: var(--success);"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    {/if}

    <!-- Admin Navigation Buttons (Desktop Only) -->
    {#if isAdmin}
      <div class="hidden lg:flex justify-end gap-3 mb-6">
        <a
          href="/course"
          class="btn-ghost inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </a>
        <a
          href="/admin/course-editor"
          class="btn-secondary inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm text-white"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Course
        </a>
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
      <!-- Desktop Sidebar -->
      <aside class="hidden lg:block">
        <div class="bg-white rounded-2xl shadow-sm p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col" style="border: 1px solid var(--border-light);">
          <!-- Course Info -->
          <div class="mb-4 pb-4" style="border-bottom: 1px solid var(--border-light);">
            <h2 class="text-base font-bold mb-1 leading-tight" style="color: var(--text-primary);">
              {course.title}
            </h2>
            {#if course.subtitle}
              <p class="text-xs leading-snug" style="color: var(--text-secondary);">
                {course.subtitle}
              </p>
            {/if}
          </div>

          <!-- Progress -->
          <div class="mb-4 pb-4" style="border-bottom: 1px solid var(--border-light);">
            <div class="flex items-center justify-between text-xs mb-2" style="color: var(--text-secondary);">
              <span>{completedCount} of {totalLessons}</span>
              <span class="font-semibold">{progress}%</span>
            </div>
            <div class="h-1.5 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);">
              <div class="h-full transition-all duration-500" style="width: {progress}%; background-color: var(--golden);"></div>
            </div>
          </div>

          <!-- Lessons List -->
          <nav class="space-y-3 overflow-y-auto flex-1">
            {#each modules as module, moduleIndex}
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--text-tertiary);">
                  {module.title}
                </h3>

                {#if module.lessons.length > 0}
                  <ul class="space-y-1">
                    {#each module.lessons as lesson}
                      {@const isCompleted = localCompletedLessonIds.includes(lesson.id)}
                      {@const isUnlocked = unlockedLessonIds.has(lesson.id)}
                      <li>
                        <button
                          type="button"
                          on:click={() => selectLesson(lesson)}
                          disabled={!isUnlocked}
                          class="w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-2 font-medium"
                          style="{selectedLesson?.id === lesson.id
                            ? 'background-color: var(--blue); color: white;'
                            : isUnlocked
                              ? 'color: var(--text-primary);'
                              : 'color: var(--text-tertiary); cursor: not-allowed; opacity: 0.6;'}"
                          on:mouseenter={(e) => {
                            if (isUnlocked && selectedLesson?.id !== lesson.id) {
                              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                            }
                          }}
                          on:mouseleave={(e) => {
                            if (selectedLesson?.id !== lesson.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <span class="flex-1 truncate text-xs leading-snug">{lesson.title}</span>
                          {#if isCompleted}
                            <svg class="w-4 h-4 flex-shrink-0" style="color: var(--success);" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                          {:else if !isUnlocked}
                            <svg class="w-4 h-4 flex-shrink-0" style="color: var(--text-tertiary);" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                            </svg>
                          {/if}
                        </button>
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <p class="text-xs italic pl-3" style="color: var(--text-tertiary);">No lessons</p>
                {/if}
              </div>
            {/each}
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main>
        {#if selectedLesson}
          {@const isLessonCompleted = localCompletedLessonIds.includes(selectedLesson.id)}

          <!-- Mobile: Progress + Lesson Selector -->
          <div class="lg:hidden mb-4 space-y-3">
            <!-- Progress Bar -->
            <div class="bg-white rounded-xl shadow-sm p-4" style="border: 1px solid var(--border-light);">
              <div class="flex items-center justify-between text-xs mb-2" style="color: var(--text-secondary);">
                <span class="font-semibold">{completedCount} of {totalLessons} completed</span>
                <span class="font-bold">{progress}%</span>
              </div>
              <div class="h-2 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);">
                <div class="h-full transition-all duration-500" style="width: {progress}%; background-color: var(--golden);"></div>
              </div>
            </div>

            <!-- Lesson Selector Button -->
            <button
              on:click={() => showLessonDrawer = true}
              class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              style="border: 1px solid var(--border-light); color: var(--text-primary);"
            >
              <span class="flex items-center gap-2 flex-1 min-w-0">
                <svg class="w-5 h-5 flex-shrink-0" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span class="truncate">{selectedLesson.title}</span>
              </span>
              <svg class="w-5 h-5 flex-shrink-0 ml-2" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <!-- Mobile Lesson Drawer -->
          {#if showLessonDrawer}
            <div class="fixed inset-0 z-50 lg:hidden">
              <!-- Backdrop -->
              <div
                class="absolute inset-0 bg-black/40 backdrop-blur-sm"
                on:click={() => showLessonDrawer = false}
                on:keydown={(e) => e.key === 'Escape' && (showLessonDrawer = false)}
                role="button"
                tabindex="0"
              ></div>

              <!-- Drawer -->
              <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">{course.title}</h3>
                    <p class="text-xs text-gray-600 mt-0.5">{completedCount} of {totalLessons} completed • {progress}%</p>
                  </div>
                  <button
                    on:click={() => showLessonDrawer = false}
                    class="ml-3 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 flex-shrink-0"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Lesson List -->
                <div class="overflow-y-auto p-4 space-y-4">
                  {#each modules as module}
                    <div>
                      <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                        {module.title}
                      </h4>
                      {#if module.lessons.length > 0}
                        <div class="space-y-1">
                          {#each module.lessons as lesson}
                            {@const isCompleted = localCompletedLessonIds.includes(lesson.id)}
                            {@const isUnlocked = unlockedLessonIds.has(lesson.id)}
                            <button
                              on:click={() => selectLesson(lesson)}
                              disabled={!isUnlocked}
                              class="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 {selectedLesson?.id === lesson.id
                                ? 'bg-gray-900 text-white font-medium'
                                : isUnlocked
                                  ? 'text-gray-700 hover:bg-gray-100'
                                  : 'text-gray-400 cursor-not-allowed opacity-60'}"
                            >
                              <span class="flex-1 text-sm">{lesson.title}</span>
                              {#if isCompleted}
                                <svg class="w-5 h-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                              {:else if !isUnlocked}
                                <svg class="w-5 h-5 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                                </svg>
                              {/if}
                            </button>
                          {/each}
                        </div>
                      {:else}
                        <p class="text-xs text-gray-400 italic px-4">No lessons</p>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/if}

          <!-- Lesson Content Card -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden" style="border: 1px solid var(--border-light);">
            <!-- Desktop: Header with progress and completion button -->
            <div class="hidden lg:flex items-start justify-between p-6 pb-4" style="border-bottom: 1px solid var(--border-light);">
              <div class="flex-1 min-w-0">
                <p class="text-xs mb-1" style="color: var(--text-tertiary);">{course.title}</p>
                <h1 class="text-2xl lg:text-3xl font-bold tracking-tight leading-tight" style="color: var(--text-primary);">
                  {selectedLesson.title}
                </h1>
              </div>

              <!-- Action Buttons (Desktop) -->
              <div class="ml-4 flex-shrink-0 flex items-center gap-2">
                <!-- Mark Complete Button -->
                <form
                  method="POST"
                  action="?/toggleCompletion"
                  use:enhance={() => {
                    const lessonId = selectedLesson.id;
                    const isCurrentlyCompleted = localCompletedLessonIds.includes(lessonId);

                    if (isCurrentlyCompleted) {
                      localCompletedLessonIds = localCompletedLessonIds.filter(id => id !== lessonId);
                    } else {
                      localCompletedLessonIds = [...localCompletedLessonIds, lessonId];
                    }

                    return async ({ result }) => {
                      if (result.type === 'failure') {
                        if (isCurrentlyCompleted) {
                          localCompletedLessonIds = [...localCompletedLessonIds, lessonId];
                        } else {
                          localCompletedLessonIds = localCompletedLessonIds.filter(id => id !== lessonId);
                        }
                      }
                    };
                  }}
                >
                  <input type="hidden" name="lessonId" value={selectedLesson.id} />
                  <input type="hidden" name="isCompleted" value={isLessonCompleted ? 'true' : 'false'} />

                  <button
                    type="submit"
                    class="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold border transition-all shadow-sm {isLessonCompleted
                      ? 'badge-success'
                      : 'btn-ghost'}"
                    style="{isLessonCompleted
                      ? 'border-color: var(--success); color: var(--success);'
                      : ''}"
                  >
                    {#if isLessonCompleted}
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Completed
                    {:else}
                      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Mark Complete
                    {/if}
                  </button>
                </form>

                <!-- Next Lesson Button -->
                {#if nextLesson && isNextLessonUnlocked}
                  <a
                    href="/course?lessonId={nextLesson.id}"
                    data-sveltekit-preload-data="hover"
                    class="btn-primary inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all shadow-sm"
                  >
                    Next Lesson
                    <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                {/if}
              </div>
            </div>

            <!-- Mobile: Lesson title -->
            <div class="lg:hidden p-4 pb-3" style="border-bottom: 1px solid var(--border-light);">
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight" style="color: var(--text-primary);">
                {selectedLesson.title}
              </h1>
            </div>

            <!-- Video Player -->
            <div class="lg:p-6 lg:pt-4">
              {#if selectedLesson.video_embed_html}
                <div class="aspect-video w-full lg:rounded-xl overflow-hidden bg-black relative">
                  <div class="absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:top-0 [&>iframe]:left-0">
                    {@html selectedLesson.video_embed_html}
                  </div>
                </div>
              {:else}
                <div class="aspect-video w-full lg:rounded-xl overflow-hidden flex items-center justify-center" style="background-color: var(--bg-secondary); border: 1px solid var(--border-light);">
                  <div class="text-center p-6">
                    <svg
                      class="mx-auto h-10 w-10 mb-3"
                      style="color: var(--text-tertiary);"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p class="text-sm" style="color: var(--text-secondary);">
                      No video available for this lesson
                    </p>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Lesson Content -->
            <div class="p-4 sm:p-6 lg:px-6 lg:pb-8">
              <!-- Mobile: Action Buttons -->
              <div class="lg:hidden mb-6 space-y-3">
                <!-- Mark Complete Button -->
                <form
                  method="POST"
                  action="?/toggleCompletion"
                  use:enhance={() => {
                    const lessonId = selectedLesson.id;
                    const isCurrentlyCompleted = localCompletedLessonIds.includes(lessonId);

                    if (isCurrentlyCompleted) {
                      localCompletedLessonIds = localCompletedLessonIds.filter(id => id !== lessonId);
                    } else {
                      localCompletedLessonIds = [...localCompletedLessonIds, lessonId];
                    }

                    return async ({ result }) => {
                      if (result.type === 'failure') {
                        if (isCurrentlyCompleted) {
                          localCompletedLessonIds = [...localCompletedLessonIds, lessonId];
                        } else {
                          localCompletedLessonIds = localCompletedLessonIds.filter(id => id !== lessonId);
                        }
                      }
                    };
                  }}
                  class="w-full"
                >
                  <input type="hidden" name="lessonId" value={selectedLesson.id} />
                  <input type="hidden" name="isCompleted" value={isLessonCompleted ? 'true' : 'false'} />

                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold border transition-all shadow-sm min-h-[48px] {isLessonCompleted
                      ? 'badge-success'
                      : 'btn-secondary text-white'}"
                    style="{isLessonCompleted
                      ? 'border-color: var(--success); color: var(--success);'
                      : ''}"
                  >
                    {#if isLessonCompleted}
                      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Completed
                    {:else}
                      <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Complete
                    {/if}
                  </button>
                </form>

                <!-- Next Lesson Button -->
                {#if nextLesson && isNextLessonUnlocked}
                  <a
                    href="/course?lessonId={nextLesson.id}"
                    data-sveltekit-preload-data="hover"
                    class="btn-primary w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all shadow-sm min-h-[48px]"
                  >
                    Next Lesson
                    <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                {/if}
              </div>

              <!-- Written Content -->
              <div class="prose prose-sm sm:prose max-w-none">
                <RenderContent content={selectedLesson.content_json} />
              </div>
            </div>
          </div>
        {/if}
      </main>
    </div>
  </div>
{/if}
