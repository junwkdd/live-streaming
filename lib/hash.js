const crypto = require('crypto');
require('dotenv').config();

exports.hash = (password) => crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
