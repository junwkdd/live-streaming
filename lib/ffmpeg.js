const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

exports.encodeVideo = (fileInfo) => new Promise((resolve, reject) => {
  ffmpeg(`.${fileInfo.fileDir}/${fileInfo.fileName}.${fileInfo.fileExtension}`, { timeout: 432000 })
    .addOption([
      '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
      '-level 3.0',
      '-start_number 0', // start the first .ts segment at index 0
      '-hls_time 10', // 10 second segment duration
      '-hls_list_size 0', // Maxmimum number of playlist entries (0 means all entries/infinite)
      '-f hls', // HLS format
    ])
    .output(`.${fileInfo.fileDir}/${fileInfo.fileName}.m3u8`)
    .on('error', (err) => { reject(err); })
    .on('end', () => { resolve('end'); })
    .run();
});

exports.extractThumbnail = (fileInfo, timestamp) => new Promise((resolve, reject) => {
  ffmpeg(`.${fileInfo.fileDir}/${fileInfo.fileName}.${fileInfo.fileExtension}`)
    .thumbnail({
      timestamps: [timestamp],
      filename: `${fileInfo.fileName}.png`,
      folder: `.${fileInfo.fileDir}`,
      size: '1280x720',
    })
    .on('error', (err) => reject(err))
    .on('end', () => resolve('end'));
});

exports.extractThumbnailFromHls = (streamKey, timestamp) => new Promise((resolve, reject) => {
  ffmpeg(`http://localhost:8888/live/${streamKey}/index.m3u8`)
    .thumbnail({
      timestamps: [timestamp],
      filename: `${streamKey}.png`,
      folder: './public/thumbnails/',
      size: '1280x720',
    })
    .on('error', (err) => reject(err))
    .on('end', () => resolve('end'));
});
