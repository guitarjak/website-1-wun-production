import { Z as store_get, a3 as escape_html, a2 as attr, a5 as unsubscribe_stores, a6 as bind_props } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { p as page } from "../../../chunks/stores.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let showResetSuccess;
    let form = $$props["form"];
    let loading = false;
    showResetSuccess = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("reset") === "success";
    $$renderer2.push(`<div class="max-w-md mx-auto"><div class="space-y-6 sm:space-y-8"><div class="text-center space-y-4"><a href="/" class="inline-block"><img src="/w1w/w1w-logo.webp" alt="Website 1 Wun" class="h-10 sm:h-12 w-auto mx-auto"/></a> <div class="space-y-2"><h1 class="text-3xl sm:text-4xl font-bold tracking-tight" style="color: var(--text-primary);">Welcome back</h1> <p class="text-sm sm:text-base" style="color: var(--text-secondary);">Sign in to continue your learning journey</p></div></div> <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8" style="border: 1px solid var(--border-light);"><form method="POST" action="?/login" class="space-y-5">`);
    if (showResetSuccess) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">Password successfully reset! Please sign in with your new password.</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="space-y-2"><label for="email" class="block text-sm font-medium" style="color: var(--text-secondary);">Email address</label> <input type="email" id="email" name="email" required autocomplete="email" class="w-full px-4 py-3 rounded-xl text-sm sm:text-base input-themed" placeholder="you@example.com"/></div> <div class="space-y-2"><div class="flex items-center justify-between"><label for="password" class="block text-sm font-medium" style="color: var(--text-secondary);">Password</label> <button type="button" class="text-sm transition-colors" style="color: var(--text-secondary);">Forgot password?</button></div> <input type="password" id="password" name="password" required autocomplete="current-password" class="w-full px-4 py-3 rounded-xl text-sm sm:text-base input-themed" placeholder="••••••••"/></div> <button type="submit"${attr("disabled", loading, true)} class="w-full btn-primary py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm sm:text-base min-h-[48px]">${escape_html("Sign In")}</button></form></div> <p class="text-center text-sm" style="color: var(--text-secondary);">Need access? Contact your administrator for an account.</p></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { form });
  });
}
export {
  _page as default
};
