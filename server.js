const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 8000;
var users = [];
var playing = [];
var boardState = [["-", "-", "-", "-"], ["-", "-", "-", "-"],["-", "-", "-", "-"], ["-", "-", "-", "-"]];

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function (socket) {
    // Player added.
    socket.on('player-added', function (data) {
        io.emit('change-board', {board:boardState});

        users.push({socket:socket.id, nickName:data});

        if(playing.length < 2 && playing.length === 0 && users.length > 0) {
            playing.push(users.pop());
            socket.emit("type", data = {type:'X', turn: "X"});
        }else if(playing.length < 2 && playing.length === 1 && users.length > 0) {
            playing.push(users.pop());
            socket.emit("type", data = {type:'O', turn: "X"});
        }else {
            socket.emit("type", {type:'-'});
        }

        gamePlayers = {waiting:users, playing:playing};
        io.emit('player-array', gamePlayers);
    });

    // Test Messages
    socket.on('send-message', function (data) {
        io.emit('message-received', data);
    });

    // Test Messages
    socket.on('send-board', function (data) {
        boardState = data.board;
        io.emit('change-board', data);
    });

    // Win
    socket.on('win-board', function (data) {
        users.push(playing.pop());
        users.push(playing.pop());

        for (var i = 0; i < 2; i++) {
            if (playing.length < 2 && playing.length === 0 && users.length > 0) {
                playing.push(users.splice(0, 1)[0]);
                io.to(playing[i].socket).emit("type", data = {type: 'X', turn: "X"});
            } else if (playing.length < 2 && playing.length === 1 && users.length > 0) {
                playing.push(users.splice(0, 1)[0]);
                io.to(playing[i].socket).emit("type", data = {type: 'O', turn: "X"});
            }
        }

        for (var j = 0; j < users.length; j++) {
            io.to(users[j].socket).emit("type", {type: '-'});
        }

        boardState = [["-", "-", "-", "-"], ["-", "-", "-", "-"],["-", "-", "-", "-"], ["-", "-", "-", "-"]];
        io.emit('change-board', {board:boardState});

        gamePlayers = {waiting: users, playing: playing};
        io.emit('player-array', gamePlayers);
    });

    socket.on('disconnect', function () {
        var isPlaying = false;
        for(var j = 0; j < users.length; j++){
            if(users[j].socket === socket.id)
                users.splice(j,1);
        }

        for(var i = 0; i < playing.length; i++){
            if(playing[i].socket === socket.id) {
                playing.splice(i, 1);
                isPlaying = true;
            }
        }

        if(isPlaying){
            boardState = [["-", "-", "-", "-"], ["-", "-", "-", "-"],["-", "-", "-", "-"], ["-", "-", "-", "-"]];

            if(users.length > 0){
                playing.push(users.splice(0, 1)[0]);
                io.to(playing[0].socket).emit("type", data = {type: 'X', turn: "X"});
                io.to(playing[1].socket).emit("type", data = {type: 'O', turn: "X"});
            }else if(playing.length === 1) {
                io.to(playing[0].socket).emit("type", data = {type: 'X', turn: "X"});
            }

            io.emit('change-board', {board:boardState});
        }

        gamePlayers = {waiting: users, playing: playing};
        io.emit('player-array', gamePlayers);
    });
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on', http.address().port);
});

server.listen(port, function () {
    console.log("Listening on port " + port);
});