import * as server from '../entries/pages/reset-password/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/reset-password/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/reset-password/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.DNcokWyM.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dvr5WPIw.js","_app/immutable/chunks/BQcAFk-W.js","_app/immutable/chunks/l6NJHFl0.js","_app/immutable/chunks/D1OT1slZ.js","_app/immutable/chunks/WyW5YYVU.js","_app/immutable/chunks/C9k9wlgZ.js","_app/immutable/chunks/Bj2ovH95.js","_app/immutable/chunks/DNb-1bx7.js","_app/immutable/chunks/DdFC_jCy.js","_app/immutable/chunks/WXNJubks.js","_app/immutable/chunks/C2AkW51s.js"];
export const stylesheets = [];
export const fonts = [];
