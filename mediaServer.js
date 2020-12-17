const NodeMediaServer = require('node-media-server');
const config = require('./config/default').rtmp_server;
const LiveModel = require('./model/live');

const ffmpeg = require('./lib/ffmpeg');

const nms = new NodeMediaServer(config);

const getStreamKeyFromStreamPath = (path) => {
  const parts = path.split('/');
  return parts[parts.length - 1];
};

nms.on('prePublish', async (id, StreamPath) => {
  const streamKey = getStreamKeyFromStreamPath(StreamPath);

  const live = await LiveModel.findOne({ streamKey });

  if (live === null) {
    nms.getSession(id).reject();
  }
});

nms.on('postPlay', async (id, StreamPath) => {
  const streamKey = getStreamKeyFromStreamPath(StreamPath);

  setTimeout(async () => {
    await ffmpeg.extractThumbnailFromHls(streamKey, '00:00:05.000');
  }, 5000);
});

nms.on('donePublish', async (id, StreamPath) => {
  const streamKey = getStreamKeyFromStreamPath(StreamPath);

  await LiveModel.deleteOne({ streamKey });
});

module.exports = nms;
