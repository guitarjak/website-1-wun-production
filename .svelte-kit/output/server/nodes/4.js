import * as server from '../entries/pages/admin-dashboard/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin-dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin-dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.DpRPcUwX.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/ByQMveWn.js","_app/immutable/chunks/eovTDrd2.js","_app/immutable/chunks/CdVRHkiz.js","_app/immutable/chunks/rSDMYbMd.js"];
export const stylesheets = [];
export const fonts = [];
