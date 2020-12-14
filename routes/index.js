const router = require('koa-router')();

const VideoModel = require('../model/videos');

const { division } = require('../lib/division');

router.get('/', async (ctx) => {
  const videos = division(await VideoModel.find().sort({ view: -1 }).limit(12), 4);

  await ctx.render('index', { videos });
});

router.get('/channel', async (ctx) => {
  await ctx.render('channel');
});

module.exports = router;
