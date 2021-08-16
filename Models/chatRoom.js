const mongoose = require('mongoose');

//Chat room contains 2 users objects and 1 messages object
const chatRoomSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chatRoomMessages: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoomMessages"
    }
});
const chatRoomModel = new mongoose.model('ChatRoom', chatRoomSchema);
exports.chatRoomModel = chatRoomModel;