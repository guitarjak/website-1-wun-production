import * as server from '../entries/pages/admin/course-editor/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/course-editor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/course-editor/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.B4cNUXwX.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dvr5WPIw.js","_app/immutable/chunks/BQcAFk-W.js","_app/immutable/chunks/l6NJHFl0.js","_app/immutable/chunks/D1OT1slZ.js","_app/immutable/chunks/C5cvGNmF.js","_app/immutable/chunks/WyW5YYVU.js","_app/immutable/chunks/C9k9wlgZ.js","_app/immutable/chunks/Bj2ovH95.js","_app/immutable/chunks/DNb-1bx7.js","_app/immutable/chunks/B0f9Nskq.js","_app/immutable/chunks/DLdlFW72.js","_app/immutable/chunks/DdFC_jCy.js","_app/immutable/chunks/WXNJubks.js","_app/immutable/chunks/C2AkW51s.js","_app/immutable/chunks/B1huxiXx.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CxuIEsf7.js","_app/immutable/chunks/BeJoCQga.js"];
export const stylesheets = ["_app/immutable/assets/3.zoymMK6K.css"];
export const fonts = [];
