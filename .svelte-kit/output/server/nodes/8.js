import * as server from '../entries/pages/manage-users/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-users/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/manage-users/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DZ3EzpFK.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BEr8S2BH.js","_app/immutable/chunks/Bhtalan1.js","_app/immutable/chunks/PFYaj51y.js","_app/immutable/chunks/uYRX_vEE.js","_app/immutable/chunks/Dnwz1mGW.js","_app/immutable/chunks/BxR5SE9n.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/Rb3OmfAo.js","_app/immutable/chunks/CSwIe0C0.js","_app/immutable/chunks/DozcOj-4.js","_app/immutable/chunks/BtTTEFgi.js"];
export const stylesheets = [];
export const fonts = [];
