const router = require('koa-router')();

router.prefix('/users');

const UserModel = require('../model/users');

const { generateToken } = require('../lib/token');
const { hash } = require('../lib/hash');

router.get('/exists', async (ctx) => {
  const user = await UserModel.findOne({ id: ctx.request.query.id });

  if (user === null) ctx.body = 'no user';
  else ctx.body = 'exists';
});

router.get('/login', async (ctx) => {
  await ctx.render('login');
});

router.post('/login', async (ctx) => {
  const user = await UserModel.findOne({ id: ctx.request.body.id });

  if (user === null) {
    ctx.body = 'no user';
  } else if (user.pw !== hash(ctx.request.body.pw)) {
    ctx.body = 'wrong pw';
  } else {
    const token = await generateToken({ userID: ctx.request.body.id });
    ctx.cookies.set('accessToken', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 });
    ctx.body = user;
    ctx.redirect('/');
  }
});

router.get('/register', async (ctx) => {
  await ctx.render('register');
});

router.post('/register', async (ctx) => {
  const user = new UserModel({
    id: ctx.request.body.id,
    nickname: ctx.request.body.nickname,
    pw: hash(ctx.request.body.pw),
  });

  await user.save();
  ctx.redirect('/users/login');
});

router.get('/logout', async (ctx) => {
  ctx.cookies.set('accessToken', null, { httpOnly: true, maxAge: 0 });
  ctx.redirect('/');
});

router.get('/exists', async (ctx) => {
  const user = await UserModel.findOne({ id: ctx.request.query.id });

  if (user === null) ctx.body = 'no user';
  else ctx.body = 'exists';
});

router.post('/subscribe', async (ctx) => {
  const user = await UserModel.findOne({ id: ctx.request.query.userID });

  user.subscribe += 1;
  await user.save();

  ctx.body = user.subscribe;
});

router.delete('/unSubscribe', async (ctx) => {
  const user = await UserModel.findOne({ id: ctx.request.query.userID });

  user.subscribe -= 1;
  await user.save();

  ctx.body = user.subscribe;
});

module.exports = router;
