import { a0 as bind_props } from "../../../chunks/index2.js";
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
    $$renderer2.push(`<div class="max-w-md mx-auto"><div class="space-y-6 sm:space-y-8"><div class="text-center space-y-2"><h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Reset your password</h1> <p class="text-sm sm:text-base text-gray-600">Enter your new password below</p></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8"><div class="text-center space-y-3"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div> <p class="text-sm text-gray-600">Verifying your reset link...</p></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
