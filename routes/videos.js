const router = require('koa-router')();
const fs = require('fs').promises;
const moment = require('moment');

router.prefix('/videos');

const VideoModel = require('../model/videos');
const UserModel = require('../model/users');

const ffmpeg = require('../lib/ffmpeg');
const { viewOverlap } = require('../lib/view');

router.get('/upload', async (ctx) => {
  await ctx.render('videoUpload');
});

router.post('/upload', async (ctx) => {
  const dirArr = ctx.request.files.video.path.split(/\\/);

  const fileInfo = dirArr[dirArr.length - 1].split('.');
  const fileName = fileInfo[0];
  const fileExtension = fileInfo[1];
  const fileDir = `/public/videos/${fileName}`;

  await fs.mkdir(`.${fileDir}`);
  await fs.rename(`./public/temp/${fileName}.${fileExtension}`, `.${fileDir}/${fileName}.${fileExtension}`);

  await ffmpeg.extractThumbnail({ fileDir, fileName, fileExtension }, '00:00:05.000'); // hh:mm:ss.xxx
  await ffmpeg.encodeVideo({ fileDir, fileName, fileExtension });

  const user = await UserModel.findOne({ id: ctx.request.user.userID });

  const video = new VideoModel({
    userID: ctx.request.user.userID,
    nickname: user.nickname,
    title: ctx.request.body.title,
    description: ctx.request.body.description,
    date: moment().format('YYYY.MM.DD'),
    path: `videos/${fileName}/${fileName}`,
  });

  await video.save();

  await fs.unlink(`.${fileDir}/${fileName}.${fileExtension}`);

  ctx.body = 'success';
});

router.get('/view', async (ctx) => {
  const { videoID } = ctx.request.query;

  const video = await VideoModel.findOne({ _id: videoID });
  const user = await UserModel.findOne({ id: video.userID });

  if (viewOverlap(ctx, videoID)) {
    video.view += 1;
    await video.save();
  }

  await ctx.render('videoPlay', { video, user });
});

router.post('/like', async (ctx) => {
  const video = await VideoModel.findById(ctx.request.body.videoID);

  if (ctx.request.body.status === 'like') {
    video.like += 1;
  } else if (ctx.request.body.status === 'unlike') {
    video.like -= 1;
  }
  await video.save();

  ctx.body = video.like;
});

router.post('/hate', async (ctx) => {
  const video = await VideoModel.findById(ctx.request.body.videoID);

  if (ctx.request.body.status === 'hate') {
    video.hate += 1;
  } else if (ctx.request.body.status === 'unhate') {
    video.hate -= 1;
  }

  await video.save();

  ctx.body = video.hate;
});

router.post('/comment', async (ctx) => {
  const { videoID } = ctx.request.query;

  const user = await UserModel.findOne({ id: ctx.request.user.userID });

  const comment = {
    nickname: user.nickname,
    date: moment().format('YYYY.MM.DD'),
    comment: ctx.request.body.comment,
    profile: user.profile,
  };

  await VideoModel.updateOne({ _id: videoID }, { $push: { comments: comment } });

  ctx.body = comment;
});

module.exports = router;
