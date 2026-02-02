import * as server from '../entries/pages/admin/course-editor/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/course-editor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/course-editor/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.CPMhaerW.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/ByQMveWn.js","_app/immutable/chunks/eovTDrd2.js","_app/immutable/chunks/DhqGwPdd.js","_app/immutable/chunks/hhK2w5ie.js","_app/immutable/chunks/58ce4SZd.js","_app/immutable/chunks/CSSmK6_L.js","_app/immutable/chunks/BE5eUoN9.js","_app/immutable/chunks/rSDMYbMd.js","_app/immutable/chunks/DfMt3On0.js","_app/immutable/chunks/CmDCWcrz.js","_app/immutable/chunks/B2CzkbZn.js","_app/immutable/chunks/CdVRHkiz.js","_app/immutable/chunks/g4D_RKAJ.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/CxuIEsf7.js","_app/immutable/chunks/CjbB4hhC.js"];
export const stylesheets = ["_app/immutable/assets/3.zoymMK6K.css"];
export const fonts = [];
