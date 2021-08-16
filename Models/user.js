const mongoose = require('mongoose');
const Joi = require('joi');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');

//Model props
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 50,
        unique: true
    },
    firstName: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 50
    },
    password: {
        type: String,
        require: true,
        minlength: 8,
        maxlength: 1024
    },
    email: {
        type: String,
        require: true,
        unique: true,
        minlength: 8,
        maxlength: 255
    },
    status: {
        type: Boolean,
        require: true
    },
    gender: {
        type: Number,
        min: 0,
        max: 1,
        require: false
    }
});
//Generating auth token
userSchema.methods.generateAuthToken = function () {
    const jsonTransfer={ _id: this._id, userName: this.userName, lastName: this.lastName,gender:this.gender,status:this.status,firstName:this.firstName }
    const token = jsonWebToken.sign(jsonTransfer, config.get('jwtPrivateKey'))
    return token;
}
const UserModel = new mongoose.model('User', userSchema);

//Validate user
const validateUser = async (UserModel) => {
    const validSchma = Joi.object({
        userName: Joi.string().min(3).max(50).required(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email({ tlds: { allow: false } }),
        gender: Joi.number(),
        password: Joi.string().min(5).max(1024).required(),
        status: Joi.boolean().required()
    })
    return await validSchma.validateAsync(UserModel);
}

exports.UserModel = UserModel;
exports.validateUser = validateUser;