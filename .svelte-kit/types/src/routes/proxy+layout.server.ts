// @ts-nocheck
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals, cookies }: Parameters<LayoutServerLoad>[0]) => {
  return {
    session: locals.session,
    profile: locals.profile,
    cookies: cookies.getAll()
  };
};
