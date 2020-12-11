const router = require('koa-router')();

const VideoModel = require('../model/videos');

router.get('/', async (ctx) => {
  const videos = await VideoModel.find({}).sort('view').limit(12);
  if (ctx.request.user !== undefined) {
    await ctx.render('index', { videos });
  } else {
    ctx.redirect('./users/login');
  }
});

router.get('/channel', async (ctx) => {
  await ctx.render('channel');
});

module.exports = router;
