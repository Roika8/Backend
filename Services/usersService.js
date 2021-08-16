const { UserModel, validateUser } = require('../Models/user');
const bcrypt = require('bcrypt');

const getUsers = async () => {
    return await UserModel.find({}, { userName: 1, firstName: 1, status: 1, lastName: 1, gender: 1 }).sort({ status: -1 });
}
const getUserByID = async (id) => {
    return await UserModel.findById(id)
}
const register = async (params) => {
    const { error } = validateUser(params);
    if (error) throw new Error(error.details[0])


    //Validate user name and password
    let existEmail = await UserModel.findOne({ email: params.email });
    if (existEmail) {
        throw new Error('Email is taken')
    }
    let existUserName = await UserModel.findOne({ userName: params.userName });
    if (existUserName) {
        throw new Error('username is already taken')
    }
    let user = new UserModel({
        userName: params.userName,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
        email: params.email,
        gender: params.gender,
        status: true
    })

    //Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    user = await user.save();
    const token = user.generateAuthToken();
    return token;
}
const login = async (params) => {
    const user = await UserModel.findOne({
        userName: params.userName
    })
    if (!user) throw new Error('Invalid username or password')
    //Compare hashed passwords
    const validPassword = await bcrypt.compare(params.password, user.password)
    if (!validPassword) throw new Error('Invalid username or password')
    const token = user.generateAuthToken();
    user.status = true;
    await user.save();
    return token;
}
const logout = async (params) => {
    console.log(params);
    const user = await UserModel.findByIdAndUpdate(params._id, { status: false })
    if (!user) throw new Error('Somthing went wrong getting the user ')
    return true;
}
module.exports = { getUsers, getUserByID, register, login, logout }