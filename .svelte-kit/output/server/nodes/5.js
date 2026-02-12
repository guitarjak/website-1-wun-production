import * as server from '../entries/pages/build-landing-page/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/build-landing-page/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/build-landing-page/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CPITT5VQ.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dvr5WPIw.js","_app/immutable/chunks/BQcAFk-W.js","_app/immutable/chunks/l6NJHFl0.js","_app/immutable/chunks/DNKb2qOz.js"];
export const stylesheets = ["_app/immutable/assets/5.7fFHN-Ys.css"];
export const fonts = [];
