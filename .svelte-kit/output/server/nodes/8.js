import * as server from '../entries/pages/profile/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/profile/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DDWhhkN2.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dw6aHfi4.js","_app/immutable/chunks/CUhFOErh.js","_app/immutable/chunks/CAAuI-la.js","_app/immutable/chunks/YDe3OPkG.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/BEcPElOU.js","_app/immutable/chunks/7zAmjttS.js","_app/immutable/chunks/-YGb3Ayu.js"];
export const stylesheets = [];
export const fonts = [];
