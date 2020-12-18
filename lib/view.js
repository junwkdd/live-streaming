exports.isViewOverlap = async (ctx, id) => {
  const views = ctx.cookies.get('views');
  if (views === undefined) {
    ctx.cookies.set('views', { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 });
  }
  if (!views.includes(id) || views === undefined) {
    ctx.cookies.set('views', views.concat('', id), { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 });
    return false;
  }
  return true;
};
