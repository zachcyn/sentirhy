const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true},
    password: { type: String, required: true },
    fname: { type: String },
    lname: { type: String },
    dob: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpired: { type: Date },
    isActive: { type: Boolean, default: false},
    activationToken: { type: String },
    activationTokenExpires: { type: Date }
});

const User = mongoose.model('User', userSchema, 'loginCredentials');
module.exports = User;
