const router = require('koa-router')();

router.get('/', async (ctx) => {
  if (ctx.request.user !== undefined) {
    await ctx.render('index');
  } else {
    ctx.redirect('./users/login');
  }
});

router.get('/channel', async (ctx) => {
  await ctx.render('channel');
});

module.exports = router;
