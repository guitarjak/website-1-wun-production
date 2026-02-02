import { U as store_get, V as head, W as attr_style, X as attr_class, Y as ensure_array_like, Z as attr, _ as slot, $ as unsubscribe_stores, a0 as bind_props } from "../../chunks/index2.js";
import { p as page } from "../../chunks/stores.js";
import { p as preloadData } from "../../chunks/client.js";
import { e as escape_html } from "../../chunks/context.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let session, profile, currentPath, navLinks;
    let data = $$props["data"];
    ({ session, profile } = data);
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    navLinks = session ? [
      { href: "/course", label: "Course" },
      { href: "/profile", label: "Profile" },
      ...profile?.role === "admin" ? [{ href: "/admin-dashboard", label: "Admin" }] : []
    ] : [
      { href: "/", label: "Home" },
      { href: "/login", label: "Login" }
    ];
    if (typeof window !== "undefined") {
      setTimeout(
        () => {
          if (currentPath !== "/") {
            preloadData().catch(() => {
            });
          }
          if (session) {
            preloadData().catch(() => {
            });
            preloadData().catch(() => {
            });
            if (profile?.role === "admin") {
              preloadData().catch(() => {
              });
            }
          } else {
            if (currentPath !== "/login") {
              preloadData().catch(() => {
              });
            }
          }
        },
        100
      );
    }
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/> <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/> <link rel="preload" href="/w1w/style.css" as="style"/> <link rel="stylesheet" href="/w1w/style.css"/>`);
    });
    $$renderer2.push(`<div class="min-h-screen"${attr_style(currentPath === "/" ? "" : "background-color: var(--cream-light);")}><nav${attr_class("sticky top-0 z-40 border-b navbar-container svelte-12qhfyh", void 0, { "hidden-nav": currentPath === "/" })} style="background: var(--cream-light); border-color: var(--border-light);"><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-14 sm:h-16"><div class="flex-shrink-0"><a href="/" data-sveltekit-preload-data="tap" data-sveltekit-noscroll="" class="block transition-opacity hover:opacity-80"><img src="/w1w/w1w-logo.webp" alt="Website 1 Wun" class="h-8 sm:h-10 w-auto"/></a></div> <div class="hidden md:flex items-center gap-1"><!--[-->`);
    const each_array = ensure_array_like(navLinks);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      $$renderer2.push(`<a${attr("href", link.href)} data-sveltekit-preload-data="tap"${attr("data-sveltekit-noscroll", link.href === "/")} class="px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"${attr_style(currentPath === link.href ? "background-color: var(--golden); color: var(--dark);" : "color: var(--text-secondary);")}>${escape_html(link.label)}</a>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (session && profile) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="ml-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200" style="color: var(--text-secondary);">Sign Out</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button class="md:hidden p-2 -mr-2 rounded-lg transition-colors" style="color: var(--text-secondary);" aria-label="Toggle menu"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`);
    }
    $$renderer2.push(`<!--]--></svg></button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></nav> `);
    if (currentPath === "/") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<main class="svelte-12qhfyh"><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></main>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 svelte-12qhfyh"><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></main>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _layout as default
};
