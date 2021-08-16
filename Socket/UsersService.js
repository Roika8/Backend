const userJoin = (socketID, userID, users) => {
    const user = { socketID, userID }
    !users.some((user) => user.userID === userID) && users.push(user);

}
const getCurrentUser = (id, users) => {
    return users.find(user => user.userID === id);
}
const removeUser = (socketid, users) => {
    users = users.filter(user => user.socketID !== socketid)
}
module.exports = { userJoin, getCurrentUser, removeUser }