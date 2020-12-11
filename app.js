/* eslint-disable no-console */
const Koa = require('koa');

const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-body');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const mongoose = require('mongoose');

require('dotenv').config();

const { jwtMiddleware } = require('./lib/token');

const index = require('./routes/index');
const users = require('./routes/users');
const channel = require('./routes/videos');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  multipart: true,
  formidable: {
    uploadDir: './public/temp/',
    keepExtensions: true,
  },
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(`${__dirname}/public`));

app.use(views(`${__dirname}/views`, { extension: 'ejs' }));

// cors
app.use(cors());

// jwt
app.use(jwtMiddleware);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(channel.routes(), channel.allowedMethods());

// error-handling
app.on('error', (err) => {
  console.error('server error', err);
});

// database
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

module.exports = app;
