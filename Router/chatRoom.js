const express = require('express');
const router = express.Router();
const chatRoomService = require('../Services/chatRoomService');

// //Get all chat rooms
// router.get('/', async (req, res, next) => {
//     try {
//         const chatRoom = await chatRoomService.getAllChatRooms();
//         res.send(chatRoom)
//     }
//     catch (e) {
//         next(e)
//     }
// })


//Create a chatRoom if not exists
router.post('/', async (req, res, next) => {
    try {
        const ids = {
            first: req.body.id1,
            second: req.body.id2
        }
        //If not find create one
        if (ids.first !== undefined && ids.second !== undefined) {
            let chatRoom = await chatRoomService.getChatRoom(ids.first, ids.second);

            if (!chatRoom) {
                chatRoom = await chatRoomService.addChatRoom(ids.first, ids.second);
            }
            return res.status(200).send(chatRoom._id);
        }
        res.status(200).send('-1')
    }
    catch (e) {
        res.status(404).send('Somthing went wrong getting the chat room')
    }
})


module.exports = router;