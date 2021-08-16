const express = require('express');

const router = express.Router();
const userService = require('../Services/usersService');

//Get all the users
router.get('/', async (req, res, next) => {
    try {
        const users = await userService.getUsers()
        res.send(users)
    }
    catch (e) {
        res.status(400).send(e.message);
    }
})
//Register user
router.post('/register', async (req, res, next) => {
    try {
        const userDataToken = await userService.register(req.body);
        res.send(userDataToken)
    }
    catch (e) {
        res.status(400).send(e.message);
    }
})
//Login
router.post('/login', async (req, res, next) => {
    try {
        const userDataToken = await userService.login(req.body);
        res.send(userDataToken)
    }
    catch (e) {
        res.status(400).send(e.message);
    }
})
//logout
router.post('/logout', async (req, res, next) => {
    try {
        const isLoggedOut = await userService.logout(req.body);
        if (isLoggedOut)
            res.send(isLoggedOut)
        else
            throw new Error('Cannot logout,something went wrong')
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
})
//Get user By id
router.get('/:id', async (req, res, next) => {
    try {
        const user = await userService.getUserByID(req.params.id);
        return user ? res.status(202).send(user) : res.status(404).send(undefined);
    }
    catch (e) {
        next(e)
    }
})
module.exports = router;