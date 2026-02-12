import * as server from '../entries/pages/reset-password/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/reset-password/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/reset-password/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.BqTngMuT.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BEr8S2BH.js","_app/immutable/chunks/Bhtalan1.js","_app/immutable/chunks/DwMg6J4V.js","_app/immutable/chunks/PFYaj51y.js","_app/immutable/chunks/vNr9G5ct.js","_app/immutable/chunks/CmPF4Veb.js","_app/immutable/chunks/BtTTEFgi.js","_app/immutable/chunks/Dnwz1mGW.js","_app/immutable/chunks/Rb3OmfAo.js","_app/immutable/chunks/CSwIe0C0.js","_app/immutable/chunks/DozcOj-4.js"];
export const stylesheets = [];
export const fonts = [];
