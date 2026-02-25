import * as server from '../entries/pages/admin-dashboard/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin-dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin-dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.DbA5qGan.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dw6aHfi4.js","_app/immutable/chunks/CUhFOErh.js","_app/immutable/chunks/BEcPElOU.js","_app/immutable/chunks/7zAmjttS.js","_app/immutable/chunks/-YGb3Ayu.js"];
export const stylesheets = [];
export const fonts = [];
