import * as server from '../entries/pages/course/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/course/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/course/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.s3XDrnyO.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/ByQMveWn.js","_app/immutable/chunks/eovTDrd2.js","_app/immutable/chunks/DhqGwPdd.js","_app/immutable/chunks/hhK2w5ie.js","_app/immutable/chunks/58ce4SZd.js","_app/immutable/chunks/CSSmK6_L.js","_app/immutable/chunks/BE5eUoN9.js","_app/immutable/chunks/rSDMYbMd.js","_app/immutable/chunks/DfMt3On0.js","_app/immutable/chunks/CmDCWcrz.js","_app/immutable/chunks/d1vzK4Ud.js","_app/immutable/chunks/CdVRHkiz.js","_app/immutable/chunks/CjbB4hhC.js","_app/immutable/chunks/CxuIEsf7.js"];
export const stylesheets = ["_app/immutable/assets/6.DmtkDrx2.css"];
export const fonts = [];
