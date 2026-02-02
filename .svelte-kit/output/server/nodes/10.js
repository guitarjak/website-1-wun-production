import * as server from '../entries/pages/reset-password/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/reset-password/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/reset-password/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.FMzfHZaj.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/ByQMveWn.js","_app/immutable/chunks/eovTDrd2.js","_app/immutable/chunks/DhqGwPdd.js","_app/immutable/chunks/hhK2w5ie.js","_app/immutable/chunks/CSSmK6_L.js","_app/immutable/chunks/BE5eUoN9.js","_app/immutable/chunks/rSDMYbMd.js","_app/immutable/chunks/DfMt3On0.js","_app/immutable/chunks/B2CzkbZn.js","_app/immutable/chunks/CdVRHkiz.js"];
export const stylesheets = [];
export const fonts = [];
