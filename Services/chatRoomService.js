const { chatRoomModel } = require('../Models/chatRoom');
const usersService = require('../Services/usersService');
const getAllChatRooms = async () => {
    return await chatRoomModel
        .find()
        .populate('user1', 'firstName lastName gender userName -_id ')
        .populate('user2', 'firstName lastName gender userName -_id ')
        .select('_id')

}

//Find chat room by one of the users id
const getChatRoom = async (idFirst, idSecond) => {
    const userA = await usersService.getUserByID(idFirst);
    const userB = await usersService.getUserByID(idSecond);

    let chatRoom = await chatRoomModel.findOne({
        $or: [
            { user1: userA, user2: userB },
            { user1: userB, user2: userA }
        ]
    })
    return chatRoom
}
//Create chat room
const addChatRoom = async (idFirst, idSecond) => {
    const userA = await usersService.getUserByID(idFirst);
    const userB = await usersService.getUserByID(idSecond);
    console.log(idFirst, idSecond)
    let chatRoom = new chatRoomModel({
        user1: userA,
        user2: userB,
    })
    chatRoom = await chatRoom.save();
    return chatRoom;
}

module.exports = { getAllChatRooms, getChatRoom, addChatRoom }