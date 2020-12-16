const router = require('koa-router')();

router.prefix('/live');

router.get('/', async (ctx) => {
  await ctx.render('live');
});

module.exports = router;
