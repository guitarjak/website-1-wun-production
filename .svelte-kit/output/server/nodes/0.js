import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.iNSwxeQN.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dvr5WPIw.js","_app/immutable/chunks/BQcAFk-W.js","_app/immutable/chunks/l6NJHFl0.js","_app/immutable/chunks/D1OT1slZ.js","_app/immutable/chunks/C5cvGNmF.js","_app/immutable/chunks/DNKb2qOz.js","_app/immutable/chunks/DNb-1bx7.js","_app/immutable/chunks/B0f9Nskq.js","_app/immutable/chunks/DLdlFW72.js","_app/immutable/chunks/s8jvGbAF.js","_app/immutable/chunks/WXNJubks.js","_app/immutable/chunks/C2AkW51s.js","_app/immutable/chunks/Bj2ovH95.js","_app/immutable/chunks/BeJoCQga.js","_app/immutable/chunks/C9k9wlgZ.js"];
export const stylesheets = ["_app/immutable/assets/0.OlWuB5Fd.css"];
export const fonts = [];
