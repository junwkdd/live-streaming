const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const dir = 'C:/workspace/visual code/live-streaming';

exports.encodeVideo = (filePath, fileDir, filename) => new Promise((resolve, reject) => {
  ffmpeg(dir + filePath, { timeout: 432000 }).addOption([
    '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
    '-level 3.0',
    '-start_number 0', // start the first .ts segment at index 0
    '-hls_time 10', // 10 second segment duration
    '-hls_list_size 0', // Maxmimum number of playlist entries (0 means all entries/infinite)
    '-f hls', // HLS format
  ]).output(`${dir}/${fileDir}/${filename}.m3u8`)
    .on('error', (err) => { reject(err); })
    .on('end', () => { resolve('end'); })
    .run();
});
