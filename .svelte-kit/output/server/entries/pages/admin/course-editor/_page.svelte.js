import { a3 as escape_html, a1 as ensure_array_like, a0 as attr_class, a7 as stringify, a2 as attr, a6 as bind_props } from "../../../../chunks/index.js";
import "@tiptap/starter-kit";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let course, modules;
    let data = $$props["data"];
    let form = $$props["form"];
    let selectedLesson = null;
    course = data.course;
    modules = data.modules || [];
    modules.flatMap((m) => m.lessons);
    $$renderer2.push(`<div class="max-w-7xl mx-auto -mt-6 lg:-mt-4">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Course Editor</h1> <p class="text-sm text-gray-600 mt-1">Edit lesson content and structure</p></div> <div class="flex flex-wrap gap-2 sm:gap-3"><a href="/course" class="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> <span class="hidden sm:inline">Preview Course</span> <span class="sm:hidden">Preview</span></a> <a href="/admin-dashboard" class="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-black transition-all shadow-sm"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> <span class="hidden sm:inline">Dashboard</span> <span class="sm:hidden">Admin</span></a></div></div> <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6"><div class="flex items-start justify-between"><div class="flex-1"><h2 class="text-xl sm:text-2xl font-bold text-gray-900">${escape_html(course.title)}</h2> `);
    if (course.subtitle) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-gray-600 mt-1">${escape_html(course.subtitle)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button class="ml-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> <span class="hidden sm:inline">Edit</span></button></div></div> <div class="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6"><aside class="hidden lg:block"><div class="bg-white border border-gray-200 rounded-2xl p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"><div class="mb-4 flex items-center justify-between"><h2 class="text-sm font-semibold text-gray-900">${escape_html(course?.title || "Course")}</h2> <button class="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-all" title="Add Module"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> <span>Add Module</span></button></div> <nav class="space-y-3"><!--[-->`);
    const each_array = ensure_array_like(modules);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let module = each_array[$$index_1];
      $$renderer2.push(`<div class="group"><div class="flex items-center justify-between mb-2"><h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">${escape_html(module.title)}</h3> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100" title="Add Lesson"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button> <button class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100" title="Edit Module"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button> <button class="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50" title="Delete Module"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div> `);
      if (module.lessons.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<ul class="space-y-1"><!--[-->`);
        const each_array_1 = ensure_array_like(module.lessons);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let lesson = each_array_1[$$index];
          $$renderer2.push(`<li class="group/lesson"><div class="flex items-center gap-1"><button type="button"${attr_class(`flex-1 text-left px-3 py-2 text-sm rounded-lg transition-all ${stringify(selectedLesson?.id === lesson.id ? "bg-gray-900 text-white font-medium" : "text-gray-700 hover:bg-gray-100")}`)}><div class="flex items-center gap-2"><span class="flex-1">${escape_html(lesson.title)}</span> `);
          if (!lesson.is_published) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span${attr_class(`text-xs px-1.5 py-0.5 rounded ${stringify(selectedLesson?.id === lesson.id ? "bg-amber-400/20 text-amber-100" : "bg-amber-100 text-amber-700")}`)}>Draft</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div></button> <div class="flex items-center gap-0.5 opacity-0 group-hover/lesson:opacity-100 transition-opacity"><form method="post" action="?/togglePublish"><input type="hidden" name="lessonId"${attr("value", lesson.id)}/> <input type="hidden" name="isPublished"${attr("value", lesson.is_published)}/> <button type="submit" class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"${attr("title", lesson.is_published ? "Unpublish" : "Publish")}>`);
          if (lesson.is_published) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>`);
          }
          $$renderer2.push(`<!--]--></button></form> <button class="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50" title="Delete Lesson"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div></li>`);
        }
        $$renderer2.push(`<!--]--></ul>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<p class="text-xs text-gray-400 italic pl-3">No lessons yet</p>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (modules.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-sm text-gray-500 italic">No modules available.</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></nav></div></aside> <div class="lg:hidden"><button class="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all mb-6"><span class="flex items-center gap-2"><svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg> ${escape_html("Select a lesson")}</span> <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <main class="lg:col-start-2"><div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-16 sm:py-20"><svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> <p class="text-gray-600">Select a lesson to start editing</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></main></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
