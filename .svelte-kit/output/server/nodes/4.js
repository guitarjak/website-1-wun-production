import * as server from '../entries/pages/admin-dashboard/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin-dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin-dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CgKOcxxz.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BEr8S2BH.js","_app/immutable/chunks/Bhtalan1.js","_app/immutable/chunks/CSwIe0C0.js","_app/immutable/chunks/DozcOj-4.js","_app/immutable/chunks/BtTTEFgi.js"];
export const stylesheets = [];
export const fonts = [];
