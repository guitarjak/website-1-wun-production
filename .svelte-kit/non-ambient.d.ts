
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin-dashboard" | "/admin" | "/admin/course-editor" | "/course" | "/login" | "/manage-users" | "/profile";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/admin-dashboard": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/course-editor": Record<string, never>;
			"/course": Record<string, never>;
			"/login": Record<string, never>;
			"/manage-users": Record<string, never>;
			"/profile": Record<string, never>
		};
		Pathname(): "/" | "/admin-dashboard" | "/admin-dashboard/" | "/admin" | "/admin/" | "/admin/course-editor" | "/admin/course-editor/" | "/course" | "/course/" | "/login" | "/login/" | "/manage-users" | "/manage-users/" | "/profile" | "/profile/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/w1w/guitar-dsp-square.png" | "/w1w/images/1.png" | "/w1w/images/10.png" | "/w1w/images/11.png" | "/w1w/images/12.png" | "/w1w/images/13.png" | "/w1w/images/14.png" | "/w1w/images/15.png" | "/w1w/images/16.png" | "/w1w/images/17.png" | "/w1w/images/18.png" | "/w1w/images/19.png" | "/w1w/images/2.png" | "/w1w/images/20.png" | "/w1w/images/21.png" | "/w1w/images/22.png" | "/w1w/images/23.png" | "/w1w/images/24.png" | "/w1w/images/25.png" | "/w1w/images/3.png" | "/w1w/images/4.png" | "/w1w/images/5.png" | "/w1w/images/6.png" | "/w1w/images/7.png" | "/w1w/images/8.png" | "/w1w/images/9.png" | "/w1w/jakkrapat-dot-com.png" | "/w1w/style.css" | "/w1w/w1w-logo.png" | "/w1w/web-showcase-1.png" | "/w1w/web-showcase-2.png" | "/w1w/web-showcase-3.png" | "/w1w/web-showcase-4.png" | "/w1w/web-showcase-5.png" | "/w1w/web-showcase-6.png" | "/w1w/web-showcase-7.png" | "/w1w/web-showcase-8.png" | "/w1w-logo.png" | string & {};
	}
}