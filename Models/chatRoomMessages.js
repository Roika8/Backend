const mongoose = require('mongoose');

//Contain message content, sender, chat-Room ID, and time
const chatRoomMessages = new mongoose.Schema(
    {
        messageContent: {
            type: String
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        chatRoomID: {
            type: String
        },
        sendingTime: {
            type: Date
        }

    }

);
const chatRoomMessagesModel = new mongoose.model('ChatRoomMessages', chatRoomMessages);

exports.chatRoomMessages = chatRoomMessagesModel;