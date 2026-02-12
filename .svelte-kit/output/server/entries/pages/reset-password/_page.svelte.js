import { a6 as bind_props } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    $$renderer2.push(`<div class="max-w-md mx-auto"><div class="space-y-6 sm:space-y-8"><div class="text-center space-y-4"><a href="/" class="inline-block"><img src="/w1w/w1w-logo.webp" alt="Website 1 Wun" class="h-10 sm:h-12 w-auto mx-auto"/></a> <div class="space-y-2"><h1 class="text-3xl sm:text-4xl font-bold tracking-tight" style="color: var(--text-primary);">Reset your password</h1> <p class="text-sm sm:text-base" style="color: var(--text-secondary);">Enter your new password below</p></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8" style="border: 1px solid var(--border-light);"><div class="text-center space-y-3"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--golden);"></div> <p class="text-sm" style="color: var(--text-secondary);">Verifying your reset link...</p></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
