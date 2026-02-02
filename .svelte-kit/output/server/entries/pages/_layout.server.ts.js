const load = async ({ locals, cookies }) => {
  return {
    session: locals.session,
    profile: locals.profile,
    cookies: cookies.getAll()
  };
};
export {
  load
};
