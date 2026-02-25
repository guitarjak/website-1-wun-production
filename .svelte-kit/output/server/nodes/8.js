import * as server from '../entries/pages/profile/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/profile/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.BGlzGs52.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CC4q4ETm.js","_app/immutable/chunks/DozsQRlr.js","_app/immutable/chunks/BalPmObS.js","_app/immutable/chunks/iKNdJ5Ja.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/BUY8UlCc.js","_app/immutable/chunks/Cnv0xQ70.js","_app/immutable/chunks/D_tsy-am.js"];
export const stylesheets = [];
export const fonts = [];
