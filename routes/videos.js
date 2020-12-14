const router = require('koa-router')();
const fs = require('fs').promises;

router.prefix('/videos');

const VideoModel = require('../model/videos');
const UserModel = require('../model/users');

const ffmpeg = require('../lib/ffmpeg');

const video = new VideoModel();

router.get('/upload', async (ctx) => {
  await ctx.render('upload');
});

router.post('/upload', async (ctx) => {
  const dirArr = ctx.request.files.video.path.split(/\\/);

  const fileInfo = dirArr[dirArr.length - 1].split('.');
  const fileName = fileInfo[0];
  const fileExtension = fileInfo[1];
  const fileDir = `/public/videos/${fileName}`;

  await fs.mkdir(`.${fileDir}`);
  await fs.rename(`./public/temp/${fileName}.${fileExtension}`, `.${fileDir}/${fileName}.${fileExtension}`);

  const user = await UserModel.findOne({ id: ctx.request.user.userID });

  await ffmpeg.extractThumbnail({ fileDir, fileName, fileExtension }, '00:00:05.000'); // hh:mm:ss.xxx
  await ffmpeg.encodeVideo({ fileDir, fileName, fileExtension });

  video.userID = ctx.request.user.userID;
  video.title = ctx.request.body.title;
  video.description = ctx.request.body.description;
  video.nickname = user.nickname;
  video.path = `videos/${fileName}/${fileName}`;

  await video.save();

  await fs.unlink(`.${fileDir}/${fileName}.${fileExtension}`);

  ctx.body = 'success';
});

router.get('/view', async (ctx) => {
  const { videoID } = ctx.request.query;

  const video = await VideoModel.findOne({ _id: videoID });

  const views = ctx.cookies.get('views');

  if (views === undefined) {
    ctx.cookies.set('views', { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 });
  }

  if (!views.includes(videoID) || views === undefined) {
    ctx.cookies.set('views', views.concat('', videoID), { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 });

    video.view += 1;
    await VideoModel.updateOne({ _id: ctx.request.query.videoID }, { view: video.view });
  }

  await ctx.render('videoPlay', { video });
});

router.post('/like', async (ctx) => {
  const { videoID } = ctx.request.query;

  const video = await VideoModel.findOne({ _id: videoID });

  video.like += 1;
  await VideoModel.updateOne({ _id: videoID }, { like: video.like });

  ctx.body = video.like;
});

router.delete('/like', async (ctx) => {
  const { videoID } = ctx.request.query;

  const video = await VideoModel.findOne({ _id: videoID });

  video.like -= 1;
  await VideoModel.updateOne({ _id: videoID }, { like: video.like });

  ctx.body = video.like;
});

router.post('/hate', async (ctx) => {
  const { videoID } = ctx.request.query;

  const video = await VideoModel.findOne({ _id: videoID });

  video.hate += 1;
  await VideoModel.updateOne({ _id: videoID }, { hate: video.hate });

  ctx.body = video.hate;
});

router.delete('/hate', async (ctx) => {
  const { videoID } = ctx.request.query;

  const video = await VideoModel.findOne({ _id: videoID });

  video.hate -= 1;
  await VideoModel.updateOne({ _id: videoID }, { hate: video.hate });

  ctx.body = video.hate;
});

module.exports = router;
