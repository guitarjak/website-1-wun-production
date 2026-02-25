import * as server from '../entries/pages/admin-dashboard/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin-dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin-dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CQKTPACo.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CC4q4ETm.js","_app/immutable/chunks/DozsQRlr.js","_app/immutable/chunks/BUY8UlCc.js","_app/immutable/chunks/Cnv0xQ70.js","_app/immutable/chunks/D_tsy-am.js"];
export const stylesheets = [];
export const fonts = [];
