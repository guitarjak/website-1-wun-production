import { a8 as fallback, a6 as bind_props, Z as store_get, a3 as escape_html, $ as attr_style, a1 as ensure_array_like, a2 as attr, a0 as attr_class, a7 as stringify, a5 as unsubscribe_stores } from "../../../chunks/index.js";
import { p as page } from "../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function RenderContent($$renderer, $$props) {
  let contentHtml = fallback($$props["contentHtml"], null);
  if (!contentHtml) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<div class="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center"><svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <p class="text-gray-600 text-sm">No written content for this lesson yet.</p></div>`);
  } else {
    $$renderer.push("<!--[!-->");
    $$renderer.push(`<div class="lesson-content svelte-e8s6u5">${html(contentHtml)}</div>`);
  }
  $$renderer.push(`<!--]-->`);
  bind_props($$props, { contentHtml });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let course, modules, isAdmin, totalLessons, completedCount, progress, allLessons, currentLessonIndex, nextLesson, selectedLessonContent;
    let data = $$props["data"];
    let localCompletedLessonIds = data.completedLessonIds || [];
    let selectedLesson = null;
    let lessonContentById = {};
    let lessonContentLoading = false;
    let lessonContentError = "";
    let lastRequestedLessonId = "";
    async function ensureLessonContent(lessonId) {
      if (!lessonId || lessonContentById[lessonId]) return;
      lastRequestedLessonId = lessonId;
      lessonContentLoading = true;
      lessonContentError = "";
      try {
        const response = await fetch(`/api/course/lesson-content/${lessonId}`);
        if (!response.ok) {
          throw new Error(`Failed to load lesson content (${response.status})`);
        }
        const lessonContent = await response.json();
        lessonContentById = { ...lessonContentById, [lessonId]: lessonContent };
      } catch (error) {
        if (lastRequestedLessonId === lessonId) {
          lessonContentError = "Failed to load lesson content. Please try again.";
        }
      } finally {
        if (lastRequestedLessonId === lessonId) {
          lessonContentLoading = false;
        }
      }
    }
    course = data.course;
    modules = data.modules || [];
    isAdmin = data.profile?.role === "admin";
    totalLessons = data.totalLessons || 0;
    if (data.completedLessonIds) {
      localCompletedLessonIds = [...data.completedLessonIds];
    }
    completedCount = localCompletedLessonIds.length;
    progress = totalLessons > 0 ? Math.round(completedCount / totalLessons * 100) : 0;
    allLessons = modules.flatMap((m) => m.lessons);
    if (data.initialLessonId && data.initialLessonContent) {
      lessonContentById = {
        ...lessonContentById,
        [data.initialLessonId]: data.initialLessonContent
      };
    }
    {
      const lessonSlug = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("lesson");
      const lessonId = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("lessonId");
      if (allLessons.length > 0) {
        let newLesson = null;
        if (lessonId) {
          newLesson = allLessons.find((l) => l.id === lessonId) || null;
        }
        if (!newLesson && lessonSlug) {
          newLesson = allLessons.find((l) => l.slug === lessonSlug) || null;
        }
        if (!newLesson && !lessonId && !lessonSlug) {
          newLesson = allLessons[0];
        }
        if (newLesson && newLesson.id !== selectedLesson?.id) {
          selectedLesson = newLesson;
        } else if (!newLesson && !lessonId && !lessonSlug && allLessons.length > 0 && !selectedLesson) {
          selectedLesson = allLessons[0];
        }
      }
    }
    currentLessonIndex = selectedLesson ? allLessons.findIndex((l) => l.id === selectedLesson.id) : -1;
    nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
    selectedLessonContent = selectedLesson ? lessonContentById[selectedLesson.id] || null : null;
    if (selectedLesson) {
      void ensureLessonContent(selectedLesson.id);
    }
    if (
      // Update URL to trigger reactive selection
      !course
    ) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="max-w-3xl mx-auto py-8"><div class="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 shadow-sm"><h2 class="text-lg font-bold text-red-900 mb-2">No Course Found</h2> <p class="text-sm sm:text-base text-red-700">We couldn't find the course you're looking for. Please contact support if this problem persists.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (allLessons.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="max-w-6xl mx-auto"><div class="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6"><aside class="hidden lg:block"><div class="bg-white rounded-2xl shadow-sm p-5" style="border: 1px solid var(--border-light);"><div class="mb-4"><h2 class="text-lg font-bold mb-1" style="color: var(--text-primary);">${escape_html(course.title)}</h2> `);
        if (course.subtitle) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-sm" style="color: var(--text-secondary);">${escape_html(course.subtitle)}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> <p class="text-sm italic" style="color: var(--text-tertiary);">No lessons available yet.</p></div></aside> <main><div class="bg-white rounded-2xl shadow-sm p-8 sm:p-12" style="border: 1px solid var(--border-light);"><div class="text-center space-y-4"><svg class="mx-auto h-12 w-12" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> <h2 class="text-xl font-bold" style="color: var(--text-primary);">No Lessons Yet</h2> <p class="text-sm sm:text-base max-w-md mx-auto" style="color: var(--text-secondary);">Lessons will appear here once they are created and published.</p></div></div></main></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="max-w-7xl mx-auto -mt-6 lg:-mt-4">`);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (isAdmin) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="hidden lg:flex justify-end gap-3 mb-6"><a href="/course" class="btn-ghost inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Preview</a> <a href="/admin/course-editor" class="btn-secondary inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm text-white"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Edit Course</a></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6"><aside class="hidden lg:block"><div class="bg-white rounded-2xl shadow-sm p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col" style="border: 1px solid var(--border-light);"><div class="mb-4 pb-4" style="border-bottom: 1px solid var(--border-light);"><h2 class="text-base font-bold mb-1 leading-tight" style="color: var(--text-primary);">${escape_html(course.title)}</h2> `);
        if (course.subtitle) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-xs leading-snug" style="color: var(--text-secondary);">${escape_html(course.subtitle)}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="mb-4 pb-4" style="border-bottom: 1px solid var(--border-light);"><div class="flex items-center justify-between text-xs mb-2" style="color: var(--text-secondary);"><span>${escape_html(completedCount)} of ${escape_html(totalLessons)}</span> <span class="font-semibold">${escape_html(progress)}%</span></div> <div class="h-1.5 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);"><div class="h-full transition-all duration-500"${attr_style(`width: ${stringify(progress)}%; background-color: var(--golden);`)}></div></div></div> <nav class="space-y-3 overflow-y-auto flex-1"><!--[-->`);
        const each_array = ensure_array_like(modules);
        for (let moduleIndex = 0, $$length = each_array.length; moduleIndex < $$length; moduleIndex++) {
          let module = each_array[moduleIndex];
          $$renderer2.push(`<div><h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--text-tertiary);">${escape_html(module.title)}</h3> `);
          if (module.lessons.length > 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<ul class="space-y-1"><!--[-->`);
            const each_array_1 = ensure_array_like(module.lessons);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let lesson = each_array_1[$$index];
              const isCompleted = localCompletedLessonIds.includes(lesson.id);
              $$renderer2.push(`<li><button type="button" class="w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-2 font-medium"${attr_style(selectedLesson?.id === lesson.id ? "background-color: var(--blue); color: white;" : "color: var(--text-primary);")}><span class="flex-1 truncate text-xs leading-snug">${escape_html(lesson.title)}</span> `);
              if (isCompleted) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<svg class="w-4 h-4 flex-shrink-0" style="color: var(--success);" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--></button></li>`);
            }
            $$renderer2.push(`<!--]--></ul>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<p class="text-xs italic pl-3" style="color: var(--text-tertiary);">No lessons</p>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--></nav></div></aside> <main>`);
        if (selectedLesson) {
          $$renderer2.push("<!--[-->");
          const isLessonCompleted = localCompletedLessonIds.includes(selectedLesson.id);
          $$renderer2.push(`<div class="lg:hidden mb-4 space-y-3"><div class="bg-white rounded-xl shadow-sm p-4" style="border: 1px solid var(--border-light);"><div class="flex items-center justify-between text-xs mb-2" style="color: var(--text-secondary);"><span class="font-semibold">${escape_html(completedCount)} of ${escape_html(totalLessons)} completed</span> <span class="font-bold">${escape_html(progress)}%</span></div> <div class="h-2 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);"><div class="h-full transition-all duration-500"${attr_style(`width: ${stringify(progress)}%; background-color: var(--golden);`)}></div></div></div> <button class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl text-sm font-semibold transition-all shadow-sm" style="border: 1px solid var(--border-light); color: var(--text-primary);"><span class="flex items-center gap-2 flex-1 min-w-0"><svg class="w-5 h-5 flex-shrink-0" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg> <span class="truncate">${escape_html(selectedLesson.title)}</span></span> <svg class="w-5 h-5 flex-shrink-0 ml-2" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button></div> `);
          {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <div class="bg-white rounded-2xl shadow-sm overflow-hidden" style="border: 1px solid var(--border-light);"><div class="hidden lg:flex items-start justify-between p-6 pb-4" style="border-bottom: 1px solid var(--border-light);"><div class="flex-1 min-w-0"><p class="text-xs mb-1" style="color: var(--text-tertiary);">${escape_html(course.title)}</p> <h1 class="text-2xl lg:text-3xl font-bold tracking-tight leading-tight" style="color: var(--text-primary);">${escape_html(selectedLesson.title)}</h1></div> <div class="ml-4 flex-shrink-0 flex items-center gap-2"><form method="POST" action="?/toggleCompletion"><input type="hidden" name="lessonId"${attr("value", selectedLesson.id)}/> <input type="hidden" name="isCompleted"${attr("value", isLessonCompleted ? "true" : "false")}/> <button type="submit"${attr_class(`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold border transition-all shadow-sm ${stringify(isLessonCompleted ? "badge-success" : "btn-ghost")}`)}${attr_style(isLessonCompleted ? "border-color: var(--success); color: var(--success);" : "")}>`);
          if (isLessonCompleted) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Completed`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Mark Complete`);
          }
          $$renderer2.push(`<!--]--></button></form> `);
          if (nextLesson) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<a${attr("href", `/course?lessonId=${stringify(nextLesson.id)}`)} data-sveltekit-preload-data="hover" class="btn-primary inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all shadow-sm">Next Lesson <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div></div> <div class="lg:hidden p-4 pb-3" style="border-bottom: 1px solid var(--border-light);"><h1 class="text-xl sm:text-2xl font-bold tracking-tight" style="color: var(--text-primary);">${escape_html(selectedLesson.title)}</h1></div> <div class="lg:p-6 lg:pt-4">`);
          if (selectedLessonContent?.video_embed_html) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="aspect-video w-full lg:rounded-xl overflow-hidden bg-black relative"><div class="absolute inset-0 [&amp;>iframe]:w-full [&amp;>iframe]:h-full [&amp;>iframe]:absolute [&amp;>iframe]:top-0 [&amp;>iframe]:left-0">${html(selectedLessonContent.video_embed_html)}</div></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (lessonContentLoading) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<div class="aspect-video w-full lg:rounded-xl overflow-hidden flex items-center justify-center" style="background-color: var(--bg-secondary); border: 1px solid var(--border-light);"><div class="text-center p-6"><div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-3" style="border-color: var(--golden);"></div> <p class="text-sm" style="color: var(--text-secondary);">Loading lesson...</p></div></div>`);
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push(`<div class="aspect-video w-full lg:rounded-xl overflow-hidden flex items-center justify-center" style="background-color: var(--bg-secondary); border: 1px solid var(--border-light);"><div class="text-center p-6"><svg class="mx-auto h-10 w-10 mb-3" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> <p class="text-sm" style="color: var(--text-secondary);">No video available for this lesson</p></div></div>`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div> <div class="p-4 sm:p-6 lg:px-6 lg:pb-8"><div class="lg:hidden mb-6 space-y-3"><form method="POST" action="?/toggleCompletion" class="w-full"><input type="hidden" name="lessonId"${attr("value", selectedLesson.id)}/> <input type="hidden" name="isCompleted"${attr("value", isLessonCompleted ? "true" : "false")}/> <button type="submit"${attr_class(`w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold border transition-all shadow-sm min-h-[48px] ${stringify(isLessonCompleted ? "badge-success" : "btn-secondary text-white")}`)}${attr_style(isLessonCompleted ? "border-color: var(--success); color: var(--success);" : "")}>`);
          if (isLessonCompleted) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Completed`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Mark as Complete`);
          }
          $$renderer2.push(`<!--]--></button></form> `);
          if (nextLesson) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<a${attr("href", `/course?lessonId=${stringify(nextLesson.id)}`)} data-sveltekit-preload-data="hover" class="btn-primary w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all shadow-sm min-h-[48px]">Next Lesson <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="prose prose-sm sm:prose max-w-none">`);
          if (lessonContentError) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">${escape_html(lessonContentError)}</div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (selectedLessonContent) {
              $$renderer2.push("<!--[-->");
              RenderContent($$renderer2, { contentHtml: selectedLessonContent.content_html });
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push(`<div class="rounded-xl p-6 text-sm" style="background-color: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border-light);">Loading lesson content...</div>`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div></div></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></main></div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
