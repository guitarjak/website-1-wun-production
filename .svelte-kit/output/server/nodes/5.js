import * as server from '../entries/pages/course/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/course/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/course/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.Bq4L8wTS.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dw6aHfi4.js","_app/immutable/chunks/CUhFOErh.js","_app/immutable/chunks/zk9si_NT.js","_app/immutable/chunks/CAAuI-la.js","_app/immutable/chunks/Dy_Apf1z.js","_app/immutable/chunks/BEZCToC3.js","_app/immutable/chunks/DEgEnbr_.js","_app/immutable/chunks/Ys-GdiFh.js","_app/immutable/chunks/-YGb3Ayu.js","_app/immutable/chunks/CfJoinrj.js","_app/immutable/chunks/C1jIINMg.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/YDe3OPkG.js","_app/immutable/chunks/BEcPElOU.js","_app/immutable/chunks/7zAmjttS.js","_app/immutable/chunks/6dQbzhYz.js"];
export const stylesheets = ["_app/immutable/assets/5.DmtkDrx2.css"];
export const fonts = [];
