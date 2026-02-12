import * as server from '../entries/pages/course/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/course/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/course/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.5Ater1fx.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BEr8S2BH.js","_app/immutable/chunks/Bhtalan1.js","_app/immutable/chunks/DwMg6J4V.js","_app/immutable/chunks/PFYaj51y.js","_app/immutable/chunks/uYRX_vEE.js","_app/immutable/chunks/G1g-yhWM.js","_app/immutable/chunks/vNr9G5ct.js","_app/immutable/chunks/CmPF4Veb.js","_app/immutable/chunks/BtTTEFgi.js","_app/immutable/chunks/Dnwz1mGW.js","_app/immutable/chunks/B-xGWxxg.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/BxR5SE9n.js","_app/immutable/chunks/CSwIe0C0.js","_app/immutable/chunks/DozcOj-4.js","_app/immutable/chunks/B2NVjSaC.js"];
export const stylesheets = ["_app/immutable/assets/6.DmtkDrx2.css"];
export const fonts = [];
