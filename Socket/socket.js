const userService = require('./UsersService')
const config = require('config');
const PORT = config.get('port') || process.env.PORT;

const io = require('socket.io')(8900, {
    cors: {
        origin: '*',
    }
});

let onlineUsers = []
// const userJoin = (socketID, userID) => {
//     const user = { socketID, userID }
//     !users.some((user) => user.userID === userID) && users.push(user);

// }
// const getCurrentUser = (id) => {
//     return users.find(user => user.userID === id);
// }
// const removeUser = (socketid) => {
//     users = users.filter(user => user.socketID !== socketid)
// }

let c = 0;

io.on('connection', (socket) => {
    //Get the user when he connecting
    socket.on('addSenderToConnection', (userID) => {
        console.log('A user: ' + userID + "  connected Socket ID: " + socket.id)
        //Adding user to online users with his ID and his socket id he recived
        userService.userJoin(socket.id, userID, onlineUsers);

        // userJoin(socket.id, userID);

        //Send back to client all the online users
        socket.emit('usersFromServer', onlineUsers)
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
            console.log(e + 'user: ' + reciverID + ' is offline ');
        }

    })


    //Get a game request
    socket.on("sendGameRequest", data => {
        const { reciverID, senderID } = data;
        try {
            const reciverUser = userService.getCurrentUser(reciverID, onlineUsers);
            //Send the game request
            socket.to(reciverUser.socketID).emit('reciveGameRequest', senderID);
        }
        catch (e) {
            console.log(e + 'user: ' + reciverID + 'Cannt recive  ');
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
            console.log(e + 'user: ' + reciverID + 'Cannt recive  ');
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
            console.log(e + 'user: ' + reciverID + 'Cannt recive  ');
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
            console.log(e + 'user: ' + reciverID + 'Cannt recive  ');
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
            console.log(e + 'user: ' + reciverID + 'Cannt recive  ');
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
            console.log(e + 'user: ' + reciverID + 'Cannt recive  ');
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
            console.log(e + 'user: ' + reciverID + 'Cannt recive  ');
        }


    })

    socket.on('userExitGame', userID => {
        try {
            const reciverUser = userService.getCurrentUser(userID, onlineUsers);
            console.log('Reciver socket id: ' + reciverUser.socketID);
            socket.to(user.socketID).emit('opponentExitGame');
        }
        catch (e) {
            console.log(e + 'user: ' + userID + 'Cannt recive  ');
        }
    })


    //When disconnect
    socket.on('disconnect', () => {
        console.log('user disconnect Socket id:' + socket.id);
        userService.removeUser(socket.id, onlineUsers);
        io.emit('usersFromServer', onlineUsers)
    });
})
