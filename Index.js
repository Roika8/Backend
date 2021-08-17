const config = require('config');
const express = require('express');
const usersService = require('./Services/usersService');
const app = express();
const server = require('http').createServer(app);
const PORT = 8080||process.env.PORT;
const userService = require('./Socket/UsersService')

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

//DB connection
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/chatDB')
mongoose.connect(config.get('db'))
    .then(() => console.log(`connected to ${config.get('db')} database`))
    .catch(() =>
        console.log('somthing went wrong connection to the data base'));


//Middleweres
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.removeHeader('x-powered-by');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    next();
});
app.use('/api/users', require('./Router/users'))
app.use('/api/chatRoom', require('./Router/chatRoom'))
app.use('/api/message', require('./Router/messages'))




//Server up
const serverSocket = server.listen(PORT, () => {
    console.log(`Server is up on: ${PORT}`);
});

const io = require('socket.io')(serverSocket, {
    cors: {
        origin: '*',
    }
});
let onlineUsers = []
console.log(onlineUsers);
io.on('connection', (socket) => {
    //Get the user when he connecting
    socket.on('addSenderToConnection', (userID) => {
        try {
            //Adding user to online users with his ID and his socket id he recived
            if (userID)
                onlineUsers = userService.userJoin(socket.id, userID, onlineUsers);

            //Send back to client all the online users
            socket.emit('usersFromServer', onlineUsers)
        }
        catch (e) {
            //Send back to client all the online users
            io.emit('usersFromServer', onlineUsers)
            socket.to(socket.id).emit('opponentExitGame');
            console.log(e);
        }

    })

    // Send and recive msg
    socket.on("userSendMessage", data => {
        const { content, senderId, reciverID } = data;
        try {
            //Get the user that I want to send him he message
            const reciverUser = userService.getCurrentUser(reciverID, onlineUsers);
            // const user = getCurrentUser(reciverID);

            //Send to him the message
            socket.to(reciverUser.socketID).emit("getMessage", {
                senderId: senderId,
                content: content
            })
        }
        //If the user is offline
        catch (e) {
            // io.to(socket.id).emit('opponentExitGame');
            console.log(e);
        }

    })


    //Get a game request
    socket.on("sendGameRequest", data => {
        const { reciverID, senderID } = data;
        try {
            const reciverUser = userService.getCurrentUser(reciverID, onlineUsers);
            //Send the game request
            io.to(reciverUser.socketID).emit('reciveGameRequest', senderID);
        }
        catch (e) {
            io.to(socket.id).emit('opponentOffline');
            console.log(e);
        }
    })

    //Get game acception
    socket.on('acceptGameRequest', data => {
        try {
            const { reciverID } = data;
            const reciverUser = userService.getCurrentUser(reciverID, onlineUsers);
            //Both players start the game
            io.to(socket.id).to(reciverUser.socketID).emit('startGame', reciverUser.userID);
        }
        catch (e) {
            io.to(socket.id).emit('opponentExitGame');
            console.log(e);
        }
    })

    //Every turn made, update the board
    socket.on('turnMade', data => {
        try {
            const { reciverUserID, pointsClone } = data;
            const reciverUser = userService.getCurrentUser(reciverUserID, onlineUsers);
            io.to(socket.id).to(reciverUser.socketID).emit('refreshBoard', { pointsClone });
        }
        catch (e) {
            io.to(socket.id).emit('opponentExitGame');
            console.log(e);
        }
    })
    //Turns handler
    socket.on('isPlayer1Turn', data => {
        try {
            const { isPlayer1Turn, reciverUserID } = data;
            const reciverUser = userService.getCurrentUser(reciverUserID, onlineUsers);
            io.to(socket.id).to(reciverUser.socketID).emit('handleTurns', isPlayer1Turn);
        }
        catch (e) {
            io.to(socket.id).emit('opponentExitGame');
            console.log(e);
        }
    })
    //Get and set player 1 eaten checkers
    socket.on('eatenPlayer1Checkers', data => {
        try {
            const { player1EatenCheckers, reciverUserID } = data;
            const reciverUser = userService.getCurrentUser(reciverUserID, onlineUsers);
            io.to(socket.id).to(reciverUser.socketID).emit('getPlayer1EatenCheckers', { player1EatenCheckers });
        }
        catch (e) {
            io.to(socket.id).emit('opponentExitGame');
            console.log(e);
        }
    })
    //Get and set player 2 eaten checkers
    socket.on('eatenPlayer2Checkers', data => {
        try {
            const { player2EatenCheckers, reciverUserID } = data;
            const reciverUser = userService.getCurrentUser(reciverUserID, onlineUsers);
            io.to(socket.id).to(reciverUser.socketID).emit('getPlayer2EatenCheckers', { player2EatenCheckers });
        }
        catch (e) {
            io.to(socket.id).emit('opponentExitGame');
            console.log(e);
        }
    })

    //Handle dices values
    socket.on('sendDicesValues', data => {
        try {
            const { val1, val2, reciverUserID } = data
            const reciverUser = userService.getCurrentUser(reciverUserID, onlineUsers);
            io.to(reciverUser.socketID).emit('getOppenentDicesValues', { val1, val2 });
        }
        catch (e) {
            io.to(socketID).emit('opponentExitGame');
            console.log(e);
        }


    })

    socket.on('userExitGame', userID => {
        try {
            const reciverUser = userService.getCurrentUser(userID, onlineUsers);
            console.log('Reciver socket id: ' + reciverUser.socketID);
            console.log('Sender socket id: ' + socket.id);

            io.to(reciverUser.socketID).to(socket.id).emit('opponentExitGame');
        }
        catch (e) {
            io.to(socket.id).emit('opponentExitGame');
            console.log(e);
        }
    })


    //When disconnect
    socket.on('disconnect', () => {
        try {
            console.log('user disconnect Socket id:' + socket.id);
            onlineUsers = userService.removeUser(socket.id, onlineUsers);
            console.log(onlineUsers);
            io.emit('usersFromServer', onlineUsers)
        }
        catch (e) {
            console.log(e);
        }
    });
})