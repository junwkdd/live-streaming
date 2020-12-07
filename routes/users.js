const router = require('koa-router')();

router.prefix('/users');

const UserModel = require('../model/users');

const Token = require('../lib/token');
const Hash = require('../lib/hash');

const user = new UserModel();

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
  } else if (user.pw !== Hash.hash(ctx.request.body.pw)) {
    ctx.body = 'wrong pw';
  } else {
    const token = await Token.generateToken({ userID: ctx.request.body.id });
    ctx.cookies.set('accessToken', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 });
    ctx.body = user;
    ctx.redirect('/');
  }
});

router.get('/register', async (ctx) => {
  await ctx.render('register');
});

router.post('/register', async (ctx) => {
  user.id = ctx.request.body.id;
  user.nickname = ctx.request.body.nickname;
  user.pw = ctx.request.body.pw;

  user.pw = Hash.hash(user.pw);

  await user.save();
  ctx.redirect('/users/login');
});

router.get('/logout', async (ctx) => {
  ctx.cookies.set('accessToken', null, { httpOnly: true, maxAge: 0 });
  ctx.status = 204;
});

router.get('/exists', async (ctx) => {
  const user = await UserModel.findOne({ id: ctx.request.query.id });

  if (user === null) ctx.body = 'no user';
  else ctx.body = 'exists';
});

module.exports = router;
