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
        //Update board to enter user and push to user array
        io.to(socket.id).emit('change-board', {board:boardState});
        users.push({socket:socket.id, nickName:data});

        //If there no playing user add else set type to "-"
        if(playing.length < 2 && playing.length === 0 && users.length > 0) {
            playing.push(users.splice(0, 1)[0]);
            socket.emit("type", data = {type:'O', turn: "X"});
        }else if(playing.length < 2 && playing.length === 1 && users.length > 0) {
            playing.push(users.splice(0, 1)[0]);
            socket.emit("type", data = {type:'X', turn: "X"});
        }else {
            socket.emit("type", {type:'-'});
        }

        //Update players array
        gamePlayers = {waiting:users, playing:playing};
        io.emit('player-array', gamePlayers);
    });

    // Update messages
    socket.on('send-message', function (data) {
        io.emit('message-received', data);
    });

    // Update board
    socket.on('send-board', function (data) {
        boardState = data.board;
        io.emit('change-board', data);
    });

    // Win
    socket.on('win-board', function (data) {
        //Pop back playing users to users array
        users.push(playing.pop());
        users.push(playing.pop());

        //chose new playing users.
        for (var i = 0; i < 2; i++) {
            if (playing.length < 2 && playing.length === 0 && users.length > 0) {
                playing.push(users.splice(0, 1)[0]);
                io.to(playing[i].socket).emit("type", data = {type: 'O', turn: "X"});
            } else if (playing.length < 2 && playing.length === 1 && users.length > 0) {
                playing.push(users.splice(0, 1)[0]);
                io.to(playing[i].socket).emit("type", data = {type: 'X', turn: "X"});
            }
        }

        //Set type for not play users
        for (var j = 0; j < users.length; j++) {
            io.to(users[j].socket).emit("type", {type: '-'});
        }

        //Empty board
        boardState = [["-", "-", "-", "-"], ["-", "-", "-", "-"],["-", "-", "-", "-"], ["-", "-", "-", "-"]];
        io.emit('change-board', {board:boardState});

        //Update players array
        gamePlayers = {waiting: users, playing: playing};
        io.emit('player-array', gamePlayers);
    });

    //When user disconnect
    socket.on('disconnect', function () {
        var isPlaying = false;

        //Check the user is currently playing game.
        for(var i = 0; i < playing.length; i++){
            if(playing[i].socket === socket.id) {
                playing.splice(i, 1);
                isPlaying = true;
            }
        }

        //If currently user playing game  => Insert a new player into the game / (users = 0) Set the remaining player to O and wait for another user.
        if(isPlaying){
            boardState = [["-", "-", "-", "-"], ["-", "-", "-", "-"],["-", "-", "-", "-"], ["-", "-", "-", "-"]];

            if(users.length > 0){
                playing.push(users.splice(0, 1)[0]);
                io.to(playing[0].socket).emit("type", data = {type: 'O', turn: "X"});
                io.to(playing[1].socket).emit("type", data = {type: 'X', turn: "X"});
            }else if(playing.length === 1) {
                io.to(playing[0].socket).emit("type", data = {type: 'O', turn: "X"});
            }

            //Empty board
            io.emit('change-board', {board:boardState});
        //User disconnect is not playing user remove from array.
        }else{
            for(var j = 0; j < users.length; j++){
                if(users[j].socket === socket.id)
                    users.splice(j,1);
            }
        }

        //Update players array
        gamePlayers = {waiting: users, playing: playing};
        io.emit('player-array', gamePlayers);
    });
});

//Listen for changes
server.listen(process.env.PORT || 3000, function(){
    console.log('listening on', server.address().port);
});
