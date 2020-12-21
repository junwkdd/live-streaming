const router = require('koa-router')();
const fs = require('fs').promises;
const moment = require('moment');

router.prefix('/videos');

const VideoModel = require('../model/videos');
const UserModel = require('../model/users');

const ffmpeg = require('../lib/ffmpeg');
const { isViewOverlap } = require('../lib/view');

router.get('/', async (ctx) => {
  const curUser = await UserModel.findOne({ id: ctx.request.user.userID });
  const videos = await VideoModel.find();

  await ctx.render('videos', { curUser, videos });
});

router.get('/upload', async (ctx) => {
  const curUser = await UserModel.findOne({ id: ctx.request.user.userID });

  await ctx.render('videoUpload', { curUser });
});

router.post('/upload', async (ctx) => {
  const dirArr = ctx.request.files.video.path.split('/');

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
  const videoUser = await UserModel.findOne({ id: video.userID });
  const curUser = await UserModel.findOne({ id: ctx.request.user.userID });

  if (!isViewOverlap(ctx, videoID)) {
    video.view += 1;
    await video.save();
  }

  await ctx.render('videoPlay', { video, videoUser, curUser });
});

router.post('/like', async (ctx) => {
  const video = await VideoModel.findById(ctx.request.body.videoID);

  video.like += 1;
  await video.save();

  await UserModel.updateOne({ id: ctx.request.user.userID }, { $push: { like: video._id } });

  ctx.body = video.like;
});

router.post('/unlike', async (ctx) => {
  const video = await VideoModel.findById(ctx.request.body.videoID);

  video.like -= 1;
  await video.save();

  await UserModel.updateOne({ id: ctx.request.user.userID }, { $pull: { like: video._id } });

  ctx.body = video.like;
});

router.post('/hate', async (ctx) => {
  const video = await VideoModel.findById(ctx.request.body.videoID);

  video.hate += 1;
  await video.save();

  await UserModel.updateOne({ id: ctx.request.user.userID }, { $push: { hate: video._id } });

  ctx.body = video.hate;
});

router.post('/unhate', async (ctx) => {
  const video = await VideoModel.findById(ctx.request.body.videoID);

  video.hate -= 1;
  await video.save();

  await UserModel.updateOne({ id: ctx.request.user.userID }, { $pull: { hate: video._id } });

  ctx.body = video.hate;
});

router.post('/comment', async (ctx) => {
  const user = await UserModel.findOne({ id: ctx.request.user.userID });
  const video = await VideoModel.findById(ctx.request.query.videoID);

  const comment = {
    userID: user.id,
    nickname: user.nickname,
    date: moment().format('YYYY.MM.DD'),
    comment: ctx.request.body.comment,
    profile: user.profile,
  };

  video.comments.push(comment);

  await video.save();

  ctx.body = comment;
});

module.exports = router;
