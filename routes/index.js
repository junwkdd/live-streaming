const router = require('koa-router')();

const VideoModel = require('../model/videos');
const LiveModel = require('../model/live');

const { division } = require('../lib/division');

router.get('/', async (ctx) => {
  const lives = division(await LiveModel.find().sort({ view: -1 }).limit(12), 4);
  const videos = division(await VideoModel.find().sort({ view: -1 }).limit(12), 4);

  await ctx.render('index', { lives, videos });
});

router.get('/channel', async (ctx) => {
  await ctx.render('channel');
});

module.exports = router;
