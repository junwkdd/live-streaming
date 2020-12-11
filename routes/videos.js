const router = require('koa-router')();
const fs = require('fs').promises;

router.prefix('/videos');

const VideoModel = require('../model/videos');
const UserModel = require('../model/users');

const { encodeVideo } = require('../lib/ffmpeg');

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

  video.userID = ctx.request.user.userID;
  video.title = ctx.request.body.title;
  video.description = ctx.request.body.description;
  video.nickname = user.nickname;
  video.path = `videos/${fileName}/${fileName}.m3u8`;

  await video.save();

  await encodeVideo({ fileDir, fileName, fileExtension });

  ctx.body = 'success';
});

router.get('/view', async (ctx) => {
  const video = await VideoModel.findOne({ _id: ctx.request.query.videoID });
  await ctx.render('videoView', { video });
});

module.exports = router;
