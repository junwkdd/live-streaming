const router = require('koa-router')();

const VideoModel = require('../model/videos');
const LiveModel = require('../model/live');
const userModel = require('../model/users');

const { division } = require('../lib/division');

router.get('/', async (ctx) => {
  if (ctx.request.user === undefined) {
    ctx.redirect('/users/login');
  }
  const lives = division(await LiveModel.find().sort({ view: -1 }).limit(12), 4);
  const videos = division(await VideoModel.find().sort({ view: -1 }).limit(12), 4);
  const curUser = await userModel.findOne({ id: ctx.request.user.userID });

  await ctx.render('index', { lives, videos, curUser });
});

router.get('/channel', async (ctx) => {
  await ctx.render('channel');
});

module.exports = router;
