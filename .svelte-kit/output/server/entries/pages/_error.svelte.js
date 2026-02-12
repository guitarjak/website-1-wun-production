import { a3 as escape_html, Z as store_get, a5 as unsubscribe_stores } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<div class="max-w-lg mx-auto py-12 sm:py-20"><div class="text-center space-y-6"><a href="/" class="inline-block"><img src="/w1w/w1w-logo.webp" alt="Website 1 Wun" class="h-10 sm:h-12 w-auto mx-auto"/></a> <div class="space-y-2"><h1 class="text-6xl sm:text-7xl font-bold" style="color: var(--golden);">${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</h1> <p class="text-xl sm:text-2xl font-semibold" style="color: var(--text-primary);">`);
    if (store_get($$store_subs ??= {}, "$page", page).status === 404) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`Page not found`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (store_get($$store_subs ??= {}, "$page", page).status === 403) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`Access denied`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`Something went wrong`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></p> <p class="text-sm sm:text-base" style="color: var(--text-secondary);">`);
    if (store_get($$store_subs ??= {}, "$page", page).error?.message) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`${escape_html(store_get($$store_subs ??= {}, "$page", page).error.message)}`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (store_get($$store_subs ??= {}, "$page", page).status === 404) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`The page you're looking for doesn't exist or has been moved.`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`An unexpected error occurred. Please try again later.`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></p></div> <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"><a href="/" class="btn-primary px-6 py-3 rounded-xl font-medium text-sm shadow-sm transition-all">Go to Homepage</a> <button class="btn-ghost px-6 py-3 rounded-xl font-medium text-sm transition-all">Go Back</button></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _error as default
};
