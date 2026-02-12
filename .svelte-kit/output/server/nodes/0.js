import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DRdCQvps.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BEr8S2BH.js","_app/immutable/chunks/Bhtalan1.js","_app/immutable/chunks/DwMg6J4V.js","_app/immutable/chunks/PFYaj51y.js","_app/immutable/chunks/uYRX_vEE.js","_app/immutable/chunks/Cch13qRw.js","_app/immutable/chunks/Dnwz1mGW.js","_app/immutable/chunks/B-xGWxxg.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/BxR5SE9n.js","_app/immutable/chunks/CSwIe0C0.js","_app/immutable/chunks/DozcOj-4.js","_app/immutable/chunks/BtTTEFgi.js","_app/immutable/chunks/B6D9xDC5.js","_app/immutable/chunks/BrKo5Ze0.js"];
export const stylesheets = ["_app/immutable/assets/0.DnQ8mHDg.css"];
export const fonts = [];
