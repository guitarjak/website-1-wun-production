import * as server from '../entries/pages/profile/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/profile/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.QnP3nR-U.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dvr5WPIw.js","_app/immutable/chunks/BQcAFk-W.js","_app/immutable/chunks/D1OT1slZ.js","_app/immutable/chunks/s8jvGbAF.js","_app/immutable/chunks/DLdlFW72.js","_app/immutable/chunks/WXNJubks.js","_app/immutable/chunks/C2AkW51s.js","_app/immutable/chunks/Bj2ovH95.js"];
export const stylesheets = [];
export const fonts = [];
