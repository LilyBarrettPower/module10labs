const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const connectedUsers = new Set();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
//Q1 - broadcast a message to all users when a user connects 
io.on('connection', (socket) => {
    connectedUsers.add(socket.id);

    // emit the update online users event
    io.emit('update online users', Array.from(connectedUsers));
    // emit the chat message event
    io.emit('chat message', 'A user has connected');

    // Q2 - add support for adding nicknames
    socket.on('set nickname', (nickname) => {
        socket.nickname = nickname;
        connectedUsers.add(socket.nickname);
        // emit the update online users event
        io.emit('update online users', Array.from(connectedUsers));
        socket.broadcast.emit('chat message', `${nickname} has joined the chat`);

    });

    //listen for chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.nickname}: ${msg}`);
    });
    // Q4 - emit the typing event
    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('typing', {
            nickname: socket.nickname,
            isTyping: isTyping
        });
    });
    //Q1 - broadcast a message when a user disconnects
    socket.on('disconnect', () => {
        connectedUsers.delete(socket.nickname);
        io.emit('update online users', Array.from(connectedUsers));
        socket.broadcast.emit('chat message', `${socket.nickname} has left the chat`);
    });
});


server.listen(3050, () => {
    console.log('listening on *:3050');
});

// the application is exposed on port 3050 - this matches the dockerfile

// build an image using: docker build -t lilybarrettpower/dockersocketchat .
// check the image with - docker images
// run the image with - docker run -d -p 80:3050 lilybarrettpower/dockersocketchat
// check the image is running on docker - docker ps -a
// push your repository to docker hub - docker push lilybarrettpower/dockersocketchat
// you can then pull the dockerhub version - docker pull lilybarrettpower/dockersocketchat


// for question 2, i added secrets

