import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.D8QZyL4f.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dw6aHfi4.js","_app/immutable/chunks/CUhFOErh.js","_app/immutable/chunks/zk9si_NT.js","_app/immutable/chunks/DwAqWfwC.js"];
export const stylesheets = ["_app/immutable/assets/2.DoOv0dRD.css"];
export const fonts = [];
