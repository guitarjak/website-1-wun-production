export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["w1w/guitar-dsp-square.png","w1w/guitar-dsp-square.webp","w1w/images/1.png","w1w/images/1.webp","w1w/images/10.png","w1w/images/10.webp","w1w/images/11.png","w1w/images/11.webp","w1w/images/12.png","w1w/images/12.webp","w1w/images/13.png","w1w/images/13.webp","w1w/images/14.png","w1w/images/14.webp","w1w/images/15.png","w1w/images/15.webp","w1w/images/16.png","w1w/images/16.webp","w1w/images/17.png","w1w/images/17.webp","w1w/images/18.png","w1w/images/18.webp","w1w/images/19.png","w1w/images/19.webp","w1w/images/2.png","w1w/images/2.webp","w1w/images/20.png","w1w/images/20.webp","w1w/images/21.png","w1w/images/21.webp","w1w/images/22.png","w1w/images/22.webp","w1w/images/23.png","w1w/images/23.webp","w1w/images/24.png","w1w/images/24.webp","w1w/images/25.png","w1w/images/25.webp","w1w/images/3.png","w1w/images/3.webp","w1w/images/4.png","w1w/images/4.webp","w1w/images/5.png","w1w/images/5.webp","w1w/images/6.png","w1w/images/6.webp","w1w/images/7.png","w1w/images/7.webp","w1w/images/8.png","w1w/images/8.webp","w1w/images/9.png","w1w/images/9.webp","w1w/jakkrapat-dot-com.png","w1w/jakkrapat-dot-com.webp","w1w/style.css","w1w/w1w-logo.png","w1w/w1w-logo.webp","w1w/web-showcase-1.png","w1w/web-showcase-1.webp","w1w/web-showcase-2.png","w1w/web-showcase-2.webp","w1w/web-showcase-3.png","w1w/web-showcase-3.webp","w1w/web-showcase-4.jpeg","w1w/web-showcase-4.png","w1w/web-showcase-4.webp","w1w/web-showcase-5.png","w1w/web-showcase-5.webp","w1w/web-showcase-6.jpeg","w1w/web-showcase-6.png","w1w/web-showcase-6.webp","w1w/web-showcase-7.png","w1w/web-showcase-7.webp","w1w/web-showcase-8.jpeg","w1w/web-showcase-8.png","w1w/web-showcase-8.webp","w1w-logo.jpeg","w1w-logo.png","w1w-logo.webp"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".css":"text/css",".jpeg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.UT4qy2ym.js",app:"_app/immutable/entry/app.RL_UG7db.js",imports:["_app/immutable/entry/start.UT4qy2ym.js","_app/immutable/chunks/4d3iFKTa.js","_app/immutable/chunks/CLKyMIMI.js","_app/immutable/chunks/DozsQRlr.js","_app/immutable/chunks/D_tsy-am.js","_app/immutable/entry/app.RL_UG7db.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/DozsQRlr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CLKyMIMI.js","_app/immutable/chunks/BalPmObS.js","_app/immutable/chunks/C-igWQ1U.js","_app/immutable/chunks/BUY8UlCc.js","_app/immutable/chunks/Cnv0xQ70.js","_app/immutable/chunks/D_tsy-am.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin-dashboard",
				pattern: /^\/admin-dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin/course-editor",
				pattern: /^\/admin\/course-editor\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/admin/users",
				pattern: /^\/api\/admin\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/users/_server.ts.js'))
			},
			{
				id: "/api/auth/signout",
				pattern: /^\/api\/auth\/signout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/signout/_server.ts.js'))
			},
			{
				id: "/api/course/lesson-content/[lessonId]",
				pattern: /^\/api\/course\/lesson-content\/([^/]+?)\/?$/,
				params: [{"name":"lessonId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/course/lesson-content/_lessonId_/_server.ts.js'))
			},
			{
				id: "/course",
				pattern: /^\/course\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/manage-users",
				pattern: /^\/manage-users\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/reset-password",
				pattern: /^\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
