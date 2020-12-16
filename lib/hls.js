const fs = require('fs').promises;

exports.hlsMiddleware = async (ctx, next) => {
  if (!ctx.url.includes('ts') && !ctx.url.includes('m3u8')) {
    return next();
  }

  const fileInfo = (ctx.url).split('/')[2];
  const fileName = fileInfo.split('.')[0];
  const extension = fileInfo.split('.')[1];

  switch (extension) {
    case 'm3u8':
      await fs.writeFile(`./live/${fileName}.${extension}`, 'data');
      break;
    case 'ts':
      await fs.writeFile(`./live/${fileName}.${extension}`, 'data');
      break;
    default:
      break;
  }
  return next();
};
