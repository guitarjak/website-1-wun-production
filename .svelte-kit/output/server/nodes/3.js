import * as server from '../entries/pages/admin/course-editor/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/course-editor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/course-editor/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.NaCevqT3.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dw6aHfi4.js","_app/immutable/chunks/CUhFOErh.js","_app/immutable/chunks/zk9si_NT.js","_app/immutable/chunks/CAAuI-la.js","_app/immutable/chunks/Dy_Apf1z.js","_app/immutable/chunks/BEZCToC3.js","_app/immutable/chunks/8M4R2aPH.js","_app/immutable/chunks/D8V2ZQZv.js","_app/immutable/chunks/-YGb3Ayu.js","_app/immutable/chunks/CfJoinrj.js","_app/immutable/chunks/C1jIINMg.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/Cq5mzRvW.js","_app/immutable/chunks/DKq78WyG.js","_app/immutable/chunks/BEcPElOU.js","_app/immutable/chunks/7zAmjttS.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B6SZx3Eg.js"];
export const stylesheets = ["_app/immutable/assets/3.CIGfHEIP.css"];
export const fonts = [];
