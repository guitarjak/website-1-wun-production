import * as server from '../entries/pages/admin/course-editor/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/course-editor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/course-editor/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.DUyN7AGQ.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CC4q4ETm.js","_app/immutable/chunks/DozsQRlr.js","_app/immutable/chunks/CLKyMIMI.js","_app/immutable/chunks/BalPmObS.js","_app/immutable/chunks/Da1k8rLY.js","_app/immutable/chunks/yGToGDlJ.js","_app/immutable/chunks/BHSB_cbW.js","_app/immutable/chunks/DpAj9glg.js","_app/immutable/chunks/D_tsy-am.js","_app/immutable/chunks/C85G2gg9.js","_app/immutable/chunks/BYlu2qe_.js","_app/immutable/chunks/BRzKQYUk.js","_app/immutable/chunks/jkc_NlpB.js","_app/immutable/chunks/C-igWQ1U.js","_app/immutable/chunks/BUY8UlCc.js","_app/immutable/chunks/Cnv0xQ70.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/BFlqOnb8.js"];
export const stylesheets = ["_app/immutable/assets/3.CIGfHEIP.css"];
export const fonts = [];
