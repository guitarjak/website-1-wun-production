import * as server from '../entries/pages/course/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/course/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/course/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.wcSUcRYF.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CC4q4ETm.js","_app/immutable/chunks/DozsQRlr.js","_app/immutable/chunks/CLKyMIMI.js","_app/immutable/chunks/BalPmObS.js","_app/immutable/chunks/Da1k8rLY.js","_app/immutable/chunks/yGToGDlJ.js","_app/immutable/chunks/DZQT7BDd.js","_app/immutable/chunks/4d3iFKTa.js","_app/immutable/chunks/D_tsy-am.js","_app/immutable/chunks/C85G2gg9.js","_app/immutable/chunks/BYlu2qe_.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/iKNdJ5Ja.js","_app/immutable/chunks/BUY8UlCc.js","_app/immutable/chunks/Cnv0xQ70.js","_app/immutable/chunks/tV1OMJWs.js"];
export const stylesheets = ["_app/immutable/assets/5.DmtkDrx2.css"];
export const fonts = [];
