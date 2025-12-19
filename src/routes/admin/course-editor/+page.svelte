<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import type { Lesson } from '../../../app.d';
  import RichTextEditor from '$lib/components/RichTextEditor.svelte';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { beforeNavigate } from '$app/navigation';

  export let data: PageData;
  export let form: ActionData;

  $: course = data.course;
  $: modules = data.modules || [];

  // Flatten all lessons
  $: allLessons = modules.flatMap((m) => m.lessons);

  // Use local state for selected lesson (instant selection)
  let selectedLesson: Lesson | null = null;

  // Track editor content separately
  let editorContent: any = null;

  // Track form values for dirty state detection
  let currentTitle = '';
  let currentVideoEmbed = '';

  // Dirty state tracking
  let isDirty = false;

  // Update editorContent when selected lesson changes
  $: if (selectedLesson) {
    editorContent = selectedLesson.content_json;
    currentTitle = selectedLesson.title;
    currentVideoEmbed = selectedLesson.video_embed_html || '';
    isDirty = false; // Reset dirty state when switching lessons
  }

  // Check if form has unsaved changes
  $: if (selectedLesson) {
    isDirty =
      currentTitle !== selectedLesson.title ||
      currentVideoEmbed !== (selectedLesson.video_embed_html || '') ||
      JSON.stringify(editorContent) !== JSON.stringify(selectedLesson.content_json);
  }

  function handleEditorChange(json: any) {
    editorContent = json;
  }

  // Success notification
  let showSuccess = false;
  let successMessage = '';

  // Mobile lesson list drawer
  let showLessonDrawer = false;

  // Modal states
  let showCourseEditModal = false;
  let showModuleModal = false;
  let showLessonModal = false;
  let showDeleteConfirmModal = false;

  // Edit states
  let editingModule: any | null = null; // null = create mode, object = edit mode
  let deletingItem: {type: 'module' | 'lesson', id: string, name: string, lessonCount?: number} | null = null;
  let creatingLessonForModuleId: string | null = null;

  // Modal helper functions
  function openCourseEdit() {
    showCourseEditModal = true;
  }

  function openModuleCreate() {
    editingModule = null;
    showModuleModal = true;
  }

  function openModuleEdit(module: any) {
    editingModule = module;
    showModuleModal = true;
  }

  function openModuleDelete(module: any) {
    const lessonCount = module.lessons?.length || 0;
    deletingItem = {
      type: 'module',
      id: module.id,
      name: module.title,
      lessonCount
    };
    showDeleteConfirmModal = true;
  }

  function openLessonCreate(moduleId: string) {
    creatingLessonForModuleId = moduleId;
    showLessonModal = true;
  }

  function openLessonDelete(lesson: Lesson) {
    deletingItem = {
      type: 'lesson',
      id: lesson.id,
      name: lesson.title
    };
    showDeleteConfirmModal = true;
  }

  function closeAllModals() {
    showCourseEditModal = false;
    showModuleModal = false;
    showLessonModal = false;
    showDeleteConfirmModal = false;
    editingModule = null;
    deletingItem = null;
    creatingLessonForModuleId = null;
  }

  onMount(() => {
    const lessonId = $page.url.searchParams.get('lessonId');
    const saved = $page.url.searchParams.get('saved');

    // Try to find lesson by ID from URL
    if (lessonId && allLessons.length > 0) {
      const lesson = allLessons.find((l) => l.id === lessonId);
      if (lesson) {
        selectedLesson = lesson;
      }
    }

    // Auto-select first lesson if none selected
    if (!selectedLesson && allLessons.length > 0) {
      selectedLesson = allLessons[0];
    }

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

    // Warn on page close/refresh if there are unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });

  // Warn before navigation if dirty
  beforeNavigate(({ cancel }) => {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Leave anyway?')) {
        cancel();
      }
    }
  });

  // Instant lesson selection with unsaved changes warning
  function selectLesson(lesson: Lesson) {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Switch lesson anyway?')) {
        return;
      }
    }
    selectedLesson = lesson;
    showLessonDrawer = false;
  }
