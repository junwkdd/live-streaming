const router = require('koa-router')();

const VideoModel = require('../model/videos');
const LiveModel = require('../model/live');
const UserModel = require('../model/users');

const { division } = require('../lib/division');

router.get('/', async (ctx) => {
  if (ctx.request.user === undefined) {
    await ctx.redirect('/users/login');
  } else {
    const lives = division(await LiveModel.find().sort({ view: -1 }).limit(12), 4);
    const videos = division(await VideoModel.find().sort({ view: -1 }).limit(12), 4);
    const curUser = await UserModel.findOne({ id: ctx.request.user.userID });

    await ctx.render('index', { lives, videos, curUser });
  }
});

module.exports = router;
