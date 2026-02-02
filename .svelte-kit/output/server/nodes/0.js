import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.BdcmA9tM.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/ByQMveWn.js","_app/immutable/chunks/eovTDrd2.js","_app/immutable/chunks/DhqGwPdd.js","_app/immutable/chunks/hhK2w5ie.js","_app/immutable/chunks/58ce4SZd.js","_app/immutable/chunks/DyTaPM2J.js","_app/immutable/chunks/DfMt3On0.js","_app/immutable/chunks/CmDCWcrz.js","_app/immutable/chunks/d1vzK4Ud.js","_app/immutable/chunks/CdVRHkiz.js","_app/immutable/chunks/rSDMYbMd.js","_app/immutable/chunks/CjbB4hhC.js","_app/immutable/chunks/BE5eUoN9.js"];
export const stylesheets = ["_app/immutable/assets/0.-p5U4iMo.css"];
export const fonts = [];
