import { Y as ensure_array_like, X as attr_class, W as attr_style, a1 as stringify, a0 as bind_props } from "../../../chunks/index2.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let users, totalLessons;
    let data = $$props["data"];
    function formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
    function getProgressColor(percentage) {
      if (percentage >= 75) return "text-green-600 bg-green-50";
      if (percentage >= 50) return "text-blue-600 bg-blue-50";
      if (percentage >= 25) return "text-yellow-600 bg-yellow-50";
      return "text-gray-600 bg-gray-50";
    }
    function getProgressBarColor(percentage) {
      if (percentage >= 75) return "bg-green-500";
      if (percentage >= 50) return "bg-blue-500";
      if (percentage >= 25) return "bg-yellow-500";
      return "bg-gray-400";
    }
    users = data.users || [];
    totalLessons = data.totalLessons || 0;
    $$renderer2.push(`<div class="max-w-7xl mx-auto"><div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Manage Users</h1> <p class="mt-2 text-sm sm:text-base text-gray-600">View all users and their course progress</p></div> <a href="/admin-dashboard" data-sveltekit-preload-data="hover" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Back to Dashboard</a></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div> <div><p class="text-2xl font-bold text-gray-900">${escape_html(users.length)}</p> <p class="text-xs text-gray-600">Total Users</p></div></div></div> <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><svg class="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <div><p class="text-2xl font-bold text-gray-900">${escape_html(users.filter((u) => u.enrolledAt).length)}</p> <p class="text-xs text-gray-600">Enrolled Users</p></div></div></div> <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><svg class="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <div><p class="text-2xl font-bold text-gray-900">${escape_html(totalLessons)}</p> <p class="text-xs text-gray-600">Total Lessons</p></div></div></div></div> <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"><div class="lg:hidden divide-y divide-gray-100">`);
    if (users.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-8 text-center"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> <p class="mt-4 text-sm text-gray-600">No users found</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(users);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let user = each_array[$$index];
        $$renderer2.push(`<div class="p-4 space-y-3"><div class="flex items-start justify-between"><div class="flex-1 min-w-0"><p class="text-sm font-semibold text-gray-900 truncate">${escape_html(user.fullName || "No name")}</p> <p class="text-xs text-gray-600 truncate">${escape_html(user.email)}</p> <span${attr_class(`inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs font-medium ${stringify(user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800")}`)}>${escape_html(user.role)}</span></div></div> <div class="space-y-2"><div class="flex items-center justify-between text-xs"><span class="text-gray-600">Progress</span> <span${attr_class(`font-medium ${stringify(getProgressColor(user.progressPercentage))} px-2 py-0.5 rounded`)}>${escape_html(user.progressPercentage)}%</span></div> <div class="h-2 rounded-full bg-gray-100 overflow-hidden"><div${attr_class(`h-full ${stringify(getProgressBarColor(user.progressPercentage))} transition-all duration-500`)}${attr_style(`width: ${stringify(user.progressPercentage)}%`)}></div></div> <p class="text-xs text-gray-600">${escape_html(user.completedLessons)} / ${escape_html(user.totalLessons)} lessons completed</p></div> <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100"><div><p class="text-xs text-gray-500">Enrolled</p> <p class="text-xs font-medium text-gray-900">${escape_html(formatDate(user.enrolledAt))}</p></div> <div><p class="text-xs text-gray-500">Last Activity</p> <p class="text-xs font-medium text-gray-900">${escape_html(formatDate(user.lastActivity))}</p></div></div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <div class="hidden lg:block overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th></tr></thead><tbody class="bg-white divide-y divide-gray-100">`);
    if (users.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<tr><td colspan="5" class="px-6 py-12 text-center"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> <p class="mt-4 text-sm text-gray-600">No users found</p></td></tr>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(users);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let user = each_array_1[$$index_1];
        $$renderer2.push(`<tr class="hover:bg-gray-50 transition-colors"><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"><span class="text-sm font-medium text-gray-700">${escape_html(user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase())}</span></div> <div class="ml-4"><div class="text-sm font-medium text-gray-900">${escape_html(user.fullName || "No name")}</div> <div class="text-sm text-gray-500">${escape_html(user.email)}</div></div></div></td><td class="px-6 py-4 whitespace-nowrap"><span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stringify(user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800")}`)}>${escape_html(user.role)}</span></td><td class="px-6 py-4 whitespace-nowrap"><div class="space-y-1"><div class="flex items-center justify-between"><span${attr_class(`text-sm font-medium ${stringify(getProgressColor(user.progressPercentage))} px-2 py-0.5 rounded`)}>${escape_html(user.progressPercentage)}%</span></div> <div class="w-32 h-2 rounded-full bg-gray-100 overflow-hidden"><div${attr_class(`h-full ${stringify(getProgressBarColor(user.progressPercentage))} transition-all duration-500`)}${attr_style(`width: ${stringify(user.progressPercentage)}%`)}></div></div> <p class="text-xs text-gray-500">${escape_html(user.completedLessons)} / ${escape_html(user.totalLessons)} lessons</p></div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${escape_html(formatDate(user.enrolledAt))}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${escape_html(formatDate(user.lastActivity))}</td></tr>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
