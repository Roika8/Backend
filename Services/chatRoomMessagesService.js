const { chatRoomMessages } = require('../Models/chatRoomMessages');

//Create a new message
const newMessage = async (params) => {
    const newMessage = new chatRoomMessages({
        messageContent: params.content,
        sender: params.sender,
        chatRoomID: params.chatRoomID,
        sendingTime: new Date()
    });
    try {
        const savedMessage = await newMessage.save();
        return savedMessage;
    }
    catch (e) {
        throw new Error(e.message);
    }
}
//Get all chat room messages
const getChatroomMessages = async (chatId) => {
    const dbMessages = await chatRoomMessages.find({
        chatRoomID: chatId
    })

    return dbMessages
}
module.exports = { newMessage, getChatroomMessages }