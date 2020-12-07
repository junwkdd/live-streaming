const jwt = require('jsonwebtoken');

const jwtSecret = process.env.SECRET_KEY;

exports.generateToken = (payload) => new Promise((resolve, reject) => {
  jwt.sign(payload, jwtSecret, { expiresIn: '1d' }, (err, token) => {
    if (err) reject(err);
    resolve(token);
  });
});

exports.decodeToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, jwtSecret, (err, decode) => {
    if (err) reject(err);
    resolve(decode);
  });
});

exports.jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('accessToken');
  if (!token) return next();

  const decoded = await this.decodeToken(token);

  if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) { // token expires left one day
    const { _id, userID } = decoded;
    const freshToken = await this.generateToken({ _id, userID });
    ctx.cookies.set('accessToken', freshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 });
  }

  ctx.request.user = decoded;
  return next();
};
