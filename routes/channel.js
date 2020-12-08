const router = require('koa-router')();

router.prefix('/channel');

const VideoModel = require('../model/videos');

const video = new VideoModel();

router.get('/', async (ctx) => {
  await ctx.render('upload');
});

router.post('/upload', async (ctx) => {
  video.title = ctx.request.body.title;
  video.description = ctx.request.body.description;
  video.userID = ctx.request.user.userID;
  video.path = ctx.request.files.video.path;

  video.save();

  ctx.redirect('/');
});

module.exports = router;
