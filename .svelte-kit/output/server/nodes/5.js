import * as server from '../entries/pages/build-landing-page/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/build-landing-page/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/build-landing-page/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.pK7k8zdO.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BEr8S2BH.js","_app/immutable/chunks/Bhtalan1.js","_app/immutable/chunks/DwMg6J4V.js","_app/immutable/chunks/Cch13qRw.js"];
export const stylesheets = ["_app/immutable/assets/5.7fFHN-Ys.css"];
export const fonts = [];
