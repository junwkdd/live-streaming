const config = {
  rtmp_server: {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30,
    },
    http: {
      port: 8888,
      mediaroot: '../live',
      allow_origin: '*',
    },
    trans: {
      ffmpeg: 'C:/Program Files/ffmpeg/bin/ffmpeg.exe',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        },
      ],
    },
  },
};

module.exports = config;
