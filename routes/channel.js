const router = require('koa-router')();

router.prefix('/channel');

const VideoModel = require('../model/videos');
const UserModel = require('../model/users');

router.get('/', async (ctx) => {
  const curUser = await UserModel.findOne({ id: ctx.request.user.userID });
  const channelUser = await UserModel.findOne({ id: ctx.request.query.userID });
  const uploadVideos = await VideoModel.find({ userID: ctx.request.query.userID });
  const likeVideos = await VideoModel.find({ _id: channelUser.like });
  const subscribingChannels = await UserModel.find({ id: channelUser.subscribing });

  await ctx.render('channel', {
    curUser, channelUser, uploadVideos, likeVideos, subscribingChannels,
  });
});

module.exports = router;