</script>

<div class="max-w-7xl mx-auto -mt-6 lg:-mt-4">
  <!-- Success Notification -->
  {#if showSuccess}
    <div class="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div class="bg-green-50 border border-green-200 rounded-xl shadow-lg p-4 flex items-center gap-3">
        <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-sm font-medium text-green-900">{successMessage || 'Changes saved!'}</span>
        <button
          on:click={() => showSuccess = false}
          class="ml-2 text-green-600 hover:text-green-800"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  {/if}

  <!-- Unsaved Changes Indicator -->
  {#if isDirty}
    <div class="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div class="bg-amber-50 border border-amber-200 rounded-xl shadow-lg px-4 py-2 flex items-center gap-2">
        <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="text-xs font-medium text-amber-900">Unsaved changes</span>
      </div>
    </div>
  {/if}

  <!-- Header -->
  <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Course Editor</h1>
      <p class="text-sm text-gray-600 mt-1">Edit lesson content and structure</p>
    </div>
    <div class="flex flex-wrap gap-2 sm:gap-3">
      <a
        href="/course"
        class="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span class="hidden sm:inline">Preview Course</span>
        <span class="sm:hidden">Preview</span>
      </a>
      <a
        href="/admin-dashboard"
        class="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-black transition-all shadow-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span class="hidden sm:inline">Dashboard</span>
        <span class="sm:hidden">Admin</span>
      </a>
    </div>
  </div>

  <!-- Course Info Section -->
  <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">{course.title}</h2>
        {#if course.subtitle}
          <p class="text-gray-600 mt-1">{course.subtitle}</p>
        {/if}
      </div>
      <button
        on:click={openCourseEdit}
        class="ml-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span class="hidden sm:inline">Edit</span>
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block">
      <div class="bg-white border border-gray-200 rounded-2xl p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-900">
            {course?.title || 'Course'}
          </h2>
          <button
            on:click={openModuleCreate}
            class="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-all"
            title="Add Module"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Module</span>
          </button>
        </div>

        <nav class="space-y-3">
          {#each modules as module}
            <div class="group">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {module.title}
                </h3>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    on:click={() => openLessonCreate(module.id)}
                    class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                    title="Add Lesson"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    on:click={() => openModuleEdit(module)}
                    class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                    title="Edit Module"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    on:click={() => openModuleDelete(module)}
                    class="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="Delete Module"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {#if module.lessons.length > 0}
                <ul class="space-y-1">
                  {#each module.lessons as lesson}
                    <li class="group/lesson">
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          on:click={() => selectLesson(lesson)}
                          class="flex-1 text-left px-3 py-2 text-sm rounded-lg transition-all {selectedLesson?.id === lesson.id
                            ? 'bg-gray-900 text-white font-medium'
                            : 'text-gray-700 hover:bg-gray-100'}"
                        >
                          <div class="flex items-center gap-2">
                            <span class="flex-1">{lesson.title}</span>
                            {#if !lesson.is_published}
                              <span class="text-xs px-1.5 py-0.5 rounded {selectedLesson?.id === lesson.id ? 'bg-amber-400/20 text-amber-100' : 'bg-amber-100 text-amber-700'}">
                                Draft
                              </span>
                            {/if}
                          </div>
                        </button>
                        <div class="flex items-center gap-0.5 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                          <form
                            method="post"
                            action="?/togglePublish"
                            use:enhance={() => {
                              return async ({ result }) => {
                                if (result.type === 'success') {
                                  // Update lesson publish status in local state
                                  lesson.is_published = result.data.newStatus;
                                  modules = modules;
                                  successMessage = result.data.newStatus ? 'Lesson published!' : 'Lesson unpublished';
                                  showSuccess = true;
                                  setTimeout(() => {
                                    showSuccess = false;
                                    successMessage = '';
                                  }, 3000);
                                }
                              };
                            }}
                          >
                            <input type="hidden" name="lessonId" value={lesson.id} />
                            <input type="hidden" name="isPublished" value={lesson.is_published} />
                            <button
                              type="submit"
                              class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                              title={lesson.is_published ? 'Unpublish' : 'Publish'}
                            >
                              {#if lesson.is_published}
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              {:else}
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              {/if}
                            </button>
                          </form>
                          <button
                            on:click={() => openLessonDelete(lesson)}
                            class="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                            title="Delete Lesson"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  {/each}
                </ul>
              {:else}
                <p class="text-xs text-gray-400 italic pl-3">No lessons yet</p>
              {/if}
            </div>
          {/each}

          {#if modules.length === 0}
            <p class="text-sm text-gray-500 italic">No modules available.</p>
          {/if}
        </nav>
      </div>
    </aside>

    <!-- Mobile: Lesson selector button -->
    <div class="lg:hidden">
      <button
        on:click={() => showLessonDrawer = true}
        class="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all mb-6"
      >
        <span class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {selectedLesson ? selectedLesson.title : 'Select a lesson'}
        </span>
        <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Mobile Drawer -->
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

        <!-- Drawer content -->
        <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          <!-- Drawer header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Select Lesson</h3>
            <button
              on:click={() => showLessonDrawer = false}
              class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Lesson list -->
          <div class="overflow-y-auto p-4 space-y-4">
            {#each modules as module}
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {module.title}
                </h4>
                {#if module.lessons.length > 0}
                  <div class="space-y-1">
                    {#each module.lessons as lesson}
                      <button
                        type="button"
                        on:click={() => selectLesson(lesson)}
                        class="w-full text-left px-4 py-3 text-sm rounded-xl transition-all {selectedLesson?.id === lesson.id
                          ? 'bg-gray-900 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'}"
                      >
                        {lesson.title}
                      </button>
                    {/each}
                  </div>
                {:else}
                  <p class="text-xs text-gray-400 italic pl-4">No lessons yet</p>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <!-- Editor Form -->
    <main class="lg:col-start-2">
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
        {#if !selectedLesson}
          <div class="text-center py-16 sm:py-20">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
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
            <p class="text-gray-600">Select a lesson to start editing</p>
          </div>
        {:else}
          <form
            method="post"
            action="?/save"
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === 'success') {
                  // Update the lesson data in local state to match saved values
                  if (selectedLesson) {
                    selectedLesson.title = currentTitle;
                    selectedLesson.video_embed_html = currentVideoEmbed;
                    selectedLesson.content_json = editorContent;
                  }

                  // Reset dirty state
                  isDirty = false;

                  // Show success notification
                  showSuccess = true;
                  setTimeout(() => {
                    showSuccess = false;
                  }, 3000);
                }
                // Don't call update() to avoid redirect - stay on same page
              };
            }}
          >
            {#if form?.error}
              <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p class="text-sm text-red-800">{form.error}</p>
              </div>
            {/if}

            <input type="hidden" name="lessonId" value={selectedLesson.id} />

            <div class="space-y-6">
              <!-- Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  bind:value={currentTitle}
                  required
                  class="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>

              <!-- Video Embed -->
              <div>
                <label for="video_embed_html" class="block text-sm font-medium text-gray-700 mb-2">
                  Video Embed HTML
                </label>
                <textarea
                  id="video_embed_html"
                  name="video_embed_html"
                  bind:value={currentVideoEmbed}
                  rows="5"
                  placeholder="Paste full embed HTML here (<iframe>...</iframe>)"
                  class="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-mono focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                ></textarea>
              </div>

              <!-- Rich Text Content -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Content
                </label>
                <RichTextEditor
                  value={selectedLesson.content_json}
                  onChange={handleEditorChange}
                />
                <input
                  type="hidden"
                  name="content_json"
                  value={JSON.stringify(editorContent)}
                />
              </div>

              <!-- Save Button -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 gap-3">
                <p class="text-xs text-gray-500">
                  Lesson ID: {selectedLesson.id}
                </p>
                <button
                  type="submit"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-black transition-all shadow-sm hover:shadow-md {isDirty ? 'ring-2 ring-amber-400 ring-offset-2' : ''}"
                >
                  {isDirty ? 'Save Changes *' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        {/if}
      </div>
    </main>
  </div>

  <!-- Course Edit Modal -->
  {#if showCourseEditModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" on:click={closeAllModals} role="button" tabindex="0"></div>

      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <button on:click={closeAllModals} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-xl font-bold text-gray-900 mb-4">Edit Course</h2>

        <form
          method="post"
          action="?/updateCourse"
          use:enhance={() => {
            return async ({ result }) => {
              if (result.type === 'success') {
                // Update local course state
                const formData = new FormData(document.querySelector('form[action="?/updateCourse"]'));
                course.title = formData.get('title');
                course.subtitle = formData.get('subtitle');

                closeAllModals();
                successMessage = 'Course updated!';
                showSuccess = true;
                setTimeout(() => {
                  showSuccess = false;
                  successMessage = '';
                }, 3000);
              }
            };
          }}
        >
          {#if form?.error}
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p class="text-sm text-red-800">{form.error}</p>
            </div>
          {/if}

          <input type="hidden" name="courseId" value={course.id} />

          <div class="space-y-4">
            <div>
              <label for="course-title" class="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                id="course-title"
                name="title"
                value={course.title}
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            <div>
              <label for="course-subtitle" class="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                id="course-subtitle"
                name="subtitle"
                value={course.subtitle || ''}
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>
          </div>

          <div class="flex gap-2 mt-6">
            <button
              type="button"
              on:click={closeAllModals}
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Module Create/Edit Modal -->
  {#if showModuleModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" on:click={closeAllModals} role="button" tabindex="0"></div>

      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <button on:click={closeAllModals} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {editingModule ? 'Edit Module' : 'Create Module'}
        </h2>

        <form
          method="post"
          action={editingModule ? '?/updateModule' : '?/createModule'}
          use:enhance={() => {
            return async ({ result }) => {
              if (result.type === 'success') {
                if (editingModule) {
                  // Update existing module in local state
                  const formData = new FormData(document.querySelector(`form[action="?/updateModule"]`));
                  const moduleToUpdate = modules.find(m => m.id === editingModule.id);
                  if (moduleToUpdate) {
                    moduleToUpdate.title = formData.get('title');
                  }
                  modules = modules;
                  successMessage = 'Module updated!';
                } else {
                  // Add new module to local state
                  modules = [...modules, {...result.data.module, lessons: []}];
                  successMessage = 'Module created!';
                }

                closeAllModals();
                showSuccess = true;
                setTimeout(() => {
                  showSuccess = false;
                  successMessage = '';
                }, 3000);
              }
            };
          }}
        >
          {#if form?.error}
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p class="text-sm text-red-800">{form.error}</p>
            </div>
          {/if}

          {#if editingModule}
            <input type="hidden" name="moduleId" value={editingModule.id} />
          {:else}
            <input type="hidden" name="courseId" value={course.id} />
          {/if}

          <div class="space-y-4">
            <div>
              <label for="module-title" class="block text-sm font-medium text-gray-700 mb-1">
                Module Title *
              </label>
              <input
                type="text"
                id="module-title"
                name="title"
                value={editingModule?.title || ''}
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>
          </div>

          <div class="flex gap-2 mt-6">
            <button
              type="button"
              on:click={closeAllModals}
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all"
            >
              {editingModule ? 'Save Changes' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Lesson Create Modal -->
  {#if showLessonModal && creatingLessonForModuleId}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" on:click={closeAllModals} role="button" tabindex="0"></div>

      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <button on:click={closeAllModals} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-xl font-bold text-gray-900 mb-4">Create New Lesson</h2>

        <form
          method="post"
          action="?/createLesson"
          use:enhance={() => {
            return async ({ result }) => {
              if (result.type === 'success') {
                // Add new lesson to the correct module in local state
                const moduleToUpdate = modules.find(m => m.id === creatingLessonForModuleId);
                if (moduleToUpdate) {
                  moduleToUpdate.lessons = [...moduleToUpdate.lessons, result.data.lesson];
                }
                modules = modules;

                // Auto-select the newly created lesson
                selectedLesson = result.data.lesson;

                closeAllModals();
                successMessage = 'Lesson created!';
                showSuccess = true;
                setTimeout(() => {
                  showSuccess = false;
                  successMessage = '';
                }, 3000);
              }
            };
          }}
        >
          {#if form?.error}
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p class="text-sm text-red-800">{form.error}</p>
            </div>
          {/if}

          <input type="hidden" name="moduleId" value={creatingLessonForModuleId} />

          <div class="space-y-4">
            <div>
              <label for="lesson-title" class="block text-sm font-medium text-gray-700 mb-1">
                Lesson Title *
              </label>
              <input
                type="text"
                id="lesson-title"
                name="title"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p class="text-xs text-amber-800">
                <strong>Note:</strong> This lesson will be created as <strong>unpublished</strong>. You can publish it later using the publish toggle.
              </p>
            </div>
          </div>

          <div class="flex gap-2 mt-6">
            <button
              type="button"
              on:click={closeAllModals}
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all"
            >
              Create Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Delete Confirmation Modal -->
  {#if showDeleteConfirmModal && deletingItem}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" on:click={closeAllModals} role="button" tabindex="0"></div>

      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <button on:click={closeAllModals} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 class="text-lg font-bold text-gray-900 mb-2">
            Delete {deletingItem.type === 'module' ? 'Module' : 'Lesson'}?
          </h2>

          {#if deletingItem.type === 'module'}
            <p class="text-sm text-gray-600 mb-4">
              Are you sure you want to delete module <strong>"{deletingItem.name}"</strong>
              {#if deletingItem.lessonCount && deletingItem.lessonCount > 0}
                and its <strong>{deletingItem.lessonCount} lesson{deletingItem.lessonCount > 1 ? 's' : ''}</strong>?
              {/if}
            </p>
            <p class="text-xs text-red-600 font-medium mb-6">
              This action cannot be undone. All lessons in this module will be permanently deleted.
            </p>
          {:else}
            <p class="text-sm text-gray-600 mb-4">
              Are you sure you want to delete lesson <strong>"{deletingItem.name}"</strong>?
            </p>
            <p class="text-xs text-red-600 font-medium mb-6">
              This action cannot be undone.
            </p>
          {/if}

          <form
            method="post"
            action={deletingItem.type === 'module' ? '?/deleteModule' : '?/deleteLesson'}
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === 'success') {
                  if (deletingItem.type === 'module') {
                    // Remove module and its lessons from local state
                    modules = modules.filter(m => m.id !== deletingItem.id);

                    // If current lesson was in deleted module, clear selection
                    if (selectedLesson && !allLessons.some(l => l.id === selectedLesson.id)) {
                      selectedLesson = allLessons.length > 0 ? allLessons[0] : null;
                    }

                    successMessage = `Module and ${deletingItem.lessonCount || 0} lesson${deletingItem.lessonCount !== 1 ? 's' : ''} deleted`;
                  } else {
                    // Remove lesson from local state
                    for (const module of modules) {
                      module.lessons = module.lessons.filter(l => l.id !== deletingItem.id);
                    }
                    modules = modules;

                    // If deleted lesson was selected, select another
                    if (selectedLesson?.id === deletingItem.id) {
                      selectedLesson = allLessons.length > 0 ? allLessons[0] : null;
                    }

                    successMessage = 'Lesson deleted';
                  }

                  closeAllModals();
                  showSuccess = true;
                  setTimeout(() => {
                    showSuccess = false;
                    successMessage = '';
                  }, 3000);
                }
              };
            }}
          >
            {#if form?.error}
              <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p class="text-sm text-red-800">{form.error}</p>
              </div>
            {/if}

            <input
              type="hidden"
              name={deletingItem.type === 'module' ? 'moduleId' : 'lessonId'}
              value={deletingItem.id}
            />

            <div class="flex gap-2">
              <button
                type="button"
                on:click={closeAllModals}
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
              >
                Delete {deletingItem.type === 'module' ? 'Module' : 'Lesson'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}
</div>
