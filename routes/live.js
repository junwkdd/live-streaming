const router = require('koa-router')();
const moment = require('moment');

router.prefix('/live');

const LiveModel = require('../model/live');
const UserModel = require('../model/users');

const ffmpeg = require('../lib/ffmpeg');

router.get('/view', async (ctx) => {
  const live = await LiveModel.findById(ctx.request.query.liveID);
  const liveUser = await UserModel.findOne({ id: live.userID });
  const user = await UserModel.findOne({ id: ctx.request.user.userID });

  await ctx.render('live', { live, liveUser, user });
});

router.get('/upload', async (ctx) => {
  await ctx.render('liveUpload');
});

router.post('/upload', async (ctx) => {
  const user = await UserModel.findOne({ id: ctx.request.user.userID });

  const live = new LiveModel({
    userID: user.id,
    nickname: user.nickname,
    streamKey: ctx.request.body.streamKey,
    title: ctx.request.body.title,
    description: ctx.request.body.description,
    date: moment().format('HH:mm:ss'),
  });
  await live.save();

  ctx.body = 'success';
});

router.get('/thumbnail', async (ctx) => {
  await ffmpeg.extractThumbnailFromHls(ctx.request.query.streamKey, '00:00:05.000');
});

router.post('/viewer', async (ctx) => {
  const live = await LiveModel.findOne({ userID: ctx.request.body.userID });
  live.view += 1;

  await live.save();

  ctx.body = live.view;
});

module.exports = router;
