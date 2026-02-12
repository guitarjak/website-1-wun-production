import * as server from '../entries/pages/admin/course-editor/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/course-editor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/course-editor/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.MygUkTiv.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BEr8S2BH.js","_app/immutable/chunks/Bhtalan1.js","_app/immutable/chunks/DwMg6J4V.js","_app/immutable/chunks/PFYaj51y.js","_app/immutable/chunks/uYRX_vEE.js","_app/immutable/chunks/G1g-yhWM.js","_app/immutable/chunks/sot0kc7u.js","_app/immutable/chunks/BrKo5Ze0.js","_app/immutable/chunks/BtTTEFgi.js","_app/immutable/chunks/Dnwz1mGW.js","_app/immutable/chunks/B-xGWxxg.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/Rb3OmfAo.js","_app/immutable/chunks/1W4AJ8S1.js","_app/immutable/chunks/CSwIe0C0.js","_app/immutable/chunks/DozcOj-4.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B6D9xDC5.js"];
export const stylesheets = ["_app/immutable/assets/3.CIGfHEIP.css"];
export const fonts = [];
