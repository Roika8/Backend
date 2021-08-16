const express = require('express');
const router = express.Router();
const chatRoomMessagesService = require('../Services/chatRoomMessagesService')
//Send message
router.post('/new', async (req, res) => {
    try {
        const newMessage = await chatRoomMessagesService.newMessage(req.body)
        res.status(200).send(newMessage)
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})

//Get all chat room messages
router.get('/:chatRoomID', async (req, res) => {
    try {
        const messages = await chatRoomMessagesService.getChatroomMessages(req.params.chatRoomID)
        res.status(200).send(messages);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
})

module.exports = router;