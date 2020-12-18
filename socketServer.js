const io = require('socket.io')({ cors: { origin: '*' } });

const LiveModel = require('./model/live');

io.on('connection', (client) => {
  client.on('addUser', (nickname, room) => {
    client.nickname = nickname;
    client.room = room;
    client.join(room);

    client.emit('updateChat', '', '채팅방에 오신 것을 환영합니다!');
    client.emit('updateViewer', io.sockets.adapter.rooms[room]);
  });

  client.on('sendChat', (content) => {
    io.sockets.to(client.room).emit('updateChat', `${client.nickname}:`, content);
  });

  client.on('disconnect', async () => {
    const live = await LiveModel.findOne({ streamKey: client.room });
    live.view -= 1;
    await live.save();

    client.leave(client.room);
  });
});

module.exports = io;
