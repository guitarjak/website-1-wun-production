import * as server from '../entries/pages/profile/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/profile/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.TPheQpF6.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/ByQMveWn.js","_app/immutable/chunks/eovTDrd2.js","_app/immutable/chunks/hhK2w5ie.js","_app/immutable/chunks/CmDCWcrz.js","_app/immutable/chunks/d1vzK4Ud.js","_app/immutable/chunks/CdVRHkiz.js","_app/immutable/chunks/rSDMYbMd.js"];
export const stylesheets = [];
export const fonts = [];
