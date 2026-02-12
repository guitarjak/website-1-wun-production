import { a3 as escape_html, a2 as attr, a1 as ensure_array_like, $ as attr_style, a7 as stringify, a6 as bind_props } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let users, totalLessons, filteredUsers;
    let data = $$props["data"];
    let searchQuery = "";
    function formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
    function getProgressColor(percentage) {
      if (percentage >= 75) return "var(--success)";
      if (percentage >= 50) return "var(--blue)";
      if (percentage >= 25) return "var(--golden)";
      return "var(--text-tertiary)";
    }
    function getProgressBarColor(percentage) {
      if (percentage >= 75) return "var(--success)";
      if (percentage >= 50) return "var(--blue)";
      if (percentage >= 25) return "var(--golden)";
      return "var(--text-tertiary)";
    }
    users = data.users || [];
    totalLessons = data.totalLessons || 0;
    filteredUsers = searchQuery.trim() ? users.filter((u) => {
      const q = searchQuery.toLowerCase();
      return u.fullName?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }) : users;
    $$renderer2.push(`<div class="max-w-7xl mx-auto"><div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-3xl sm:text-4xl font-bold tracking-tight" style="color: var(--text-primary);">Manage Users</h1> <p class="mt-2 text-sm sm:text-base" style="color: var(--text-secondary);">View all users and their course progress</p></div> <a href="/admin-dashboard" data-sveltekit-preload-data="hover" class="inline-flex items-center px-4 py-2 text-sm font-medium btn-ghost rounded-xl transition-all shadow-sm"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Back to Dashboard</a></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div class="bg-white rounded-xl shadow-sm p-4" style="border: 1px solid var(--border-light);"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: var(--bg-secondary);"><svg class="w-5 h-5" style="color: var(--text-secondary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div> <div><p class="text-2xl font-bold" style="color: var(--text-primary);">${escape_html(users.length)}</p> <p class="text-xs" style="color: var(--text-secondary);">Total Users</p></div></div></div> <div class="bg-white rounded-xl shadow-sm p-4" style="border: 1px solid var(--border-light);"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: rgba(16, 185, 129, 0.1);"><svg class="w-5 h-5" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <div><p class="text-2xl font-bold" style="color: var(--text-primary);">${escape_html(users.filter((u) => u.enrolledAt).length)}</p> <p class="text-xs" style="color: var(--text-secondary);">Enrolled Users</p></div></div></div> <div class="bg-white rounded-xl shadow-sm p-4" style="border: 1px solid var(--border-light);"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: rgba(74, 113, 246, 0.1);"><svg class="w-5 h-5" style="color: var(--blue);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <div><p class="text-2xl font-bold" style="color: var(--text-primary);">${escape_html(totalLessons)}</p> <p class="text-xs" style="color: var(--text-secondary);">Total Lessons</p></div></div></div></div> <div class="relative"><svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <input type="text"${attr("value", searchQuery)} placeholder="Search by name or email..." class="w-full pl-12 pr-4 py-3 rounded-xl text-sm input-themed"/> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm overflow-hidden" style="border: 1px solid var(--border-light);"><div class="lg:hidden divide-y" style="border-color: var(--border-light);">`);
      if (filteredUsers.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="p-8 text-center"><svg class="mx-auto h-12 w-12" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> <p class="mt-4 text-sm" style="color: var(--text-secondary);">No users found</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(filteredUsers);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let user = each_array[$$index];
          $$renderer2.push(`<div class="p-4 space-y-3"><div class="flex items-start justify-between"><div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate" style="color: var(--text-primary);">${escape_html(user.fullName || "No name")}</p> <p class="text-xs truncate" style="color: var(--text-secondary);">${escape_html(user.email)}</p> <span class="inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs font-medium"${attr_style(`background-color: ${stringify(user.role === "admin" ? "rgba(74, 113, 246, 0.1)" : "var(--bg-secondary)")}; color: ${stringify(user.role === "admin" ? "var(--blue)" : "var(--text-secondary)")};`)}>${escape_html(user.role)}</span></div></div> <div class="space-y-2"><div class="flex items-center justify-between text-xs"><span style="color: var(--text-secondary);">Progress</span> <span class="font-medium px-2 py-0.5 rounded"${attr_style(`color: ${stringify(getProgressColor(user.progressPercentage))};`)}>${escape_html(user.progressPercentage)}%</span></div> <div class="h-2 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);"><div class="h-full transition-all duration-500 rounded-full"${attr_style(`width: ${stringify(user.progressPercentage)}%; background-color: ${stringify(getProgressBarColor(user.progressPercentage))};`)}></div></div> <p class="text-xs" style="color: var(--text-secondary);">${escape_html(user.completedLessons)} / ${escape_html(user.totalLessons)} lessons completed</p></div> <div class="grid grid-cols-2 gap-2 pt-2" style="border-top: 1px solid var(--border-light);"><div><p class="text-xs" style="color: var(--text-tertiary);">Enrolled</p> <p class="text-xs font-medium" style="color: var(--text-primary);">${escape_html(formatDate(user.enrolledAt))}</p></div> <div><p class="text-xs" style="color: var(--text-tertiary);">Last Activity</p> <p class="text-xs font-medium" style="color: var(--text-primary);">${escape_html(formatDate(user.lastActivity))}</p></div></div></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> <div class="hidden lg:block overflow-x-auto"><table class="min-w-full"><thead style="background-color: var(--bg-secondary);"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">User</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">Role</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">Progress</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">Enrolled</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary); border-bottom: 1px solid var(--border-light);">Last Activity</th></tr></thead><tbody class="bg-white">`);
      if (filteredUsers.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<tr><td colspan="5" class="px-6 py-12 text-center"><svg class="mx-auto h-12 w-12" style="color: var(--text-tertiary);" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> <p class="mt-4 text-sm" style="color: var(--text-secondary);">No users found</p></td></tr>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(filteredUsers);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let user = each_array_1[$$index_1];
          $$renderer2.push(`<tr class="transition-colors" style="border-bottom: 1px solid var(--border-light);"><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" style="background-color: var(--bg-tertiary);"><span class="text-sm font-medium" style="color: var(--text-secondary);">${escape_html(user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase())}</span></div> <div class="ml-4"><div class="text-sm font-medium" style="color: var(--text-primary);">${escape_html(user.fullName || "No name")}</div> <div class="text-sm" style="color: var(--text-tertiary);">${escape_html(user.email)}</div></div></div></td><td class="px-6 py-4 whitespace-nowrap"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"${attr_style(`background-color: ${stringify(user.role === "admin" ? "rgba(74, 113, 246, 0.1)" : "var(--bg-secondary)")}; color: ${stringify(user.role === "admin" ? "var(--blue)" : "var(--text-secondary)")};`)}>${escape_html(user.role)}</span></td><td class="px-6 py-4 whitespace-nowrap"><div class="space-y-1"><div class="flex items-center justify-between"><span class="text-sm font-medium"${attr_style(`color: ${stringify(getProgressColor(user.progressPercentage))};`)}>${escape_html(user.progressPercentage)}%</span></div> <div class="w-32 h-2 rounded-full overflow-hidden" style="background-color: var(--bg-tertiary);"><div class="h-full transition-all duration-500 rounded-full"${attr_style(`width: ${stringify(user.progressPercentage)}%; background-color: ${stringify(getProgressBarColor(user.progressPercentage))};`)}></div></div> <p class="text-xs" style="color: var(--text-tertiary);">${escape_html(user.completedLessons)} / ${escape_html(user.totalLessons)} lessons</p></div></td><td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-secondary);">${escape_html(formatDate(user.enrolledAt))}</td><td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-secondary);">${escape_html(formatDate(user.lastActivity))}</td></tr>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
