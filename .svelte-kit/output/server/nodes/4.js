import * as server from '../entries/pages/admin-dashboard/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin-dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin-dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.Ch0cWQMg.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dvr5WPIw.js","_app/immutable/chunks/BQcAFk-W.js","_app/immutable/chunks/WXNJubks.js","_app/immutable/chunks/C2AkW51s.js","_app/immutable/chunks/Bj2ovH95.js"];
export const stylesheets = [];
export const fonts = [];
