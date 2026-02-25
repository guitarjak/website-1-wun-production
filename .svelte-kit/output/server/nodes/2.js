import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.QO14dorO.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CC4q4ETm.js","_app/immutable/chunks/DozsQRlr.js","_app/immutable/chunks/CLKyMIMI.js","_app/immutable/chunks/C4_v7sbj.js"];
export const stylesheets = ["_app/immutable/assets/2.DoOv0dRD.css"];
export const fonts = [];
